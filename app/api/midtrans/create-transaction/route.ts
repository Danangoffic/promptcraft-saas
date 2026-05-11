import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createSnapClient } from "@/lib/midtrans";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  let planId = "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    planId = body.planId;
  } else {
    const formData = await req.formData();
    planId = String(formData.get("planId") || "");
  }

  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: plan, error: planError } = await service
    .from("plans")
    .select("*")
    .eq("id", planId)
    .eq("is_active", true)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const orderId = `PROMPTCRAFT-${user.id.slice(0, 8)}-${Date.now()}`;

  await service.from("orders").insert({
    user_id: user.id,
    plan_id: plan.id,
    midtrans_order_id: orderId,
    amount: plan.price,
    status: "pending"
  });

  const snap = createSnapClient();
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: plan.price
    },
    customer_details: {
      email: user.email
    },
    item_details: [
      {
        id: plan.id,
        price: plan.price,
        quantity: 1,
        name: plan.name
      }
    ]
  });

  if (contentType.includes("application/json")) {
    return NextResponse.json({ orderId, token: transaction.token, redirectUrl: transaction.redirect_url });
  }

  return NextResponse.redirect(transaction.redirect_url, { status: 303 });
}
