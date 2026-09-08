import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFoundPage() {
  return (
    <main className="page container empty-state">
      <Seo
        title="Page not found | iSmartTech NZ"
        description="The requested iSmartTech page could not be found."
        noIndex
      />
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page may have moved, or the address may be incorrect.</p>
      <Link className="button button--primary" to="/products">Browse products</Link>
    </main>
  );
}
