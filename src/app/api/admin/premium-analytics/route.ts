import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { payments, userSubscriptions } from "@/db/postgres/schema"
import { eq, count, sum } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get basic metrics
    const [totalRevenueResult] = await appDb
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.status, "succeeded"))

    const [totalSubscriptionsResult] = await appDb.select({ count: count() }).from(userSubscriptions)

    const [activeSubscriptionsResult] = await appDb
      .select({ count: count() })
      .from(userSubscriptions)
      .where(eq(userSubscriptions.status, "active"))

    // Mock data for demonstration (replace with real queries)
    const analytics = {
      totalRevenue: totalRevenueResult?.total || 0,
      totalSubscriptions: totalSubscriptionsResult?.count || 0,
      activeSubscriptions: activeSubscriptionsResult?.count || 0,
      churnRate: 5.2,
      averageRevenuePerUser: 2999, // $29.99 in cents
      conversionRate: 12.5,
      monthlyRevenue: [
        { month: "Jan", revenue: 15000, subscriptions: 50 },
        { month: "Feb", revenue: 18000, subscriptions: 60 },
        { month: "Mar", revenue: 22000, subscriptions: 73 },
        { month: "Apr", revenue: 25000, subscriptions: 83 },
        { month: "May", revenue: 28000, subscriptions: 93 },
        { month: "Jun", revenue: 32000, subscriptions: 107 },
      ],
      planDistribution: [
        { name: "Basic", count: 45, revenue: 134550 },
        { name: "Pro", count: 32, revenue: 191680 },
        { name: "Enterprise", count: 18, revenue: 215820 },
      ],
      topProblems: [
        { title: "Advanced JOIN Operations", attempts: 245, completions: 189 },
        { title: "Window Functions Mastery", attempts: 198, completions: 142 },
        { title: "Complex Subqueries", attempts: 167, completions: 123 },
        { title: "Performance Optimization", attempts: 134, completions: 89 },
        { title: "Data Warehousing Concepts", attempts: 112, completions: 78 },
      ],
      userGrowth: [
        { date: "2024-01-01", newUsers: 12, premiumUsers: 3 },
        { date: "2024-01-02", newUsers: 15, premiumUsers: 4 },
        { date: "2024-01-03", newUsers: 18, premiumUsers: 5 },
        { date: "2024-01-04", newUsers: 22, premiumUsers: 7 },
        { date: "2024-01-05", newUsers: 19, premiumUsers: 6 },
      ],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching premium analytics:", error)
    return NextResponse.json({ error: "Failed to fetch premium analytics" }, { status: 500 })
  }
}
