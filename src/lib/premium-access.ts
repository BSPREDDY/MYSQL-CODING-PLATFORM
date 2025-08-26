import { appDb } from "@/db/postgres"
import { userPremiumAccess, userSubscriptions, premiumProblems } from "@/db/postgres/schema"
import { eq, and, gte } from "drizzle-orm"

export async function checkPremiumProblemAccess(userId: string, problemId: string): Promise<boolean> {
  try {
    // Check if user has active premium access to this specific problem
    const access = await appDb
      .select()
      .from(userPremiumAccess)
      .leftJoin(userSubscriptions, eq(userPremiumAccess.subscriptionId, userSubscriptions.id))
      .where(
        and(
          eq(userPremiumAccess.userId, userId),
          eq(userPremiumAccess.problemId, problemId),
          eq(userPremiumAccess.isActive, true),
          eq(userSubscriptions.status, "active"),
          gte(userPremiumAccess.expiresAt, new Date()),
        ),
      )
      .limit(1)

    return access.length > 0
  } catch (error) {
    console.error("Error checking premium problem access:", error)
    return false
  }
}

export async function getUserPremiumProblems(userId: string): Promise<string[]> {
  try {
    const accessibleProblems = await appDb
      .select({
        problemId: userPremiumAccess.problemId,
      })
      .from(userPremiumAccess)
      .leftJoin(userSubscriptions, eq(userPremiumAccess.subscriptionId, userSubscriptions.id))
      .where(
        and(
          eq(userPremiumAccess.userId, userId),
          eq(userPremiumAccess.isActive, true),
          eq(userSubscriptions.status, "active"),
          gte(userPremiumAccess.expiresAt, new Date()),
        ),
      )

    return accessibleProblems.map((access) => access.problemId)
  } catch (error) {
    console.error("Error getting user premium problems:", error)
    return []
  }
}

export async function grantPremiumAccessForNewProblems(planId: string) {
  try {
    // Get all active subscriptions for this plan
    const activeSubscriptions = await appDb
      .select()
      .from(userSubscriptions)
      .where(and(eq(userSubscriptions.planId, planId), eq(userSubscriptions.status, "active")))

    // Get all premium problems for this plan
    const planProblems = await appDb
      .select({
        problemId: premiumProblems.problemId,
      })
      .from(premiumProblems)
      .where(and(eq(premiumProblems.planId, planId), eq(premiumProblems.isActive, true)))

    // Grant access to all active subscribers
    for (const subscription of activeSubscriptions) {
      for (const planProblem of planProblems) {
        // Check if access already exists
        const existingAccess = await appDb
          .select()
          .from(userPremiumAccess)
          .where(
            and(
              eq(userPremiumAccess.userId, subscription.userId),
              eq(userPremiumAccess.problemId, planProblem.problemId),
              eq(userPremiumAccess.subscriptionId, subscription.id),
            ),
          )
          .limit(1)

        if (existingAccess.length === 0) {
          // Create new access record
          await appDb.insert(userPremiumAccess).values({
            userId: subscription.userId,
            problemId: planProblem.problemId,
            subscriptionId: subscription.id,
            grantedAt: new Date(),
            expiresAt: subscription.currentPeriodEnd,
            isActive: true,
          })
        }
      }
    }

    console.log(`Granted access to new premium problems for plan ${planId}`)
  } catch (error) {
    console.error("Error granting access for new problems:", error)
  }
}
