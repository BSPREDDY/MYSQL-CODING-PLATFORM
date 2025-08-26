import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { premiumProblems, problems } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get the premium problem to find the associated problem ID
    const [premiumProblem] = await appDb.select().from(premiumProblems).where(eq(premiumProblems.id, id))

    if (!premiumProblem) {
      return NextResponse.json({ error: "Premium problem assignment not found" }, { status: 404 })
    }

    // Delete the premium problem assignment
    await appDb.delete(premiumProblems).where(eq(premiumProblems.id, id))

    // Check if problem has other premium assignments
    const otherAssignments = await appDb
      .select()
      .from(premiumProblems)
      .where(eq(premiumProblems.problemId, premiumProblem.problemId))

    // If no other premium assignments, revert problem to free
    if (otherAssignments.length === 0) {
      await appDb
        .update(problems)
        .set({
          type: "free",
          isPremium: false,
          updatedAt: new Date(),
        })
        .where(eq(problems.id, premiumProblem.problemId))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting premium problem assignment:", error)
    return NextResponse.json({ error: "Failed to delete premium problem assignment" }, { status: 500 })
  }
}
