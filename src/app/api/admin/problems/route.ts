import { NextResponse } from "next/server"
import { appDb } from "@/db/postgres"
import { problems } from "@/db/postgres/schema"

export async function GET() {
  try {
    const allProblems = await appDb.select().from(problems).orderBy(problems.createdAt)
    return NextResponse.json(allProblems)
  } catch (error) {
    console.error("Error fetching problems:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}
