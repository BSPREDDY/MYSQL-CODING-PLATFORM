import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { premiumProblems, problems, subscriptionPlans } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const premiumProblemsData = await appDb
      .select({
        id: premiumProblems.id,
        problemId: premiumProblems.problemId,
        planId: premiumProblems.planId,
        isActive: premiumProblems.isActive,
        problem: {
          id: problems.id,
          title: problems.title,
          description: problems.description,
          difficulty: problems.difficulty,
          type: problems.type,
          isPremium: problems.isPremium,
        },
        plan: {
          id: subscriptionPlans.id,
          name: subscriptionPlans.name,
          description: subscriptionPlans.description,
          isActive: subscriptionPlans.isActive,
        },
      })
      .from(premiumProblems)
      .leftJoin(problems, eq(premiumProblems.problemId, problems.id))
      .leftJoin(subscriptionPlans, eq(premiumProblems.planId, subscriptionPlans.id))

    return NextResponse.json(premiumProblemsData)
  } catch (error) {
    console.error("Error fetching premium problems:", error)
    return NextResponse.json({ error: "Failed to fetch premium problems" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { problemId, planId } = await request.json()

    if (!problemId || !planId) {
      return NextResponse.json({ error: "Problem ID and Plan ID are required" }, { status: 400 })
    }

    // Check if assignment already exists
    const existing = await appDb
      .select()
      .from(premiumProblems)
      .where(eq(premiumProblems.problemId, problemId))
      .where(eq(premiumProblems.planId, planId))

    if (existing.length > 0) {
      return NextResponse.json({ error: "Problem is already assigned to this plan" }, { status: 400 })
    }

    // Create premium problem assignment
    const [premiumProblem] = await appDb
      .insert(premiumProblems)
      .values({
        problemId,
        planId,
        isActive: true,
      })
      .returning()

    // Update problem to premium type
    await appDb
      .update(problems)
      .set({
        type: "premium",
        isPremium: true,
        updatedAt: new Date(),
      })
      .where(eq(problems.id, problemId))

    return NextResponse.json(premiumProblem)
  } catch (error) {
    console.error("Error creating premium problem assignment:", error)
    return NextResponse.json({ error: "Failed to create premium problem assignment" }, { status: 500 })
  }
}
