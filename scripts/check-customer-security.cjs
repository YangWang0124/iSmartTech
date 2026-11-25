const {spawn,spawnSync}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'customer-security-')),db=path.join(dir,'test.sqlite'),dll=root+'/backend/bin/Debug/net8.0/Retail.dll';
const password=crypto.randomBytes(18).toString('hex'),nextPassword=crypto.randomBytes(18).toString('hex'),resetPassword=crypto.randomBytes(18).toString('hex');
assert.equal(spawnSync('dotnet',[dll,'--db',db,'init','test-owner'],{cwd:root,input:(password+'\n').repeat(2)}).status,0);
let server,origin;const jar={admin:'',a:'',b:'',c:''};
async function start(){server=spawn('dotnet',[dll,'--db',db,'serve','--port','0'],{cwd:root+'/backend',env:{...process.env,ISMARTTECH_EMAIL_MODE:'pickup',ISMARTTECH_PUBLIC_ADMIN:'0',ISMARTTECH_SITE_URL:undefined},stdio:['ignore','pipe','pipe']});origin=await new Promise((resolve,reject)=>{server.stdout.on('data',b=>{const m=b.toString().match(/Now listening on: (http:\/\/\S+)/);if(m)resolve(m[1]);});server.on('exit',code=>reject(Error('server exited '+code)));});}
async function stop(){await new Promise(resolve=>{server.once('exit',resolve);server.kill();});}
async function request(route,body,who='a',status=200){const headers={Cookie:jar[who]};if(body!==undefined){headers['Content-Type']='application/json';headers[route.startsWith('/admin')?'X-Admin-Request':'X-Customer-Request']='1';}const r=await fetch(origin+route,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body)});if(r.headers.has('set-cookie'))jar[who]=r.headers.get('set-cookie').split(';')[0];const x=await r.json().catch(()=>null);assert.equal(r.status,status,JSON.stringify(x));return x;}
const customer=(route,data,who='a',status=200)=>request('/api/retail/customer/'+route,data,who,status),op=(name,values=[],status=200)=>request('/admin/api/operations/'+name,{values},'admin',status);
function sql(query){const r=spawnSync('python3',['-c','import sqlite3,sys,json; c=sqlite3.connect(sys.argv[1]); rows=c.execute(sys.argv[2]).fetchall();c.commit();print(json.dumps(rows))',db,query],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);}
async function action(subject){const list=await op('mail-outbox'),mail=await op('mail-open',[String(list.find(m=>m.subject.startsWith(subject)).id)]);const token=mail.body.match(/#token=([A-F0-9]{64})/)[1];assert.ok(mail.body.includes(origin));return token;}
(async()=>{
await start();await request('/admin/api/login',{user:'test-owner',password},'admin');
const signup=await customer('signup',{email:'security@example.invalid',password});assert.equal(signup.email_verified,0);assert.equal(signup.price_tier,undefined);assert.equal(JSON.stringify(signup).includes('token='),false);
const verify=await action('Verify');await customer('verify-email',{token:'bad'},'a',400);await customer('reset-password',{token:verify,password:nextPassword},'a',400);
await op('product-content',['SECURITY-TEST',JSON.stringify({name:'Security fixture',brand:'Test',category:'Other'})]);await op('receive',['SECURITY-TEST','3','Test']);await op('tier-set',['SECURITY-TEST','S · Trade Price','1000']);
const checkout={address:'1 Test Road',phone:'0212345678',items:[{sku:'SECURITY-TEST',quantity:'1'}]};let blocked=await customer('checkout/preview',checkout,'a',400);assert.match(blocked.error,/Verify your email/);
await customer('resend-verification',{});assert.equal((await op('mail-outbox')).length,1);
await customer('verify-email',{token:verify});await customer('verify-email',{token:verify},'a',400);assert.equal((await customer('session')).user.email_verified,1);await customer('checkout/preview',checkout);
await request('/admin/api/operations/mail-outbox',{values:[]},'a',401);
await customer('signin',{email:'security@example.invalid',password},'b');
await customer('change-password',{currentPassword:'incorrect',password:nextPassword},'a',400);
await customer('change-password',{currentPassword:password,password:'short'},'a',400);
await customer('change-password',{currentPassword:password,password:nextPassword});assert.ok((await customer('session')).user);assert.equal((await customer('session',undefined,'b')).user,null);
await customer('signin',{email:'security@example.invalid',password},'b',401);await customer('signin',{email:'security@example.invalid',password:nextPassword},'b');
const known=await customer('forgot-password',{email:'security@example.invalid'}),unknown=await customer('forgot-password',{email:'missing@example.invalid'});assert.deepEqual(known,unknown);assert.equal(JSON.stringify(known).includes('token='),false);
const reset=await action('Reset');assert.ok((await customer('session',undefined,'b')).user);await customer('verify-email',{token:reset},'a',400);
assert.equal(sql('SELECT COUNT(*) FROM customer_action_tokens WHERE length(token_hash)=64')[0][0],2);assert.equal(sql("SELECT COUNT(*) FROM customer_email_outbox WHERE protected_body LIKE '%#token=%'")[0][0],0);
// Start a fresh limiter window while keeping the same database and cookies.
await stop();await start();
sql("UPDATE customer_action_tokens SET expires_at='2000-01-01' WHERE purpose='reset'");await customer('reset-password',{token:reset,password:resetPassword},'a',400);
sql("UPDATE customer_action_tokens SET expires_at='2099-01-01' WHERE purpose='reset'");await customer('reset-password',{token:reset,password:resetPassword});assert.equal((await customer('session')).user,null);assert.equal((await customer('session',undefined,'b')).user,null);
await customer('reset-password',{token:reset,password:nextPassword},'a',400);await customer('signin',{email:'security@example.invalid',password:nextPassword},'a',401);await customer('signin',{email:'security@example.invalid',password:resetPassword});
// Email verification and outstanding links are bound to the exact current address.
sql("UPDATE customers SET email='changed@example.invalid' WHERE email='security@example.invalid'");assert.equal((await customer('session')).user.email_verified,0);
await customer('resend-verification',{});const changed=await action('Verify');sql("UPDATE customers SET email='other@example.invalid' WHERE email='changed@example.invalid'");await customer('verify-email',{token:changed},'a',400);
sql("UPDATE customers SET email='changed@example.invalid',active=0 WHERE email='other@example.invalid'");await customer('verify-email',{token:changed},'a',400);const count=(await op('mail-outbox')).length;await customer('forgot-password',{email:'changed@example.invalid'});assert.equal((await op('mail-outbox')).length,count);
sql("UPDATE customers SET active=1 WHERE email='changed@example.invalid'");await customer('signin',{email:'changed@example.invalid',password:resetPassword});await customer('verify-email',{token:changed});assert.equal((await customer('session')).user.email_verified,1);
for(let i=0;i<16&&!fs.existsSync(path.join(dir,'email-outbox'));i++)await new Promise(r=>setTimeout(r,400));
assert.ok(fs.readdirSync(path.join(dir,'email-outbox')).some(n=>n.endsWith('.eml')));assert.equal(fs.statSync(path.join(dir,'email-outbox')).mode&0o777,0o700);
console.log('PASS: verification gating/resend, purpose/email binding, expiry/single use, password changes/reset, session revocation, generic recovery responses, private local delivery and encrypted queued messages.');
if(process.argv.includes('--browser')){fs.writeFileSync('/tmp/ismarttech-security-browser.json',JSON.stringify({origin,password:resetPassword,email:'changed@example.invalid',ownerPassword:password,db}));console.log('Browser fixture ready at '+origin);return;}
await stop();fs.rmSync(dir,{recursive:true,force:true});
})().catch(async e=>{console.error(e);process.exitCode=1;if(server&&!server.killed)await stop();fs.rmSync(dir,{recursive:true,force:true});});
