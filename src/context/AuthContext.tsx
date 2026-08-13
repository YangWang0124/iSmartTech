import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Customer = { name: string; email: string };
type StoredCustomer = Customer & { passwordHash: string };
type AuthValue = {
  user: Customer | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);
const customersKey = "ismarttech_mock_customers";
const sessionKey = "ismarttech_customer_session";

function readCustomers(): StoredCustomer[] {
  try { return JSON.parse(localStorage.getItem(customersKey) || "[]"); } catch { return []; }
}

function readSession(): Customer | null {
  try {
    const saved = localStorage.getItem(sessionKey) || sessionStorage.getItem(sessionKey);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

async function digest(password: string) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function saveSession(user: Customer, remember: boolean) {
  localStorage.removeItem(sessionKey);
  sessionStorage.removeItem(sessionKey);
  (remember ? localStorage : sessionStorage).setItem(sessionKey, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(readSession);
  const value = useMemo<AuthValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    signIn: async (email, password, remember) => {
      const normalized = email.trim().toLowerCase();
      const customer = readCustomers().find(item => item.email === normalized);
      if (!customer || customer.passwordHash !== await digest(password)) throw new Error("Incorrect email address or password.");
      const next = { name: customer.name, email: customer.email };
      saveSession(next, remember);
      setUser(next);
    },
    signUp: async (name, email, password, remember) => {
      const normalized = email.trim().toLowerCase();
      const customers = readCustomers();
      if (customers.some(item => item.email === normalized)) throw new Error("An account already exists for this email address.");
      if (password.length < 8) throw new Error("Password must contain at least 8 characters.");
      const next = { name: name.trim(), email: normalized };
      customers.push({ ...next, passwordHash: await digest(password) });
      localStorage.setItem(customersKey, JSON.stringify(customers));
      saveSession(next, remember);
      setUser(next);
    },
    signOut: () => {
      localStorage.removeItem(sessionKey);
      sessionStorage.removeItem(sessionKey);
      setUser(null);
    },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
