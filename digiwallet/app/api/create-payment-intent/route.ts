
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil", // Add API version for safety and consistency
});

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  try {
    const body = await request.json();
    const amount = body.amount;

    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
       metadata: {
      clerkUserId: userId,  // or user.email if you prefer
  }
    });
    
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
