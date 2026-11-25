import { useRef, useState, type FormEvent } from "react";

export function InstallationServicesPage() {
  const [sent, setSent] = useState(false);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[reference,setReference]=useState('');
  const requestKey=useRef(crypto.randomUUID());
  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();if(busy)return;setBusy(true);setError('');
    const values=Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response=await fetch('/api/retail/enquiries',{method:'POST',headers:{'Content-Type':'application/json','X-Customer-Request':'1'},body:JSON.stringify({...values,kind:'installation',requestKey:requestKey.current})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(response.status===429?'Too many requests. Please try again in ten minutes.':result.error||'Your installation request could not be saved. Please try again.');
      setReference(result.reference);setSent(true);
    }catch(cause){setError(cause instanceof Error?cause.message:'Unable to send your request. Please try again.');}finally{setBusy(false);}
  };

  return <main className="simple-installation">
    <section className="simple-installation__steps"><div className="container">
      <div className="simple-installation__heading"><span className="eyebrow">INSTALLATION SERVICES</span><h1>Professional installation, made straightforward.</h1><p>We can help arrange quality installation for security products in Auckland and selected locations across New Zealand.</p></div>
      <div className="simple-installation__grid">
        <article><b>1</b><div><span>STEP ONE</span><h2>Choose your products</h2><p>Select and purchase the security equipment you need from our online store. If you are unsure about compatibility, contact us before ordering.</p></div></article>
        <article><b>2</b><div><span>STEP TWO</span><h2>Complete the form</h2><p>Provide your address, contact details and a clear description of the property, equipment, wiring and installation work required.</p></div></article>
        <article><b>3</b><div><span>STEP THREE</span><h2>Receive installation pricing</h2><p>We or an available licensed and insured installer will contact you to discuss the job and provide a fixed quote where the site information allows.</p></div></article>
      </div>
    </div></section>

    <section className="simple-installation__enquiry"><div className="container simple-installation__enquiry-grid"><div><span className="eyebrow">REQUEST A QUOTE</span><h2>Tell us what you need installed.</h2><p>Please include as much detail as possible. This helps us assess access, travel, wiring and the likely scope of work.</p><p className="simple-installation__note">Your request will be saved for our team to review and prepare an installation quote.</p></div><form className="installation-form" onSubmit={submit} onChange={()=>{requestKey.current=crypto.randomUUID();}}>{sent ? <div className="form-success"><b>✓</b><h2>Your installation request has been received.</h2><p>Your request has been saved. Reference: {reference}</p><button type="button" className="button button--primary" onClick={() => {setSent(false);setError('');requestKey.current=crypto.randomUUID();}}>Send another enquiry</button></div> : <><label>Your name *<input required name="name" maxLength={200} /></label><label>Your contact number *<input required type="tel" name="phone" maxLength={100} /></label><label>Your email *<input required type="email" name="email" maxLength={254} /></label><label>Your full address *<input required name="address" maxLength={2000} placeholder="This helps us assess travel and installation requirements" /></label><label>What do you require? *<textarea required rows={7} name="details" maxLength={10000} placeholder="Please describe the property, products, number of devices, wiring status and any existing equipment…" /></label>{error&&<p className="account-error" role="alert">{error}</p>}<button className="button button--primary" type="submit" disabled={busy}>{busy?'Sending…':'Request an installation quote →'}</button><small>No CAPTCHA is used on this form.</small></>}</form></div></section>
  </main>;
}
