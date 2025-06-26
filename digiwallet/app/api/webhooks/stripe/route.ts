import Stripe from "stripe";
import { depositMoneyById } from "@/app/actions/depositMoney";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Convert ReadableStream to Buffer
async function toBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let rawBody: Buffer;
  try {
    rawBody = await toBuffer(req.body as ReadableStream<Uint8Array>);
  } catch (err) {
    console.error("Failed to read raw body:", err);
    return new Response("Bad Request", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handling payment_intent.succeeded
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const clerkUserId = intent.metadata?.clerkUserId;
    const amount = intent.amount_received ?? 0;
    // console.log(clerkUserId, amount);
    if (clerkUserId && amount > 0) {
      try {
        await depositMoneyById(clerkUserId, amount / 100);
        console.log("Wallet updated for user :", clerkUserId);
      } catch (err) {
        console.error("Failed to update wallet:", err);
        return new Response("Internal error", { status: 500 });
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


