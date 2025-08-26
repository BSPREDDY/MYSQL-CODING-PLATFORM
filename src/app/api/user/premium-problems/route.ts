import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import {
  problems,
  premiumCategories,
  premiumProblemCategories,
  userPremiumAccess,
  userSubscriptions,
} from "@/db/postgres/schema"
import { eq, and } from "drizzle-orm"
import { verifySession } from "@/app/actions/session"

export async function GET() {
  try {
    const session = await verifySession()
    if (!session?.isAuth || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all premium problems with their categories
    const premiumProblemsData = await appDb
      .select({
        id: problems.id,
        title: problems.title,
        description: problems.description,
        difficulty: problems.difficulty,
        type: problems.type,
        isPremium: problems.isPremium,
        premiumDescription: problems.premiumDescription,
        createdAt: problems.createdAt,
        category: {
          id: premiumCategories.id,
          name: premiumCategories.name,
          description: premiumCategories.description,
          icon: premiumCategories.icon,
          color: premiumCategories.color,
        },
      })
      .from(problems)
      .leftJoin(premiumProblemCategories, eq(problems.id, premiumProblemCategories.problemId))
      .leftJoin(premiumCategories, eq(premiumProblemCategories.categoryId, premiumCategories.id))
      .where(eq(problems.isPremium, true))
      .orderBy(problems.createdAt)

    // Check user's premium access for each problem
    const userAccess = await appDb
      .select({
        problemId: userPremiumAccess.problemId,
        isActive: userPremiumAccess.isActive,
      })
      .from(userPremiumAccess)
      .leftJoin(userSubscriptions, eq(userPremiumAccess.subscriptionId, userSubscriptions.id))
      .where(
        and(
          eq(userPremiumAccess.userId, session.userId),
          eq(userPremiumAccess.isActive, true),
          eq(userSubscriptions.status, "active"),
        ),
      )

    const accessMap = new Map(userAccess.map((access) => [access.problemId, access.isActive]))

    // Format the response
    const formattedProblems = premiumProblemsData.map((problem) => ({
      ...problem,
      hasAccess: accessMap.has(problem.id),
      isCompleted: false, // TODO: Implement completion tracking
    }))

    return NextResponse.json(formattedProblems)
  } catch (error) {
    console.error("Error fetching premium problems:", error)
    return NextResponse.json({ error: "Failed to fetch premium problems" }, { status: 500 })
  }
}
