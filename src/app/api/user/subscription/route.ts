import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { userSubscriptions, subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/app/actions/user"

export async function GET(request: NextRequest) {
  try {
    const userResult = await getCurrentUser()
    if (!userResult.success || !userResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await appDb
      .select({
        id: userSubscriptions.id,
        status: userSubscriptions.status,
        currentPeriodStart: userSubscriptions.currentPeriodStart,
        currentPeriodEnd: userSubscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: userSubscriptions.cancelAtPeriodEnd,
        plan: {
          name: subscriptionPlans.name,
          price: subscriptionPlans.price,
          currency: subscriptionPlans.currency,
          interval: subscriptionPlans.interval,
          intervalCount: subscriptionPlans.intervalCount,
        },
      })
      .from(userSubscriptions)
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, userResult.user.id))
      .orderBy(userSubscriptions.createdAt)
      .limit(1)

    return NextResponse.json({
      subscription: subscription[0] || null,
    })
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
