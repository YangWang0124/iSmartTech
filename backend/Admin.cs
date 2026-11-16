using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Data.Sqlite;

static class Admin
{
    private const int UploadLimit = 8 * 1024 * 1024;

    public static void Configure(WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
        {
            options.Cookie.Name = "iSmartTech.Admin";
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
        builder.Services.AddAuthorization();
        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = 429;
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
            if (context.Request.Path.StartsWithSegments("/admin"))
            {
                if (!context.Request.IsHttps && !(Environment.GetEnvironmentVariable("ISMARTTECH_PUBLIC_ADMIN") != "1" &&
                    context.Connection.RemoteIpAddress is { } ip &&
                    System.Net.IPAddress.IsLoopback(ip) &&
                    (context.Request.Host.Host is "localhost" or "127.0.0.1" or "[::1]")))
                {
                    context.Response.StatusCode = 403;
                    return;
                }
                context.Response.Headers.CacheControl = "no-store";
                context.Response.Headers.ContentSecurityPolicy = "default-src 'self'; frame-ancestors 'none'; base-uri 'none'";
                context.Response.Headers.XContentTypeOptions = "nosniff";
                if (HttpMethods.IsPost(context.Request.Method) &&
                    context.Request.Headers["X-Admin-Request"] != "1")
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
                    if (context.Request.ContentLength is null or > 32768)
                        return Results.BadRequest(new { error = "Invalid request size." });
                    operation = await context.Request.ReadFromJsonAsync<Operation>();
                }
                if (operation?.Values == null || operation.Values.Any(value => value == null || value.Length > 1000))
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

    private static object Session(ClaimsIdentity identity)
    {
        var role = identity.FindFirst(ClaimTypes.Role)!.Value;
        return new { user = identity.Name, role, commands = RetailStore.Commands(role) };
    }

    private sealed record Login(string User, string Password);
    private sealed record Operation(string[] Values, string? Password);
}
