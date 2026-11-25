import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { customerRequest } from "../lib/products";

export type Customer = { id: number; name: string; email: string; company: string; phone: string; address: string; can_purchase: number; email_verified: number; version: number };
type AuthValue = {
  user: Customer | null; loading: boolean; isAuthenticated: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signUp: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>; refresh: () => Promise<void>;
};
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const requestNumber=useRef(0);
  const authMutation=useRef(false);
  const refresh = useCallback(async () => {
    if(authMutation.current)return;
    const request=++requestNumber.current;
    try {const session=await customerRequest<{user:Customer|null}>('session');if(request===requestNumber.current)setUser(session.user);}
    catch {if(request===requestNumber.current)setUser(null);}
    finally {if(request===requestNumber.current)setLoading(false);}
  }, []);
  useEffect(() => {
    // Retire the old browser-only prototype accounts and sessions.
    localStorage.removeItem('ismarttech_mock_customers'); localStorage.removeItem('ismarttech_customer_session'); sessionStorage.removeItem('ismarttech_customer_session');
    void refresh();
    const update = () => { if(document.visibilityState === 'visible') void refresh(); };
    window.addEventListener('focus', update); document.addEventListener('visibilitychange', update);
    const timer=window.setInterval(update,30000);
    return () => {window.removeEventListener('focus',update);document.removeEventListener('visibilitychange',update);window.clearInterval(timer);};
  }, [refresh]);
  const value = useMemo<AuthValue>(() => ({user,loading,isAuthenticated:Boolean(user),refresh,
    signIn: async (email,password,remember) => {authMutation.current=true;++requestNumber.current;try{setUser(await customerRequest<Customer>('signin',{email,password,remember}));}finally{authMutation.current=false;}},
    signUp: async (email,password,remember) => {authMutation.current=true;++requestNumber.current;try{setUser(await customerRequest<Customer>('signup',{email,password,remember}));}finally{authMutation.current=false;}},
    signOut: async () => {authMutation.current=true;++requestNumber.current;try{await customerRequest('signout',{});setUser(null);}finally{authMutation.current=false;}},
  }), [user,loading,refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {const context=useContext(AuthContext);if(!context) throw new Error('useAuth must be used within AuthProvider');return context;}
