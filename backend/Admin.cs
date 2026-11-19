using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Data.Sqlite;

static class Admin
{
    private const int UploadLimit = 8 * 1024 * 1024;

    public static void Configure(WebApplicationBuilder builder, string database)
    {
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
        {
            var databaseKey = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(Path.GetFullPath(database))))[..16];
            options.Cookie.Name = "iSmartTech.Admin." + databaseKey;
            options.Events.OnValidatePrincipal = async context =>
            {
                using var store = new RetailStore(database);
                var user = context.Principal?.Identity?.Name;
                var role = context.Principal?.FindFirstValue(ClaimTypes.Role);
                var staff = store.Query("SELECT role FROM staff WHERE username=$0", user);
                if (staff.Count == 0 || !Equals(staff[0]["role"], role))
                {
                    context.RejectPrincipal();
                    await context.HttpContext.SignOutAsync();
                }
            };
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            options.ExpireTimeSpan = TimeSpan.FromHours(4);
            options.SlidingExpiration = false;
            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = 403;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401;
                return Task.CompletedTask;
            };
        });
        builder.Services.AddAuthentication().AddCookie("Customer", options =>
        {
            var key=Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(Path.GetFullPath(database))))[..16];
            options.Cookie.Name="iSmartTech.Customer."+key;
            options.Cookie.HttpOnly=true;options.Cookie.SameSite=SameSiteMode.Strict;
            options.Cookie.SecurePolicy=CookieSecurePolicy.SameAsRequest;
            options.ExpireTimeSpan=TimeSpan.FromDays(7);options.SlidingExpiration=false;
            options.Events.OnRedirectToLogin=context=>{context.Response.StatusCode=401;return Task.CompletedTask;};
            options.Events.OnRedirectToAccessDenied=context=>{context.Response.StatusCode=403;return Task.CompletedTask;};
            options.Events.OnValidatePrincipal=async context=>
            {
                using var store=new RetailStore(database);
                var id=context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                if(!long.TryParse(id,out var customerId) || store.Query("SELECT 1 FROM customers c JOIN customer_credentials a ON a.customer_id=c.id WHERE c.id=$0 AND c.active=1",customerId).Count!=1)
                {context.RejectPrincipal();await context.HttpContext.SignOutAsync("Customer");}
            };
        });
        builder.Services.AddAuthorization();
        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = 429;
            options.AddPolicy("customer-auth", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions
                {PermitLimit=20,Window=TimeSpan.FromMinutes(1),QueueLimit=0}));
            options.AddFixedWindowLimiter("login", limiter =>
            {
                limiter.Window = TimeSpan.FromMinutes(1);
                limiter.PermitLimit = 12;
                limiter.QueueLimit = 0;
            });
        });
    }

    public static void Map(WebApplication app, string database)
    {
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments("/admin") || context.Request.Path.StartsWithSegments("/api/retail/customer"))
            {
                if(context.Request.Path.StartsWithSegments("/api/retail/customer"))
                {
                    var limit=context.Features.Get<Microsoft.AspNetCore.Http.Features.IHttpMaxRequestBodySizeFeature>();
                    if(limit is {IsReadOnly:false})limit.MaxRequestBodySize=131072;
                    if(context.Request.ContentLength>131072){context.Response.StatusCode=413;return;}
                }
                if (!context.Request.IsHttps && !(Environment.GetEnvironmentVariable("ISMARTTECH_PUBLIC_ADMIN") != "1" &&
                    context.Connection.RemoteIpAddress is { } ip &&
                    System.Net.IPAddress.IsLoopback(ip) &&
                    (context.Request.Host.Host is "localhost" or "127.0.0.1" or "[::1]")))
                {
                    context.Response.StatusCode = 403;
                    return;
                }
                context.Response.Headers.CacheControl = "no-store";
                context.Response.Headers.ContentSecurityPolicy = "default-src 'self'; img-src 'self' https: blob:; frame-ancestors 'none'; base-uri 'none'";
                context.Response.Headers.XContentTypeOptions = "nosniff";
                if (HttpMethods.IsPost(context.Request.Method) &&
                    (context.Request.Path.StartsWithSegments("/admin") ? context.Request.Headers["X-Admin-Request"] != "1" : context.Request.Headers["X-Customer-Request"] != "1"))
                {
                    context.Response.StatusCode = 403;
                    return;
                }
            }
            await next();
        });
        app.UseStaticFiles();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseRateLimiter();
        app.MapGet("/admin", () => Results.Redirect("/admin/index.html"));
        MapCustomers(app,database);
        var api = app.MapGroup("/admin/api");
        api.MapPost("/login", async (Login login, HttpContext context) =>
        {
            if (string.IsNullOrWhiteSpace(login.User) || login.User.Length > 100 ||
                string.IsNullOrEmpty(login.Password) || login.Password.Length > 256)
                return Results.Unauthorized();
            using var store = new RetailStore(database);
            var role = store.Authenticate(login.User, login.Password);
            if (role == null) return Results.Unauthorized();
            var identity = new ClaimsIdentity(
                [new Claim(ClaimTypes.Name, login.User), new Claim(ClaimTypes.Role, role)],
                CookieAuthenticationDefaults.AuthenticationScheme);
            await context.SignInAsync(new ClaimsPrincipal(identity));
            return Results.Ok(Session(identity));
        }).RequireRateLimiting("login");
        api.MapPost("/logout", async (HttpContext context) =>
        {
            await context.SignOutAsync();
            return Results.NoContent();
        }).RequireAuthorization();
        api.MapGet("/session", (HttpContext context) => Results.Ok(Session((ClaimsIdentity)context.User.Identity!)))
            .RequireAuthorization();
        app.MapGet("/api/retail/images/{id}", (string id, HttpContext context) =>
        {
            using var store = new RetailStore(database);
            var images = store.Query("SELECT content_type,content FROM product_images WHERE id=$0", id);
            if (images.Count == 0) return Results.NotFound();
            context.Response.Headers.CacheControl = "public,max-age=31536000,immutable";
            context.Response.Headers.XContentTypeOptions = "nosniff";
            return Results.File((byte[])images[0]["content"]!, (string)images[0]["content_type"]!);
        });
        api.MapPost("/images", async (HttpContext context) =>
        {
            if (!RetailStore.Commands(context.User.FindFirstValue(ClaimTypes.Role)!).Contains("product-content"))
                return Results.Forbid();
            if (context.Request.ContentLength is null or > UploadLimit + 65536 || !context.Request.HasFormContentType)
                return Results.BadRequest(new { error = "Choose a PNG, JPEG or WebP image under 8 MB." });
            try
            {
                var form = await context.Request.ReadFormAsync();
                var file = form.Files.GetFile("file");
                if (form.Files.Count != 1 || file == null || file.Length is <= 12 or > UploadLimit)
                    return Results.BadRequest(new { error = "Choose one image under 8 MB." });
                using var content = new MemoryStream();
                await file.CopyToAsync(content);
                using var store = new RetailStore(database);
                return Results.Ok(new { url = store.SaveProductImage(content.ToArray(), context.User.Identity!.Name!) });
            }
            catch (Exception error) when (error is ArgumentException or InvalidDataException or IOException)
            {
                return Results.BadRequest(new { error = "Choose a valid PNG, JPEG or WebP image under 8 MB." });
            }
        }).RequireAuthorization();
        api.MapPost("/operations/{command}", async (string command, HttpContext context) =>
        {
            var role = context.User.FindFirstValue(ClaimTypes.Role)!;
            if (!RetailStore.Commands(role).Contains(command)) return Results.Forbid();
            string? temporary = null;
            try
            {
                Operation? operation;
                if (command is "import" or "workbook-preview" or "workbook-import")
                {
                    if (context.Request.ContentLength is null or > UploadLimit || !context.Request.HasFormContentType)
                        return Results.BadRequest(new { error = "Choose a file under 8 MB." });
                    var file = (await context.Request.ReadFormAsync()).Files.GetFile("file");
                    var extension = command == "import" ? ".csv" : ".xlsx";
                    if (file == null || !file.FileName.EndsWith(extension, StringComparison.OrdinalIgnoreCase))
                        return Results.BadRequest(new { error = $"Choose a {extension} file." });
                    temporary = Directory.CreateTempSubdirectory("ismarttech-").FullName;
                    var name = Path.GetFileName(file.FileName.Replace('\\', '/'));
                    var path = Path.Combine(temporary, name);
                    await using (var target = File.Create(path)) await file.CopyToAsync(target);
                    operation = new Operation([path], null);
                }
                else
                {
                    if (context.Request.ContentLength is null or > 524288)
                        return Results.BadRequest(new { error = "Invalid request size." });
                    operation = await context.Request.ReadFromJsonAsync<Operation>();
                }
                if (operation?.Values == null || operation.Values.Any(value => value == null || value.Length > (command is "customer-invite" or "order-shipping" or "product-content" or "customer-save" or "order-create" or "order-payment" or "fulfilment-save" or "return-request" or "return-process" or "refund-record" ? 250000 : 1000)))
                    return Results.BadRequest(new { error = "Invalid fields." });
                if (command == "staff" && operation.Password is not { Length: >= 12 and <= 256 })
                    return Results.BadRequest(new { error = "Enter a new password between 12 and 256 characters." });
                using var store = new RetailStore(database);
                var args = new Arguments(command, context.User.Identity!.Name!, database, operation.Values);
                return Results.Ok(store.RunAuthorized(args, role, operation.Password));
            }
            catch (Exception error) when (error is ArgumentException or FormatException or OverflowException or InvalidOperationException)
            {
                return Results.BadRequest(new { error = error.Message });
            }
            catch (SqliteException error) when (error.SqliteErrorCode == 19)
            {
                return Results.BadRequest(new { error = "This change conflicts with an existing record or has an invalid value." });
            }
            catch (Exception error) when (error is IOException or System.Xml.XmlException or System.Text.Json.JsonException)
            {
                return Results.BadRequest(new { error = "The uploaded file or request could not be read." });
            }
            finally
            {
                if (temporary != null) Directory.Delete(temporary, recursive: true);
            }
        }).RequireAuthorization();
    }

    private static void MapCustomers(WebApplication app,string database)
    {
        var group=app.MapGroup("/api/retail/customer");
        group.AddEndpointFilter(async (invocation,next) =>
        {
            var context=invocation.HttpContext;
            if(context.Request.ContentLength>131072)return Results.BadRequest(new{error="Request is too large."});
            try {return await next(invocation);}
            catch(Exception error) when(error is ArgumentException or InvalidOperationException or FormatException or OverflowException or System.Text.Json.JsonException)
            {return Results.BadRequest(new{error=error.Message});}
            catch(SqliteException error) when(error.SqliteErrorCode==19)
            {return Results.BadRequest(new{error="This request conflicts with an existing record. Refresh and try again."});}
        });
        async Task<object> SignIn(HttpContext context,long id,bool remember)
        {
            var identity=new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier,id.ToString())],"Customer");
            await context.SignInAsync("Customer",new ClaimsPrincipal(identity),new AuthenticationProperties
            {IsPersistent=remember,ExpiresUtc=DateTimeOffset.UtcNow.AddDays(remember?7:1)});
            using var store=new RetailStore(database);return store.CustomerProfile(id);
        }
        group.MapPost("/signup",async (System.Text.Json.Nodes.JsonObject data,HttpContext context)=>
        {
            using var store=new RetailStore(database);
            var id=store.Transaction(()=>store.RegisterCustomer(data));
            return Results.Ok(await SignIn(context,id,data["remember"]?.GetValue<bool>()??false));
        }).RequireRateLimiting("customer-auth");
        group.MapPost("/signin",async (CustomerLogin data,HttpContext context)=>
        {
            if(data.Email is not {Length:>0 and <=254} || data.Password is not {Length:>0 and <=256})return Results.Unauthorized();
            using var store=new RetailStore(database);var id=store.AuthenticateCustomer(data.Email,data.Password);
            if(id==null)return Results.Json(new{error="Incorrect email or password, or the account is suspended."},statusCode:401);
            return Results.Ok(await SignIn(context,id.Value,data.Remember));
        }).RequireRateLimiting("customer-auth");
        group.MapGet("/session",async (HttpContext context)=>
        {
            var auth=await context.AuthenticateAsync("Customer");
            if(!auth.Succeeded)return Results.Ok(new{user=(object?)null});
            using var store=new RetailStore(database);return Results.Ok(new{user=store.CustomerProfile(long.Parse(auth.Principal!.FindFirstValue(ClaimTypes.NameIdentifier)!))});
        });
        group.MapPost("/signout",async(HttpContext context)=>{await context.SignOutAsync("Customer");return Results.NoContent();});
        var secured=group.MapGroup("").RequireAuthorization(new Microsoft.AspNetCore.Authorization.AuthorizeAttribute{AuthenticationSchemes="Customer"});
        long CustomerId(HttpContext context)=>long.Parse(context.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        secured.MapPost("/profile",(System.Text.Json.Nodes.JsonObject data,HttpContext context)=>
        {using var store=new RetailStore(database);return Results.Ok(store.Transaction(()=>store.CustomerUpdate(CustomerId(context),data)));});
        secured.MapGet("/orders",(HttpContext context)=>
        {using var store=new RetailStore(database);return Results.Ok(store.Transaction(()=>store.CustomerOrders(CustomerId(context))));});
        secured.MapPost("/checkout/preview",(System.Text.Json.Nodes.JsonObject data,HttpContext context)=>
        {using var store=new RetailStore(database);return Results.Ok(store.Transaction(()=>store.CustomerCheckout(CustomerId(context),data,false)));});
        secured.MapPost("/checkout",(System.Text.Json.Nodes.JsonObject data,HttpContext context)=>
        {using var store=new RetailStore(database);return Results.Ok(store.Transaction(()=>store.CustomerCheckout(CustomerId(context),data,true)));});
        secured.MapPost("/returns",(System.Text.Json.Nodes.JsonObject data,HttpContext context)=>
        {using var store=new RetailStore(database);return Results.Ok(store.Transaction(()=>store.CustomerReturn(CustomerId(context),data)));});
    }
    private sealed record CustomerLogin(string Email,string Password,bool Remember);

    private static object Session(ClaimsIdentity identity)
    {
        var role = identity.FindFirst(ClaimTypes.Role)!.Value;
        return new { user = identity.Name, role, commands = RetailStore.Commands(role),
            rolePermissions = role == "owner" ? new[] { "sales", "warehouse", "finance", "owner" }
                .ToDictionary(name => name, name => RetailStore.Commands(name)) : null };
    }

    private sealed record Login(string User, string Password);
    private sealed record Operation(string[] Values, string? Password);
}
