import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AccountPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return <main className="page container account-page"><span className="eyebrow">MY ACCOUNT</span><div className="account-heading"><div><h1>Hello, {user?.name}</h1><p>Manage your customer details and shopping activity.</p></div><button className="button button--ghost account-signout" onClick={signOut}>Sign out</button></div><div className="account-grid"><section><h2>Account details</h2><dl><div><dt>Name</dt><dd>{user?.name}</dd></div><div><dt>Email</dt><dd>{user?.email}</dd></div></dl></section><section><h2>Orders</h2><p>No orders yet.</p><small>Order history will appear here when a checkout backend is connected.</small></section><section><h2>Saved addresses</h2><p>No saved addresses.</p><small>Address management will be enabled with the future customer backend.</small></section></div></main>;
}
