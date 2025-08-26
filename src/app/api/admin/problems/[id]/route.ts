import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { problems } from "@/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { type, isPremium, premiumDescription } = await request.json()

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (type !== undefined) updateData.type = type
    if (isPremium !== undefined) updateData.isPremium = isPremium
    if (premiumDescription !== undefined) updateData.premiumDescription = premiumDescription

    const [updatedProblem] = await appDb.update(problems).set(updateData).where(eq(problems.id, id)).returning()

    if (!updatedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProblem)
  } catch (error) {
    console.error("Error updating problem:", error)
    return NextResponse.json({ error: "Failed to update problem" }, { status: 500 })
  }
}
