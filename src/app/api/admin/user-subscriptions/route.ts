import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { userSubscriptions, users, subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const subscriptions = await appDb
      .select({
        id: userSubscriptions.id,
        userId: userSubscriptions.userId,
        planId: userSubscriptions.planId,
        stripeSubscriptionId: userSubscriptions.stripeSubscriptionId,
        status: userSubscriptions.status,
        currentPeriodStart: userSubscriptions.currentPeriodStart,
        currentPeriodEnd: userSubscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: userSubscriptions.cancelAtPeriodEnd,
        canceledAt: userSubscriptions.canceledAt,
        createdAt: userSubscriptions.createdAt,
        updatedAt: userSubscriptions.updatedAt,
        user: {
          name: users.name,
          email: users.email,
        },
        plan: {
          name: subscriptionPlans.name,
          price: subscriptionPlans.price,
          currency: subscriptionPlans.currency,
          interval: subscriptionPlans.interval,
          intervalCount: subscriptionPlans.intervalCount,
        },
      })
      .from(userSubscriptions)
      .leftJoin(users, eq(userSubscriptions.userId, users.id))
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .orderBy(userSubscriptions.createdAt)

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching user subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch user subscriptions" }, { status: 500 })
  }
}
