import { NextResponse } from "next/server";
import { verifySession } from "@/app/actions/session";
import { appDb } from "@/db/postgres";
import { contestAccess } from "@/db/postgres/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
	request: Request,
	{ params }: { params: { contestId: string } }
) {
	try {
		const session = await verifySession();

		if (!session.isAuth || session.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const contestId = params.contestId;
		const adminId = session.userId;

		const body = await request.json();
		const userId = body.userId;

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}

		console.log(
			`Admin ${adminId} granting re-entry to user ${userId} for contest ${contestId}`
		);

		// First, check if the record exists - using userId and contestId instead of id
		const existingRecord = await appDb
			.select({
				userId: contestAccess.userId,
				contestId: contestAccess.contestId,
			})
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.contestId, contestId),
					eq(contestAccess.userId, userId)
				)
			)
			.limit(1);

		if (existingRecord.length === 0) {
			console.log(
				`No access record found for user ${userId} in contest ${contestId}`
			);
			return NextResponse.json(
				{ error: "No matching record found" },
				{ status: 404 }
			);
		}

		console.log("updating,", existingRecord);

		// Update the access record
		const result = await appDb
			.update(contestAccess)
			.set({
				isLockedOut: false,
				reEntryGranted: true,
				reEntryGrantedAt: new Date(),
				reEntryGrantedBy: adminId,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(contestAccess.contestId, contestId),
					eq(contestAccess.userId, userId)
				)
			)
			.returning({ userId: contestAccess.userId });

		console.log(`Re-entry grant result:`, result);

		if (!result.length) {
			return NextResponse.json(
				{ error: "Failed to update record" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error granting contest re-entry:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
