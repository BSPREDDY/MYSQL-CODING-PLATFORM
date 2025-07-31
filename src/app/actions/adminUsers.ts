"use server";

import { appDb } from "@/db/postgres";
import {
	users,
	submissions,
	contestPoints,
	contestSubmission,
	contests,
} from "@/db/postgres/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

// Delete all non-admin users
export async function deleteAllUsers() {
	try {
		return await appDb.transaction(async (tx) => {
			// Get all non-admin user IDs
			const nonAdminUsers = await tx
				.select({ id: users.id })
				.from(users)
				.where(eq(users.role, "user"));

			const userIds = nonAdminUsers.map((user) => user.id);

			if (userIds.length === 0) {
				return {
					success: true,
					message: "No users to delete",
					count: 0,
				};
			}

			// Delete all related data for these users

			// Delete contest submissions
			await tx
				.delete(contestSubmission)
				.where(sql`${contestSubmission.userId} IN (${userIds.join(",")})`);

			// Delete contest points
			await tx
				.delete(contestPoints)
				.where(sql`${contestPoints.userId} IN (${userIds.join(",")})`);

			// Delete submissions
			await tx
				.delete(submissions)
				.where(sql`${submissions.userId} IN (${userIds.join(",")})`);

			// Finally delete the users
			const result = await tx
				.delete(users)
				.where(eq(users.role, "user"))
				.returning({ id: users.id });

			return {
				success: true,
				message: `Successfully deleted ${result.length} users`,
				count: result.length,
			};
		});
	} catch (error) {
		console.error("Error deleting all users:", error);
		return {
			success: false,
			error: "Failed to delete users",
			message: "An error occurred while deleting users",
		};
	}
}

// Get student performance by contests

export async function getStudentPerformance(
	contestIds: string[],
	section?: string
) {
	try {
		// Get contest details for column headers
		const contestDetails = await appDb
			.select({
				id: contests.id,
				title: contests.title,
			})
			.from(contests)
			.where(inArray(contests.id, contestIds));

		// Base query to get all users with their role and section
		let query = appDb
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				regNo: users.regNo,
				section: users.section,
			})
			.from(users)
			.where(eq(users.role, "user"));

		// Add section filter if provided
		if (section) {
			query = query.where(eq(users.section, section));
		}

		const students = await query;

		// Get performance data for each student in the selected contests
		const performanceData = await Promise.all(
			students.map(async (student) => {
				// Get contest points for this student in the selected contests
				const contestPointsData = await appDb
					.select({
						contestId: contestPoints.contestId,
						pointsEarned: contestPoints.pointsEarned,
					})
					.from(contestPoints)
					.where(
						and(
							eq(contestPoints.userId, student.id),
							inArray(contestPoints.contestId, contestIds)
						)
					);

				// Create a map of contest ID to points earned
				const contestPointsMap = new Map();
				contestPointsData.forEach((item) => {
					contestPointsMap.set(item.contestId, item.pointsEarned);
				});

				// Get submission data for this student in the selected contests
				const submissionsData = await appDb
					.select({
						contestId: contestSubmission.contestId,
						problemId: contestSubmission.problemId,
						points: contestSubmission.points,
						status: submissions.status,
					})
					.from(contestSubmission)
					.leftJoin(
						submissions,
						eq(contestSubmission.submissionId, submissions.id)
					)
					.where(
						and(
							eq(contestSubmission.userId, student.id),
							inArray(contestSubmission.contestId, contestIds)
						)
					);

				// Calculate performance metrics
				const totalPoints = contestPointsData.reduce(
					(sum, item) => sum + item.pointsEarned,
					0
				);
				const problemsSolved = submissionsData.filter(
					(sub) => sub.status === "AC"
				).length;
				const totalSubmissions = submissionsData.length;
				const successRate =
					totalSubmissions > 0
						? Math.round((problemsSolved / totalSubmissions) * 100)
						: 0;

				// Create contest points object with each contest as a separate property
				const contestPointsObject: Record<string, number> = {};
				contestDetails.forEach((contest) => {
					contestPointsObject[contest.id] =
						contestPointsMap.get(contest.id) || 0;
				});

				return {
					...student,
					...contestPointsObject, // Add each contest's points as a separate property
					totalPoints,
					problemsSolved,
					totalSubmissions,
					successRate,
					contestResults: contestPointsData,
				};
			})
		);

		// Sort by total points in descending order
		performanceData.sort((a, b) => b.totalPoints - a.totalPoints);

		// Add ranking
		const rankedData = performanceData.map((student, index) => ({
			...student,
			rank: index + 1,
		}));

		return {
			success: true,
			data: rankedData,
			contests: contestDetails,
		};
	} catch (error) {
		console.error("Error getting student performance:", error);
		return {
			success: false,
			error: "Failed to get student performance data",
		};
	}
}
// Get all sections
export async function getAllSections() {
	try {
		const result = await appDb
			.select({ section: users.section })
			.from(users)
			.where(and(eq(users.role, "user"), sql`${users.section} IS NOT NULL`))
			.groupBy(users.section);

		const sections = result
			.map((item) => item.section)
			.filter(Boolean) as string[];

		return {
			success: true,
			data: sections,
		};
	} catch (error) {
		console.error("Error getting sections:", error);
		return {
			success: false,
			error: "Failed to get sections",
		};
	}
}
