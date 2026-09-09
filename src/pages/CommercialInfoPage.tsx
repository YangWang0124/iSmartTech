import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PageKey = "privacy" | "terms" | "shipping-returns" | "warranty" | "installation-terms" | "payment-information" | "faq";

const contact = <><a href="mailto:info@ismarttech.co.nz">info@ismarttech.co.nz</a> or <a href="tel:092183110">(09) 218 3110</a></>;

const pages: Record<PageKey, { eyebrow: string; title: string; intro: string; body: ReactNode }> = {
  privacy: {
    eyebrow: "YOUR INFORMATION",
    title: "Privacy notice",
    intro: "How iSmartTech handles personal information when you browse, enquire or place an order.",
    body: <>
      <section><h2>Who is responsible</h2><p>iSmartTech is operated by ST Security Ltd, trading as Smart Tech House (NZBN 9429041461730). Privacy enquiries can be sent to {contact}.</p></section>
      <section><h2>Information we may collect</h2><p>We may collect information you provide when creating an account, requesting a quote, contacting us or placing an order. This can include your name, contact details, delivery and billing details, order history and the information in your enquiry.</p></section>
      <section><h2>How we use it</h2><ul><li>To respond to enquiries and prepare quotations.</li><li>To process, deliver and support orders.</li><li>To maintain customer accounts and communicate order updates.</li><li>To protect the site and meet legal, accounting and warranty obligations.</li></ul></section>
      <section><h2>Payments and service providers</h2><p>Payment, delivery and technology providers may process information needed to provide their part of the service. We only intend to share information where it is needed to complete the service, meet a legal obligation or protect our legitimate interests.</p></section>
      <section><h2>Access and correction</h2><p>You may ask for access to, or correction of, personal information we hold about you. Contact us using the details above.</p></section>
    </>,
  },
  terms: {
    eyebrow: "BUYING FROM US",
    title: "Terms of sale",
    intro: "The main terms applying to products, quotations and services supplied through iSmartTech.",
    body: <>
      <section><h2>Seller and customer</h2><p>“We”, “us” and “the seller” mean ST Security Ltd trading as Smart Tech House and iSmartTech. “You” and “the customer” mean the person accepting a quotation or ordering goods or services.</p></section>
      <section><h2>Orders, quotations and prices</h2><p>An order may be placed through the website or agreed with our team. The applicable price is the price in an accepted, unexpired quotation or the price displayed on the website. Product availability and dispatch timing may need to be confirmed.</p></section>
      <section><h2>Payment</h2><p>Payment is required using an available method shown at checkout or another method agreed with us. Approved account customers must pay by the due date stated on their invoice. See our <Link to="/payment-information">payment information</Link>.</p></section>
      <section><h2>Delivery, cancellation and returns</h2><p>Delivery times are estimates and freight charges depend on the order and destination. A customer may ask to cancel within 24 hours if the order has not shipped. Returns require prior approval. Full details are in <Link to="/shipping-returns">shipping, returns and refunds</Link>.</p></section>
      <section><h2>Warranty</h2><p>Products are covered by the applicable manufacturer’s warranty. Warranty periods differ by product. Nothing in these terms is intended to limit rights that cannot lawfully be excluded under New Zealand law.</p></section>
      <section><h2>Business accounts and governing law</h2><p>Where applicable, overdue approved-account balances may attract the charges agreed in the customer’s credit terms, and security interests may apply under the Personal Property Securities Act 1999. These terms are governed by New Zealand law and disputes are subject to the New Zealand courts.</p></section>
    </>,
  },
  "shipping-returns": {
    eyebrow: "ORDER SUPPORT",
    title: "Shipping, returns and refunds",
    intro: "Delivery information and the return process published for iSmartTech customers.",
    body: <>
      <section><h2>Shipping</h2><p>Available shipping methods and costs are calculated from the order and delivery address at checkout. iSmartTech advertises free delivery on orders over $2,000. International delivery may be available, with timing and cost depending on the destination.</p><p>After dispatch, we send an email with shipment information and update the order page in the customer’s account. Delivery dates are estimates and depend on stock and courier availability.</p></section>
      <section><h2>Before returning anything</h2><p>Email <a href="mailto:info@ismarttech.co.nz">info@ismarttech.co.nz</a> first. An approved application receives a Return Material Authorisation (RMA) number and return instructions. Returns sent without approval may not be accepted. Serial numbers are required for returned products.</p></section>
      <section><h2>Return conditions</h2><div className="policy-table-wrap"><table className="policy-table"><thead><tr><th>Situation</th><th>Published outcome</th></tr></thead><tbody><tr><td>Our sales or warehouse error; application supplied; sealed, unmarked and new; within 14 days of invoice</td><td>No restocking fee</td></tr><tr><td>Customer error or reduced scope; application supplied; sealed, unmarked and new; within 30 days of invoice</td><td>20% restocking fee</td></tr><tr><td>Application missing; opened, marked, incomplete or damaged goods; more than 30 days after invoice; custom colour or custom-built order</td><td>Not refundable</td></tr><tr><td>Reported fault; application and detailed fault description supplied; original box and all accessories included; within 14 days</td><td>Subject to the manufacturer’s warranty; if no fault is found, return freight is charged to the customer</td></tr></tbody></table></div><p>Service and repair items are excluded from this goods-return guide. The published policy has applied since 1 January 2024 and remains subject to the terms under which the goods were supplied.</p></section>
      <section><h2>Refund timing</h2><p>Once an approved return has been received and inspected, an eligible refund is processed to the original payment method. iSmartTech advises that it may take 5–10 business days to appear.</p></section>
    </>,
  },
  warranty: {
    eyebrow: "PRODUCT SUPPORT",
    title: "Warranty process",
    intro: "What to do if a product appears faulty or needs warranty assessment.",
    body: <>
      <section><h2>Manufacturer warranty</h2><p>Most products carry the manufacturer’s warranty and the warranty period varies by product. Check the product page or contact us before purchase if the period is important to your decision.</p></section>
      <section><h2>Requesting an assessment</h2><ol><li>Contact {contact} with the invoice number, product model and serial number.</li><li>Describe the fault in detail and include helpful photos or video where possible.</li><li>Wait for approval, an RMA number and delivery instructions before sending the product.</li><li>Return the product with its original box and all accessories where required.</li></ol></section>
      <section><h2>Assessment outcome</h2><p>The item is assessed under the manufacturer’s warranty conditions. If no fault is found, the product may be returned at the customer’s cost. Your rights under applicable New Zealand consumer law continue to apply.</p></section>
    </>,
  },
  "installation-terms": {
    eyebrow: "PROFESSIONAL SERVICES",
    title: "Installation terms",
    intro: "How installation work is assessed, quoted and delivered by Smart Tech House.",
    body: <>
      <section><h2>Quotes and availability</h2><p>Installation is priced case by case. We review the address, equipment, wiring, access and requested work before confirming availability and providing a written estimate or quotation. The accepted quotation defines the included work and price.</p></section>
      <section><h2>Service area</h2><p>The team is based at Unit 5, 531 Great South Road, Penrose, Auckland 1061. Installation availability is confirmed for each address; travel and access requirements may affect the quote.</p></section>
      <section><h2>Work standards</h2><p>Smart Tech House supplies smart-home, security and electrical services for residential and commercial projects. Published company information states that relevant work uses current technology and installation techniques aligned with the New Zealand Building Code.</p></section>
      <section><h2>Changes and site information</h2><p>Please provide accurate information about the property, existing equipment and wiring. Work outside the accepted scope, concealed site conditions or customer-requested changes may require a revised quote and timing. Product supply, installation dates and payment terms remain subject to the accepted quotation.</p></section>
      <section><h2>Arrange installation</h2><p>Use the <Link to="/installation-services">installation enquiry</Link> or contact {contact}. A site visit may be needed before the scope and price can be confirmed.</p></section>
    </>,
  },
  "payment-information": {
    eyebrow: "PAYING FOR YOUR ORDER",
    title: "Payment information",
    intro: "Published payment and invoicing information for iSmartTech purchases.",
    body: <>
      <section><h2>Accepted methods</h2><p>iSmartTech lists POLi, credit card, WeChat Pay and Alipay. Only payment options actually displayed during checkout are available for a particular order. Other methods may be agreed directly for quotations or approved business accounts.</p></section>
      <section><h2>Invoices</h2><p>After payment is received, the invoice is sent to the registered email address and the billing email address provided for the order.</p></section>
      <section><h2>Currency, GST and surcharges</h2><p>Prices and quotations are in New Zealand dollars. The website or quotation should state whether GST is included. A card surcharge may apply where disclosed before payment.</p></section>
      <section><h2>Payment safety</h2><p>Use only the payment instructions shown at checkout, on an accepted quotation or sent from an official company email address. Contact {contact} if payment details appear unexpected.</p></section>
    </>,
  },
  faq: {
    eyebrow: "HELP CENTRE",
    title: "Frequently asked questions",
    intro: "Straightforward answers about products, ordering, delivery, returns and support.",
    body: <div className="faq-list">
      <section><h2>Products and service</h2><details><summary>What products do you offer?</summary><p>Alarms, CCTV and surveillance products, network video recorders and smart-home equipment, with installation services available by quotation.</p></details><details><summary>Do you have a physical store?</summary><p>iSmartTech operates online rather than as a walk-in retail store. The Smart Tech House team is based in Penrose, Auckland.</p></details></section>
      <section><h2>Orders and delivery</h2><details><summary>How do I place an order?</summary><p>Browse the catalogue, add available products to the cart and follow the checkout prompts. Products marked “Price on request” require a quotation.</p></details><details><summary>How do I track an order?</summary><p>After dispatch, tracking information is emailed and added to the order page in your account.</p></details><details><summary>Can I cancel an order?</summary><p>Contact us as soon as possible. iSmartTech’s published FAQ allows cancellation within 24 hours when the order has not already shipped.</p></details></section>
      <section><h2>Returns and warranty</h2><details><summary>Can I return a product?</summary><p>Most new products can be considered for return within 30 days, subject to the condition, timing, approval and restocking rules in our <Link to="/shipping-returns">returns policy</Link>.</p></details><details><summary>How long does a refund take?</summary><p>After an eligible return is received and inspected, refunds generally take 5–10 business days to appear on the original payment method.</p></details><details><summary>What warranty applies?</summary><p>Most products carry a manufacturer’s warranty. The period varies, so check the product page or ask us for confirmation.</p></details></section>
    </div>,
  },
};

export function CommercialInfoPage({ page }: { page: PageKey }) {
  const content = pages[page];
  return <main className="policy-page">
    <section className="inner-hero inner-hero--short"><div className="container"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p></div></section>
    <div className="container policy-layout">
      <nav aria-label="Customer information"><h2>Customer information</h2><Link to="/terms-and-conditions">Terms of sale</Link><Link to="/shipping-returns">Shipping &amp; returns</Link><Link to="/warranty">Warranty</Link><Link to="/installation-terms">Installation terms</Link><Link to="/payment-information">Payment information</Link><Link to="/privacy">Privacy</Link><Link to="/faq">FAQs</Link></nav>
      <article className="policy-content">{content.body}<aside className="policy-contact"><strong>Need help?</strong><span>Monday–Friday, 9am–6pm</span><span>{contact}</span></aside></article>
    </div>
  </main>;
}
