import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface AppUser {
  id: string;
  email: string;
  role: "customer" | "admin";
}

function getAdminEmails() {
  return (import.meta.env.VITE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
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
  };
}

export async function getCurrentAppUser() {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return mapSupabaseUser(user);
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
