"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function getAuthInput(formData: FormData) {
  return authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = getAuthInput(formData);
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) redirect("/login?error=auth_failed");

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = getAuthInput(formData);
  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`
    }
  });

  if (error) redirect("/register?error=auth_failed");

  revalidatePath("/", "layout");
  redirect("/login?message=check_email");
}
