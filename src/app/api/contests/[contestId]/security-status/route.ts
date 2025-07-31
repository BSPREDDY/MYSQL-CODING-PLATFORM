import { NextResponse } from "next/server";
import { verifySession } from "@/app/actions/session";
import { appDb } from "@/db/postgres";
import { contestAccess, contests } from "@/db/postgres/schema";
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

		// Get contest details to check if full screen is required
		const contestResult = await appDb
			.select({
				fullScreenRequired: contests.fullScreenRequired,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		const fullScreenRequired =
			contestResult.length > 0 ? contestResult[0].fullScreenRequired : true;

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

		//  cache control headers to prevent caching
		return new NextResponse(
			JSON.stringify({ fullScreenRequired, isLockedOut }),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-store, max-age=0, must-revalidate",
				},
			}
		);
	} catch (error) {
		console.error("Error checking security status:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
