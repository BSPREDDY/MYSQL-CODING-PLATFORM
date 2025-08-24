import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { appDb } from "@/db/postgres"
import { users, userSubscriptions, payments } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSuccess(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailure(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) return

  const status =
    subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "pending"

  const currentPeriodStart = new Date(subscription.current_period_start * 1000)
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  // Update subscription status
  await appDb
    .update(userSubscriptions)
    .set({
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))

  // Update user premium status
  const isPremium = status === "active"
  const premiumExpiresAt = isPremium ? currentPeriodEnd : null

  await appDb
    .update(users)
    .set({
      isPremium,
      premiumExpiresAt,
    })
    .where(eq(users.id, userId))
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) return

  await appDb
    .update(userSubscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))

  await appDb
    .update(users)
    .set({
      isPremium: false,
      premiumExpiresAt: null,
    })
    .where(eq(users.id, userId))
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  const userId = invoice.metadata?.userId

  if (userId && subscriptionId) {
    // Record successful payment
    await appDb.insert(payments).values({
      userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "completed",
      description: `Payment for subscription ${subscriptionId}`,
    })
  }
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId

  if (userId) {
    // Record failed payment
    await appDb.insert(payments).values({
      userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: `Failed payment for invoice ${invoice.id}`,
    })
  }
}
