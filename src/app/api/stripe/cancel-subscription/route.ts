import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { appDb } from "@/db/postgres"
import { userSubscriptions } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, cancelAtPeriodEnd = true } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    // Get subscription from database
    const [subscription] = await appDb.select().from(userSubscriptions).where(eq(userSubscriptions.id, subscriptionId))

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Cancel or update subscription in Stripe
    let stripeSubscription
    if (cancelAtPeriodEnd) {
      stripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    } else {
      stripeSubscription = await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    }

    // Update database
    await appDb
      .update(userSubscriptions)
      .set({
        cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? null : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.id, subscriptionId))

    return NextResponse.json({
      success: true,
      subscription: stripeSubscription,
    })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
