import { NextResponse } from "next/server";
import { verifySession } from "@/app/actions/session";
import { appDb } from "@/db/postgres";
import { contestAccess } from "@/db/postgres/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
	request: Request,
	{ params }: { params: { contestId: string } }
) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.userId;
		const { contestId } = await params;

		// Check if user is locked out
		const accessResult = await appDb
			.select({
				isLockedOut: contestAccess.isLockedOut,
			})
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.contestId, contestId),
					eq(contestAccess.userId, userId)
				)
			)
			.limit(1);

		const isLockedOut =
			accessResult.length > 0 ? accessResult[0].isLockedOut : false;

		// Set cache control headers to prevent caching
		return new NextResponse(JSON.stringify({ isLockedOut }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store, max-age=0, must-revalidate",
			},
		});
	} catch (error) {
		console.error("Error checking lock status:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
