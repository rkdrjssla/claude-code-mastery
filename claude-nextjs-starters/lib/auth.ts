import { createServerSupabaseClient } from "./supabase";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", session.user.id)
    .single();

  if (error) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    ...data,
  };
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
