import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { users, userSubscriptions, subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/app/actions/user"

export async function GET() {
  try {
    const userResult = await getCurrentUser()
    if (!userResult.success || !userResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user premium status
    const [user] = await appDb.select().from(users).where(eq(users.id, userResult.user.id))

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get current active subscription
    const subscription = await appDb
      .select({
        status: userSubscriptions.status,
        planName: subscriptionPlans.name,
      })
      .from(userSubscriptions)
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, user.id))
      .orderBy(userSubscriptions.createdAt)
      .limit(1)

    return NextResponse.json({
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      subscriptionStatus: subscription[0]?.status || null,
      planName: subscription[0]?.planName || null,
    })
  } catch (error) {
    console.error("Error fetching premium status:", error)
    return NextResponse.json({ error: "Failed to fetch premium status" }, { status: 500 })
  }
}
