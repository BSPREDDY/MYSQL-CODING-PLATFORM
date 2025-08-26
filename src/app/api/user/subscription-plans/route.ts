import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const plans = await appDb
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .orderBy(subscriptionPlans.price)

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching user subscription plans:", error)
    return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
  }
}
