import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { premiumCategories, premiumProblemCategories, problems } from "@/db/postgres/schema"
import { eq, count } from "drizzle-orm"
import { verifySession } from "@/app/actions/session"

export async function GET() {
  try {
    const session = await verifySession()
    if (!session?.isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get categories with problem counts
    const categoriesData = await appDb
      .select({
        id: premiumCategories.id,
        name: premiumCategories.name,
        description: premiumCategories.description,
        icon: premiumCategories.icon,
        color: premiumCategories.color,
        sortOrder: premiumCategories.sortOrder,
        problemCount: count(premiumProblemCategories.problemId),
      })
      .from(premiumCategories)
      .leftJoin(premiumProblemCategories, eq(premiumCategories.id, premiumProblemCategories.categoryId))
      .leftJoin(problems, eq(premiumProblemCategories.problemId, problems.id))
      .where(eq(premiumCategories.isActive, true))
      .groupBy(
        premiumCategories.id,
        premiumCategories.name,
        premiumCategories.description,
        premiumCategories.icon,
        premiumCategories.color,
        premiumCategories.sortOrder,
      )
      .orderBy(premiumCategories.sortOrder)

    return NextResponse.json(categoriesData)
  } catch (error) {
    console.error("Error fetching premium categories:", error)
    return NextResponse.json({ error: "Failed to fetch premium categories" }, { status: 500 })
  }
}
