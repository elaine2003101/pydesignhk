import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface AppUser {
  id: string;
  email: string;
  role: "customer" | "admin";
  fullName?: string | null;
}

interface ProfileRow {
  full_name: string | null;
  role: "customer" | "admin" | null;
}

const DEMO_SESSION_KEY = "pydesignhk-demo-user";

export const DEMO_CUSTOMER_ACCOUNT = {
  email: "demo.customer@pydesignhk.com",
  password: "DemoCustomer123!",
  fullName: "Demo Customer",
} as const;

function getAdminEmails() {
  return (import.meta.env.VITE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getStoredDemoUser(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(DEMO_SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AppUser;
  } catch {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}

export function isDemoCustomerCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_CUSTOMER_ACCOUNT.email &&
    password === DEMO_CUSTOMER_ACCOUNT.password
  );
}

export async function signInDemoCustomer() {
  const demoUser: AppUser = {
    id: "demo-customer",
    email: DEMO_CUSTOMER_ACCOUNT.email,
    role: "customer",
    fullName: DEMO_CUSTOMER_ACCOUNT.fullName,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
  }

  return demoUser;
}

export function getUserRole(user: User | null): "customer" | "admin" {
  if (!user?.email) {
    return "customer";
  }

  const metadataRole =
    typeof user.user_metadata?.role === "string"
      ? user.user_metadata.role
      : null;

  if (metadataRole === "admin") {
    return "admin";
  }

  if (getAdminEmails().includes(user.email.toLowerCase())) {
    return "admin";
  }

  return "customer";
}

export function mapSupabaseUser(user: User | null): AppUser | null {
  if (!user?.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: getUserRole(user),
    fullName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  };
}

export async function getAppUserFromSupabaseUser(user: User | null) {
  const mappedUser = mapSupabaseUser(user);

  if (!mappedUser || !supabase) {
    return mappedUser;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", mappedUser.id)
    .maybeSingle<ProfileRow>();

  if (!profile) {
    return mappedUser;
  }

  return {
    ...mappedUser,
    role: profile.role ?? mappedUser.role,
    fullName: profile.full_name ?? mappedUser.fullName,
  };
}

export async function getCurrentAppUser() {
  const demoUser = getStoredDemoUser();
  if (demoUser) {
    return demoUser;
  }

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return getAppUserFromSupabaseUser(user);
}

export async function signOutUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  }

  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
