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

		const { contestId } = params;
		const userId = session.userId;

		// Skip locking out admins
		if (session.role === "admin") {
			console.log(
				`Admin ${userId} is exempt from lockout for contest ${contestId}`
			);
			return NextResponse.json({ success: true, adminExempt: true });
		}

		const body = await request.json();
		const reason = body.reason || "Security violation";

		console.log(
			`Locking user ${userId} out of contest ${contestId} for reason: ${reason}`
		);

		// Check if entry exists
		const existingAccess = await appDb
			.select({
				userId: contestAccess.userId,
				contestId: contestAccess.contestId,
				isLockedOut: contestAccess.isLockedOut,
			})
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.userId, userId),
					eq(contestAccess.contestId, contestId)
				)
			)
			.limit(1);

		// If user is already locked out, just return success
		if (existingAccess.length > 0 && existingAccess[0].isLockedOut) {
			return NextResponse.json({ success: true, alreadyLocked: true });
		}

		if (existingAccess.length > 0) {
			// Update existing record
			await appDb
				.update(contestAccess)
				.set({
					isLockedOut: true,
					lockedOutAt: new Date(),
					lockedOutReason: reason,
					reEntryGranted: false,
					reEntryGrantedAt: null,
					reEntryGrantedBy: null,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(contestAccess.userId, userId),
						eq(contestAccess.contestId, contestId)
					)
				);
		} else {
			// Create new record
			await appDb.insert(contestAccess).values({
				userId,
				contestId,
				isLockedOut: true,
				lockedOutAt: new Date(),
				lockedOutReason: reason,
				reEntryGranted: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		// Set cache control headers to prevent caching
		return new NextResponse(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store, max-age=0, must-revalidate",
			},
		});
	} catch (error) {
		console.error("Error locking user out of contest:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
