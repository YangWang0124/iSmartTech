const {spawn,spawnSync}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),db=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'customer-store-')),'test.sqlite'),dll=root+'/backend/bin/Debug/net8.0/Retail.dll',password=crypto.randomBytes(18).toString('hex');
assert.equal(spawnSync('dotnet',[dll,'--db',db,'init','test-owner'],{cwd:root,input:(password+'\n').repeat(2)}).status,0);
const server=spawn('dotnet',[dll,'--db',db,'serve','--port','0'],{cwd:root+'/backend',stdio:['ignore','pipe','pipe']});
(async()=>{const origin=await new Promise((resolve,reject)=>{server.stdout.on('data',b=>{const m=b.toString().match(/Now listening on: (http:\/\/\S+)/);if(m)resolve(m[1]);});server.on('exit',code=>reject(new Error('server exited '+code)));});
const jar={admin:'',a:'',b:''};
async function request(url,body,who='a',status=200,csrf=true){const headers={Cookie:jar[who]};if(body!==undefined){headers['Content-Type']='application/json';if(csrf)headers[url.startsWith('/admin')?'X-Admin-Request':'X-Customer-Request']='1';}const r=await fetch(origin+url,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body)});if(r.headers.has('set-cookie'))jar[who]=r.headers.get('set-cookie').split(';')[0];const x=await r.json().catch(()=>null);assert.equal(r.status,status,JSON.stringify(x));return x;}
const op=(name,values,status)=>request('/admin/api/operations/'+name,{values},'admin',status),cmd=(name,payload,status)=>op(name,[JSON.stringify(payload)],status),customer=(route,data,who='a',status=200,csrf=true)=>request('/api/retail/customer/'+route,data,who,status,csrf);
await request('/admin/api/login',{user:'test-owner',password},'admin');
await op('product-content',['ONLINE-TEST',JSON.stringify({name:'Online store test camera',brand:'Test',category:'Wired IP Cameras',categoryIds:[2,9,14]})]);await op('receive',['ONLINE-TEST','10','Test stock']);await op('tier-set',['ONLINE-TEST','S · Trade Price','10000']);await op('tier-set',['ONLINE-TEST','S · 1.5','8000']);
await customer('signup',{name:'Customer A',email:'a@example.invalid',password,remember:true});let session=await customer('session');assert.equal(session.user.name,'Customer A');const a=session.user.id;
await customer('signin',{email:'a@example.invalid',password:'wrong-password'},'b',401);
await customer('signup',{name:'Customer B',email:'b@example.invalid',password,remember:false},'b');const b=(await customer('session',undefined,'b')).user.id;
await customer('signup',{name:'Imposter',email:'a@example.invalid',password},'b',400);
await cmd('customer-save',{...session.user,id:String(a),version:String(session.user.version),active:true,can_purchase:true,price_tier:'S · 1.5'});
let products=await request('/api/retail/products',undefined,'a');assert.equal(products.find(p=>p.sku==='ONLINE-TEST').price,80);assert.equal(products.find(p=>p.sku==='ONLINE-TEST').priceOnRequest,false);
products=await request('/api/retail/products',undefined,'b');assert.equal(products.find(p=>p.sku==='ONLINE-TEST').price,100);
await customer('profile',{name:'Customer A updated',company:'Test company',phone:'0210000000',address:'1 Test Road',version:String((await customer('session')).user.version),price_tier:'S · Trade Price',can_purchase:1});assert.equal((await customer('session')).user.price_tier,'S · 1.5');
const body={address:'1 Test Road',phone:'0210000000',items:[{sku:'ONLINE-TEST',quantity:'2',unitPrice:1}],request_key:crypto.randomUUID()};
await customer('checkout/preview',body,'a',403,false);
let review=await customer('checkout/preview',body);assert.equal(review.total_cents,16000);assert.equal(review.shipping_pending,true);
await customer('checkout',{...body,expected_total_cents:1},'a',400);
const checkout={...body,expected_total_cents:review.total_cents};const order=await customer('checkout',checkout);assert.equal(order.status,'reserved');const id=String(order.id);const replay=await customer('checkout',checkout);assert.equal(replay.id,order.id);
await customer('checkout',{...checkout,items:[{sku:'ONLINE-TEST',quantity:'3'}]},'a',400);
assert.equal((await op('stock-details',['ONLINE-TEST'])).reserved,2);assert.equal((await customer('orders',undefined,'b')).length,0);
await customer('returns',{order_id:id,sku:'ONLINE-TEST',quantity:'1',reason:'Not mine'},'b',400);
await cmd('order-payment',{order_id:id,amount_cents:'16000',method:'bank transfer',reference:'ONLINE-PAY'},400);
await cmd('order-shipping',{order_id:id,shipping_cents:'1500'});assert.equal((await customer('orders'))[0].total_cents,17500);
await cmd('order-payment',{order_id:id,amount_cents:'17500',method:'bank transfer',reference:'ONLINE-PAY'});
await cmd('fulfilment-save',{order_id:id,version:'1',method:'delivery',status:'dispatched',address:'1 Test Road',carrier:'Test courier',tracking:'ONLINE-TRACK'});assert.equal((await customer('orders'))[0].fulfilment.tracking,'ONLINE-TRACK');
await customer('returns',{order_id:id,sku:'ONLINE-TEST',quantity:'1',reason:'Test return',serial:''});let dash=await op('commerce-data',[]);const ret=dash.returns[0];await cmd('return-process',{request_id:String(ret.id),decision:'approved'});await cmd('return-process',{request_id:String(ret.id),decision:'received',sellable:true});await cmd('refund-record',{request_id:String(ret.id),amount_cents:'8000',reference:'ONLINE-REFUND'});assert.equal((await customer('orders'))[0].requests[0].refunded_cents,8000);
let account=(await customer('session')).user;await cmd('customer-save',{...account,id:String(a),version:String(account.version),active:true,can_purchase:false});await customer('checkout/preview',body,'a',400);
account=(await customer('session')).user;await cmd('customer-save',{...account,id:String(a),version:String(account.version),active:false,can_purchase:false});assert.equal((await customer('session')).user,null);await customer('orders',undefined,'a',401);
await cmd('customer-save',{id:'',name:'Invited trade customer',email:'invite@example.invalid',active:true,can_purchase:true,price_tier:'S · 1.5'});dash=await op('commerce-data',[]);const invited=dash.customers.find(c=>c.email==='invite@example.invalid');await customer('signup',{name:'Bad claim',email:invited.email,password},'a',400);const invitation=await cmd('customer-invite',{customer_id:String(invited.id)});await customer('signup',{name:'Invited trade customer',email:invited.email,password,invitation:invitation.invitation},'a');assert.equal((await customer('session')).user.price_tier,'S · 1.5');
await customer('signout',{},'b',204);await customer('orders',undefined,'b',401);await customer('signin',{email:'b@example.invalid',password,remember:false},'b');assert.equal((await customer('session',undefined,'b')).user.id,b);
// Keep a browser test customer with a full order history.
account=invited;await cmd('customer-save',{...account,id:String(a),version:String((await op('commerce-data',[])).customers.find(c=>c.id===a).version),name:'Customer A updated',email:'a@example.invalid',active:true,can_purchase:true});
await request('/admin/api/session',undefined,'a',401);
await customer('orders',undefined,'admin',401);
await customer('signup',{name:'Kit customer',email:'kit@example.invalid',password},'b');
for(const [sku,name,categories,tags,price] of [['KIT-CAMERA','Test kit camera',[2,9,14],[216],10000],['KIT-RECORDER','Test kit recorder',[2,10,18],[225,257],20000],['KIT-HDD','Test HDD',[2,12],[],5000]]){
 await op('product-content',[sku,JSON.stringify({name,brand:'Test',category:categories.includes(18)?'NVR':categories.includes(14)?'Wired IP Cameras':'Hard Drives',categoryIds:categories,tagIds:tags})]);
 await op('receive',[sku,'10','Kit test']);await op('tier-set',[sku,'S · Trade Price',String(price)]);
}
const kit={address:'2 Kit Test Road',phone:'0212345678',items:[{sku:'KIT-CAMERA',quantity:'2',kit:'kit-test',installation:{storeys:'1',noRoofAccess:false}},{sku:'KIT-RECORDER',quantity:'1',kit:'kit-test'},{sku:'KIT-HDD',quantity:'1',kit:'kit-test'}]};
const kitReview=await customer('checkout/preview',kit,'b');assert.equal(kitReview.subtotal_cents,41000);assert.equal(kitReview.installation_cents,9000);
await customer('checkout/preview',{...kit,items:[kit.items[0]]},'b',400);
await customer('checkout/preview',{...kit,items:[{...kit.items[0],quantity:'5'},...kit.items.slice(1)]},'b',400);
await customer('checkout/preview',{...kit,items:[kit.items[0],kit.items[1],{...kit.items[2],quantity:'2'}]},'b',400);
await customer('checkout/preview',{...kit,items:[{sku:'KIT-CAMERA',quantity:'1',installation:{storeys:'1',noRoofAccess:false}}]},'b',400);
console.log('PASS: customer/staff session isolation and CCTV kit pricing, optional installation, brand/channel/storage validation.');
console.log('PASS: server auth, invitation protection, session isolation/revocation, account pricing, profile permissions, CSRF protection, checkout repricing/idempotency, reservations, shipping charge, payment, tracking, customer returns/refunds and order ownership.');


})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{server.on('exit',()=>fs.rmSync(path.dirname(db),{recursive:true,force:true}));server.kill();});
