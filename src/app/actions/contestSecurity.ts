"use server";

import { appDb } from "@/db/postgres";
import { contestAccess, contests, users } from "@/db/postgres/schema";
import { eq, and } from "drizzle-orm";
import { verifySession } from "./session";

// Lock a user out of a contest
export async function lockUserOutOfContest(contestId: string, reason: string) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return { success: false, error: "Authentication required" };
		}

		const userId = session.userId;

		console.log(
			`Locking user ${userId} out of contest ${contestId} for reason: ${reason}`
		);

		// Check if entry exists
		const existingAccess = await appDb
			.select({
				userId: contestAccess.userId,
				contestId: contestAccess.contestId,
			})
			.from(contestAccess)
			.where(
				and(
					eq(contestAccess.userId, userId),
					eq(contestAccess.contestId, contestId)
				)
			)
			.limit(1);

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

		return { success: true };
	} catch (error) {
		console.error("Error locking user out of contest:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to lock user out of contest",
		};
	}
}

// Check if a user is locked out of a contest
export async function checkContestLockStatus(contestId: string) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return { success: false, error: "Authentication required" };
		}

		const userId = session.userId;

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

		return {
			success: true,
			isLockedOut,
			fullScreenRequired,
		};
	} catch (error) {
		console.error("Error checking contest lock status:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to check contest lock status",
		};
	}
}

export async function grantContestReEntry(
	userId: string,
	contestId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Verify admin access
		const session = await verifySession();
		if (!session.isAuth || session.role !== "admin") {
			return {
				success: false,
				error: "Unauthorized. Only admins can grant re-entry.",
			};
		}

		// Get admin ID from session
		const adminId = session.userId;

		console.log(
			`Admin ${adminId} granting re-entry to user ${userId} for contest ${contestId}`
		);

		// First, check if a record exists
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
			return {
				success: false,
				error: "No matching record found",
			};
		}

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
			);

		console.log(`Re-entry granted for user ${userId} in contest ${contestId}`);

		return { success: true };
	} catch (error) {
		console.error("Error granting contest re-entry:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

// Get all locked out users for a specific contest
export async function getLockedOutUsers(contestId: string) {
	try {
		const session = await verifySession();

		if (!session.isAuth || session.role !== "admin") {
			return { success: false, error: "Admin access required" };
		}

		console.log(`Fetching locked out users for contest ${contestId}`);

		// Get all locked out users for this contest
		const lockedUsers = await appDb
			.select({
				userId: contestAccess.userId,
				userName: users.name,
				userEmail: users.email,
				userRegNo: users.regNo,
				userSection: users.section,
				lockedOutAt: contestAccess.lockedOutAt,
				lockedOutReason: contestAccess.lockedOutReason,
				reEntryGranted: contestAccess.reEntryGranted,
			})
			.from(contestAccess)
			.innerJoin(users, eq(contestAccess.userId, users.id))
			.where(
				and(
					eq(contestAccess.contestId, contestId),
					eq(contestAccess.isLockedOut, true)
				)
			);

		console.log(
			`Found ${lockedUsers.length} locked out users for contest ${contestId}`
		);

		return {
			success: true,
			data: lockedUsers,
		};
	} catch (error) {
		console.error("Error getting locked out users:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to get locked out users",
		};
	}
}

/**
 * Fetches all users who are currently locked out across all contests
 * @returns An object containing success status and either data or error message
 */
export async function getAllLockedOutUsers() {
	try {
		// Join contestAccess with users and contests tables to get complete details
		const lockedOutUsers = await appDb
			.select({
				userId: contestAccess.userId,
				userName: users.name,
				userEmail: users.email,
				userRegNo: users.regNo,
				userSection: users.section,
				contestId: contestAccess.contestId,
				contestName: contests.title,
				lockedOutAt: contestAccess.lockedOutAt,
				lockedOutReason: contestAccess.lockedOutReason,
			})
			.from(contestAccess)
			.leftJoin(users, eq(contestAccess.userId, users.id))
			.leftJoin(contests, eq(contestAccess.contestId, contests.id))
			.where(eq(contestAccess.isLockedOut, true))
			.orderBy(contestAccess.lockedOutAt);

		return {
			success: true,
			data: lockedOutUsers,
		};
	} catch (error) {
		console.error("Error fetching all locked out users:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

// Update contest security settings
export async function updateContestSecuritySettings(
	contestId: string,
	fullScreenRequired: boolean
) {
	try {
		const session = await verifySession();

		if (!session.isAuth || session.role !== "admin") {
			return { success: false, error: "Admin access required" };
		}

		// Update contest settings
		await appDb
			.update(contests)
			.set({
				fullScreenRequired,
				updatedAt: new Date(),
			})
			.where(eq(contests.id, contestId));

		return { success: true };
	} catch (error) {
		console.error("Error updating contest security settings:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to update security settings",
		};
	}
}

// Check if a user is locked out (for UI display)
export async function isUserLockedOutOfContest(contestId: string) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return { success: false, error: "Authentication required" };
		}

		const userId = session.userId;

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

		return {
			success: true,
			isLockedOut,
		};
	} catch (error) {
		console.error("Error checking if user is locked out:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to check lock status",
			isLockedOut: false,
		};
	}
}
