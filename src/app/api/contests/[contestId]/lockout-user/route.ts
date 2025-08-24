import { NextResponse } from "next/server";
import { verifySession } from "@/app/actions/session";
import { appDb } from "@/db/postgres";
import { contestAccess } from "@/db/postgres/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
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
		const body = await request.json();
		const { reason } = body;

		// Check if user already has a contest access record
		const existingAccess = await appDb
			.select()
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.contestId, contestId),
					eq(contestAccess.userId, userId)
				)
			)
			.limit(1);

		if (existingAccess.length > 0) {
			// Update existing record
			await appDb
				.update(contestAccess)
				.set({
					isLockedOut: true,
					lockedOutReason: reason,
					lockedOutAt: new Date(),
				})
				.where(
					and(
						eq(contestAccess.contestId, contestId),
						eq(contestAccess.userId, userId)
					)
				);
		} else {
			// Create new record
			await appDb.insert(contestAccess).values({
				contestId,
				userId,
				isLockedOut: true,
				lockedOutReason: reason,
				lockedOutAt: new Date(),
			});
		}

		return NextResponse.json({
			success: true,
			message: "User locked out successfully",
		});
	} catch (error) {
		console.error("Error locking out user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
