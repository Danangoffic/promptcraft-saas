import crypto from "crypto";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function verifySignature(input: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}) {
  const raw = input.orderId + input.statusCode + input.grossAmount + process.env.MIDTRANS_SERVER_KEY!;
  const hash = crypto.createHash("sha512").update(raw).digest("hex");
  return hash === input.signatureKey;
}

export async function POST(req: Request) {
  const body = await req.json();

  const isValid = verifySignature({
    orderId: body.order_id,
    statusCode: body.status_code,
    grossAmount: body.gross_amount,
    signatureKey: body.signature_key
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const service = createServiceClient();
  const transactionStatus = body.transaction_status;
  const fraudStatus = body.fraud_status;

  let orderStatus: "pending" | "paid" | "failed" | "expired" | "cancelled" = "pending";

  if (transactionStatus === "settlement" || (transactionStatus === "capture" && fraudStatus === "accept")) {
    orderStatus = "paid";
  } else if (["deny", "failure"].includes(transactionStatus)) {
    orderStatus = "failed";
  } else if (transactionStatus === "expire") {
    orderStatus = "expired";
  } else if (transactionStatus === "cancel") {
    orderStatus = "cancelled";
  }

  const { data: order, error } = await service
    .from("orders")
    .update({
      status: orderStatus,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: body.payment_type,
      raw_notification: body,
      updated_at: new Date().toISOString()
    })
    .eq("midtrans_order_id", body.order_id)
    .select("*, plans(*)")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message || "Order not found" }, { status: 404 });
  }

  if (orderStatus === "paid") {
    const now = new Date();
    const end = new Date(now);
    const interval = order.plans?.interval;

    if (interval === "monthly") end.setMonth(end.getMonth() + 1);
    else if (interval === "yearly") end.setFullYear(end.getFullYear() + 1);
    else end.setFullYear(end.getFullYear() + 100);

    await service.from("subscriptions").upsert(
      {
        user_id: order.user_id,
        plan_id: order.plan_id,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        midtrans_order_id: body.order_id,
        updated_at: now.toISOString()
      },
      { onConflict: "user_id" }
    );
  }

  return NextResponse.json({ received: true });
}
