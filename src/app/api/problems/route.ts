import { NextResponse } from "next/server";
import { appDb } from "@/db/postgres";
import { problems } from "@/db/postgres/schema";
import { eq } from "drizzle-orm";
export async function GET() {
	try {
		const data = await appDb
			.select()
			.from(problems)
			.where(eq(problems.hidden, false));
		console.log("data is", data);
		return NextResponse.json({
			success: true,
			problems: data,
		});
	} catch (error) {
		console.error("Error fetching problems:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch problems" },
			{ status: 500 }
		);
	}
}
