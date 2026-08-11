import { useState, type FormEvent } from "react";

export function InstallationServicesPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };

  return <main className="simple-installation">
    <section className="simple-installation__steps"><div className="container">
      <div className="simple-installation__heading"><span className="eyebrow">INSTALLATION SERVICES</span><h1>Professional installation, made straightforward.</h1><p>We can help arrange quality installation for security products in Auckland and selected locations across New Zealand.</p></div>
      <div className="simple-installation__grid">
        <article><b>1</b><div><span>STEP ONE</span><h2>Choose your products</h2><p>Select and purchase the security equipment you need from our online store. If you are unsure about compatibility, contact us before ordering.</p></div></article>
        <article><b>2</b><div><span>STEP TWO</span><h2>Complete the form</h2><p>Provide your address, contact details and a clear description of the property, equipment, wiring and installation work required.</p></div></article>
        <article><b>3</b><div><span>STEP THREE</span><h2>Receive installation pricing</h2><p>We or an available licensed and insured installer will contact you to discuss the job and provide a fixed quote where the site information allows.</p></div></article>
      </div>
    </div></section>

    <section className="simple-installation__enquiry"><div className="container simple-installation__enquiry-grid"><div><span className="eyebrow">REQUEST A QUOTE</span><h2>Tell us what you need installed.</h2><p>Please include as much detail as possible. This helps us assess access, travel, wiring and the likely scope of work.</p><p className="simple-installation__note">This is a preview form. Your information is not transmitted or stored.</p></div><form className="installation-form" onSubmit={submit}>{sent ? <div className="form-success"><b>✓</b><h2>Your enquiry is ready.</h2><p>No information was sent or stored in this preview.</p><button type="button" className="button button--primary" onClick={() => setSent(false)}>Send another enquiry</button></div> : <><label>Your name *<input required name="name" /></label><label>Your contact number *<input required type="tel" name="phone" /></label><label>Your email *<input required type="email" name="email" /></label><label>Your full address *<input required name="address" placeholder="This helps us assess travel and installation requirements" /></label><label>What do you require? *<textarea required rows={7} name="details" placeholder="Please describe the property, products, number of devices, wiring status and any existing equipment…" /></label><button className="button button--primary" type="submit">Request an installation quote →</button><small>No CAPTCHA is used on this form.</small></>}</form></div></section>
  </main>;
}
