import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/user"

export async function GET() {
  try {
    const result = await getCurrentUser()
    if (!result.success || !result.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
