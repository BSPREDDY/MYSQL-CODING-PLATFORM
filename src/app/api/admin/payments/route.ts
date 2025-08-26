import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { payments, users, userSubscriptions, subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const paymentHistory = await appDb
      .select({
        id: payments.id,
        userId: payments.userId,
        subscriptionId: payments.subscriptionId,
        stripePaymentId: payments.stripePaymentId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        paymentMethod: payments.paymentMethod,
        createdAt: payments.createdAt,
        user: {
          name: users.name,
          email: users.email,
        },
        subscription: {
          planName: subscriptionPlans.name,
          interval: subscriptionPlans.interval,
        },
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .leftJoin(userSubscriptions, eq(payments.subscriptionId, userSubscriptions.id))
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .orderBy(payments.createdAt)

    return NextResponse.json(paymentHistory)
  } catch (error) {
    console.error("Error fetching payment history:", error)
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 })
  }
}
