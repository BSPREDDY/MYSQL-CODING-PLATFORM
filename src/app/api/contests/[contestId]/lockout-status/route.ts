import { NextResponse } from "next/server";
import { verifySession } from "@/app/actions/session";
import { appDb } from "@/db/postgres";
import { contestAccess } from "@/db/postgres/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: { contestId: string } }
) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const contestId = params.contestId;
		const userId = session.userId;

		console.log(
			`Checking lock status for user ${userId} in contest ${contestId}`
		);

		// Check if user is locked out
		const accessResult = await appDb
			.select({
				isLockedOut: contestAccess.isLockedOut,
				reEntryGranted: contestAccess.reEntryGranted,
			})
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.userId, userId),
					eq(contestAccess.contestId, contestId)
				)
			)
			.limit(1);

		// If no record exists, user is not locked out
		if (!accessResult.length) {
			console.log(
				`No access record found for user ${userId} in contest ${contestId}`
			);
			return NextResponse.json({ isLockedOut: false });
		}

		// Return lock status
		const isLockedOut =
			accessResult[0].isLockedOut && !accessResult[0].reEntryGranted;
		console.log(
			`User ${userId} is ${
				isLockedOut ? "locked out of" : "allowed in"
			} contest ${contestId}`
		);

		return NextResponse.json({ isLockedOut });
	} catch (error) {
		console.error("Error checking contest lock status:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
