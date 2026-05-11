import { createClient } from "@/lib/supabase/server";

export async function getSubscriptionStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, isPremium: false };

  const { data } = await supabase
    .from("subscriptions")
    .select("id,status,current_period_end")
    .eq("user_id", user.id)
    .eq("status", "active")
    .or(`current_period_end.is.null,current_period_end.gt.${new Date().toISOString()}`)
    .maybeSingle();

  return { user, isPremium: Boolean(data), subscription: data };
}
