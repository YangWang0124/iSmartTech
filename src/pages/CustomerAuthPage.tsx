import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { customerRequest } from "../lib/products";

type Mode = "signin" | "signup" | "forgot" | "reset" | "verify";
export function CustomerAuthPage({ mode }: { mode: Mode }) {
  const { isAuthenticated, loading, signIn, signUp, refresh } = useAuth();
  const navigate=useNavigate(), location=useLocation();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState(''),[confirmation,setConfirmation]=useState('');
  const [remember,setRemember]=useState(true),[error,setError]=useState(''),[message,setMessage]=useState(''),[submitting,setSubmitting]=useState(false),[done,setDone]=useState(false);
  const [token,setToken]=useState(()=>new URLSearchParams(location.hash.slice(1)).get('token')||'');
  useEffect(()=>{
    if((mode==='reset'||mode==='verify')&&location.hash){
      setToken(new URLSearchParams(location.hash.slice(1)).get('token')||'');
      navigate(location.pathname,{replace:true});
    }
  },[mode,location.hash,location.pathname,navigate]);
  const destination=(location.state as {from?:string}|null)?.from||'/account';
  const safeDestination=destination.startsWith('/')&&!destination.startsWith('//')?destination:'/account';
  const titles={signin:'Welcome back',signup:'Create your account',forgot:'Forgot your password?',reset:'Set a new password',verify:'Verify your email'};
  if(loading)return <main className="page container"><p>Loading your account…</p></main>;
  if(isAuthenticated&&(mode==='signin'||mode==='signup'))return <Navigate to={safeDestination} replace/>;
  const submit=async(event:FormEvent)=>{
    event.preventDefault();setError('');setMessage('');setSubmitting(true);
    try {
      if(mode==='signin'){await signIn(email,password,remember);navigate(safeDestination,{replace:true});}
      else if(mode==='signup'){await signUp(email,password,remember);navigate('/account',{replace:true});}
      else if(mode==='forgot'){
        const result=await customerRequest<{message:string}>('forgot-password',{email});setMessage(result.message);
      } else if(mode==='reset'){
        if(password!==confirmation)throw new Error('The new passwords do not match.');
        const result=await customerRequest<{message:string}>('reset-password',{token,password});setMessage(result.message);setDone(true);setPassword('');setConfirmation('');await refresh();
      } else {
        const result=await customerRequest<{message:string}>('verify-email',{token});setMessage(result.message);setDone(true);await refresh();
      }
    }catch(cause){setError(cause instanceof Error?cause.message:'Unable to continue.');}
    finally{setSubmitting(false);}
  };
  return <main className="page container account-shell"><section className="account-card"><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>{titles[mode]}</h1>
    <p>{mode==='signin'?'Sign in to view your account and continue shopping.':mode==='signup'?'Create an account, then verify your email to place orders.':mode==='forgot'?'Enter your account email. If the account is eligible, we will send a link to reset your password.':mode==='reset'?'Choose a new password. Resetting it signs out your previous sessions.':'Confirm your email address to enable checkout.'}</p>
    {(mode==='reset'||mode==='verify')&&!token&&!done?<p role="alert" className="account-error">Open the complete link from your email. It may have expired or already been used.</p>:!done&&<form onSubmit={submit}>
      {['signin','signup','forgot'].includes(mode)&&<label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)}/></label>}
      {['signin','signup','reset'].includes(mode)&&<label>{mode==='reset'?'New password':'Password'}<input required type="password" minLength={12} maxLength={256} autoComplete={mode==='signin'?'current-password':'new-password'} value={password} onChange={event=>setPassword(event.target.value)}/></label>}
      {mode==='reset'&&<label>Confirm new password<input required type="password" minLength={12} maxLength={256} autoComplete="new-password" value={confirmation} onChange={event=>setConfirmation(event.target.value)}/></label>}
      {(mode==='signin'||mode==='signup')&&<label className="remember-row"><input type="checkbox" checked={remember} onChange={event=>setRemember(event.target.checked)}/> Remember me on this device</label>}
      <button className="button button--primary" disabled={submitting}>{submitting?'Please wait…':mode==='signin'?'Sign in':mode==='signup'?'Create account':mode==='forgot'?'Send reset link':mode==='reset'?'Reset password':'Verify email'}</button>
    </form>}
    {error&&<p className="account-error" role="alert">{error}</p>}{message&&<p role="status" className="account-notice">{message}</p>}
    <div className="account-switch">{mode==='signin'?<><Link to="/forgot-password">Forgot password?</Link><p>New to iSmartTech? <Link to="/signup">Create an account</Link></p></>:mode==='signup'?<>Already have an account? <Link to="/signin">Sign in</Link></>:mode==='verify'?<><Link to="/account">Go to My Account</Link><p>Need another link? Sign in and select Resend verification email.</p></>:<><Link to="/signin">Back to sign in</Link>{mode==='reset'&&!done&&<p><Link to="/forgot-password">Request a new reset link</Link></p>}</>}</div>
    {(mode==='signup'||mode==='reset')&&<small>Use at least 12 characters. Verification links last 24 hours; reset links last 30 minutes.</small>}
  </section></main>;
}
