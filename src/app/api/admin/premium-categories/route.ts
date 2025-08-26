import { type NextRequest, NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { premiumCategories, premiumProblems } from "@/db/postgres/schema"
import { eq, count } from "drizzle-orm"

export async function GET() {
  try {
    const categories = await appDb
      .select({
        id: premiumCategories.id,
        name: premiumCategories.name,
        description: premiumCategories.description,
        isActive: premiumCategories.isActive,
        createdAt: premiumCategories.createdAt,
        updatedAt: premiumCategories.updatedAt,
        problemCount: count(premiumProblems.id),
      })
      .from(premiumCategories)
      .leftJoin(premiumProblems, eq(premiumCategories.id, premiumProblems.categoryId))
      .groupBy(premiumCategories.id)
      .orderBy(premiumCategories.createdAt)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching premium categories:", error)
    return NextResponse.json({ error: "Failed to fetch premium categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, isActive } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const [category] = await appDb
      .insert(premiumCategories)
      .values({
        name,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning()

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating premium category:", error)
    return NextResponse.json({ error: "Failed to create premium category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, isActive } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const [category] = await appDb
      .update(premiumCategories)
      .set({
        name,
        description: description || null,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(premiumCategories.id, id))
      .returning()

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating premium category:", error)
    return NextResponse.json({ error: "Failed to update premium category" }, { status: 500 })
  }
}
