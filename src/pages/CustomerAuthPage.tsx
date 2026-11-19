import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CustomerAuthPage({ mode }: { mode: "signin" | "signup" }) {
  const { isAuthenticated, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [invitation, setInvitation] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const destination = (location.state as { from?: string } | null)?.from || "/account";
  if (loading) return <main className="page container"><p>Loading your account…</p></main>;
  if (isAuthenticated) return <Navigate to={destination.startsWith("/") && !destination.startsWith("//") ? destination : "/account"} replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      if (mode === "signup") await signUp(name, email, password, remember, invitation);
      else await signIn(email, password, remember);
      navigate(destination.startsWith("/") && !destination.startsWith("//") ? destination : "/account", { replace: true });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to continue."); }
    finally { setSubmitting(false); }
  };
  return <main className="page container account-shell"><section className="account-card"><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>{mode === "signin" ? "Welcome back" : "Create your account"}</h1><p>{mode === "signin" ? "Sign in to view your account and continue shopping." : "Create an account to place orders and track your purchases."}</p><form onSubmit={submit}>{mode === "signup" && <label>Full name<input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} /></label>}<label>Email address<input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<input required type="password" minLength={12} maxLength={256} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={event => setPassword(event.target.value)} /></label>{mode === "signup" && <label>Invitation code (optional)<input value={invitation} onChange={event => setInvitation(event.target.value)} autoComplete="off" /><small>Existing company customers can request a sign-up invitation from staff.</small></label>}<label className="remember-row"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Remember me on this device</label>{error && <div className="account-error" role="alert">{error}</div>}<button className="button button--primary" disabled={submitting}>{submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button></form><div className="account-switch">{mode === "signin" ? <>New to iSmartTech? <Link to="/signup">Create an account</Link></> : <>Already have an account? <Link to="/signin">Sign in</Link></>}</div><small>Use at least 12 characters for your password. Your account is stored securely by the store.</small></section></main>;
}
