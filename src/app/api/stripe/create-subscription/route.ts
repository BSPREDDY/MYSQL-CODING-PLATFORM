import { type NextRequest, NextResponse } from "next/server"
import { stripe, getStripeCustomerByEmail, createStripeCustomer } from "@/lib/stripe"
import { appDb } from "@/db/postgres"
import { users, subscriptionPlans, userSubscriptions } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json()

    if (!userId || !planId) {
      return NextResponse.json({ error: "User ID and Plan ID are required" }, { status: 400 })
    }

    // Get user and plan details
    const [user] = await appDb.select().from(users).where(eq(users.id, userId))
    const [plan] = await appDb.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId))

    if (!user || !plan) {
      return NextResponse.json({ error: "User or plan not found" }, { status: 404 })
    }

    if (!plan.stripePriceId) {
      return NextResponse.json({ error: "Plan does not have a Stripe price ID" }, { status: 400 })
    }

    // Get or create Stripe customer
    let stripeCustomer = await getStripeCustomerByEmail(user.email)

    if (!stripeCustomer) {
      stripeCustomer = await createStripeCustomer(user.email, user.name)

      // Update user with Stripe customer ID
      await appDb.update(users).set({ stripeCustomerId: stripeCustomer.id }).where(eq(users.id, userId))
    }

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: plan.stripePriceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId,
        planId,
      },
    })

    // Create user subscription record
    const currentPeriodStart = new Date(subscription.current_period_start * 1000)
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

    await appDb.insert(userSubscriptions).values({
      userId,
      planId,
      stripeSubscriptionId: subscription.id,
      status: "pending",
      currentPeriodStart,
      currentPeriodEnd,
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
<<<<<<< HEAD
=======

>>>>>>> d762d5a (premium pages updated)
