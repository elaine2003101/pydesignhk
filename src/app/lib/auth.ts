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
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return getAppUserFromSupabaseUser(user);
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
