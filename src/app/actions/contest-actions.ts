"use server";

import { appDb } from "@/db/postgres";
import {
	contests,
	contestProblems,
	contestSubmission,
	contestPoints,
	submissions,
	problems,
	users,
} from "@/db/postgres/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { verifySession } from "./session";
import { submitSolution } from "./playGroundAction";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import { getProblemById } from "./problem-actions";

// Get all contests
export async function getContests() {
	try {
		const allContests = await appDb
			.select({
				id: contests.id,
				title: contests.title,
				description: contests.description,
				startTime: contests.startTime,
				endTime: contests.endTime,
				leaderBoard: contests.leaderBoard,
				protectedContest: contests.protectedContest,
				createdAt: contests.createdAt,
			})
			.from(contests)
			.orderBy(contests.startTime);

		return {
			success: true,
			data: allContests,
		};
	} catch (error) {
		console.error("Error fetching contests:", error);
		return {
			success: false,
			error: "Failed to fetch contests",
		};
	}
}

// Get contest with problems and submission data
export async function getContestWithProblems(contestId: string) {
	try {
		const session = await verifySession();
		const userId = session.userId;

		// Get contest details
		const contestResult = await appDb
			.select({
				id: contests.id,
				title: contests.title,
				description: contests.description,
				startTime: contests.startTime,
				endTime: contests.endTime,
				leaderBoard: contests.leaderBoard,
				protectedContest: contests.protectedContest,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return { success: false, error: "Contest not found" };
		}

		const contest = contestResult[0];

		// Get problems for this contest
		const problemsResult = await appDb
			.select({
				problem: {
					id: problems.id,
					title: problems.title,
					difficulty: problems.difficulty,
					solved: sql<number>`(
            SELECT COUNT(*) FROM ${contestSubmission}
            WHERE ${contestSubmission.problemId} = ${problems.id}
            AND ${contestSubmission.contestId} = ${contestId}
            AND ${contestSubmission.points} > 0
          )`,
				},
				points: contestProblems.points,
			})
			.from(contestProblems)
			.innerJoin(problems, eq(contestProblems.problemId, problems.id))
			.where(eq(contestProblems.contestId, contestId));

		// Get user's submissions for this contest
		const userSubmissions = userId
			? await appDb
					.select({
						userId: contestSubmission.userId,
						problemId: contestSubmission.problemId,
						contestId: contestSubmission.contestId,
						points: contestSubmission.points,
					})
					.from(contestSubmission)
					.where(
						and(
							eq(contestSubmission.contestId, contestId),
							eq(contestSubmission.userId, userId as string)
						)
					)
			: [];

		return {
			success: true,
			data: {
				...contest,
				problems: problemsResult,
				contestSubmissions: userSubmissions,
			},
		};
	} catch (error) {
		console.error("Error fetching contest with problems:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to fetch contest data",
		};
	}
}

// Submit a solution for a contest problem
export async function submitContestSolution({
	code,
	problemId,
	contestId,
}: {
	code: string;
	problemId: string;
	contestId: string;
}) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return {
				success: false,
				message: "You must be logged in to submit solutions",
				passedTests: 0,
				totalTests: 0,
			};
		}

		const userId = session.userId;

		if (!userId) {
			return {
				success: false,
				message: "User ID not found in session",
				passedTests: 0,
				totalTests: 0,
			};
		}

		// Check if contest is active
		const contestResult = await appDb
			.select({
				startTime: contests.startTime,
				endTime: contests.endTime,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return {
				success: false,
				message: "Contest not found",
				passedTests: 0,
				totalTests: 0,
			};
		}

		const now = new Date();
		const { startTime, endTime } = contestResult[0];

		if (now < startTime) {
			return {
				success: false,
				message: "Contest has not started yet",
				passedTests: 0,
				totalTests: 0,
			};
		}

		if (now > endTime) {
			return {
				success: false,
				message: "Contest has ended",
				passedTests: 0,
				totalTests: 0,
			};
		}

		// Get problem points from contest
		const problemPointsResult = await appDb
			.select({
				points: contestProblems.points,
			})
			.from(contestProblems)
			.where(
				and(
					eq(contestProblems.contestId, contestId),
					eq(contestProblems.problemId, problemId)
				)
			)
			.limit(1);

		if (!problemPointsResult.length) {
			return {
				success: false,
				message: "Problem not found in this contest",
				passedTests: 0,
				totalTests: 0,
			};
		}

		const maxPoints = problemPointsResult[0].points;

		// Submit the solution using the existing submitSolution function
		const result = await submitSolution({ code, problemId });

		// Calculate points based on test results
		const earnedPoints = result.success ? maxPoints : 0;

		// Start a transaction to record the submission
		return await appDb.transaction(async (tx) => {
			// Get the latest submission ID
			const latestSubmission = await tx
				.select({ id: submissions.id })
				.from(submissions)
				.where(
					and(
						eq(submissions.userId, userId as string),
						eq(submissions.problemId, problemId)
					)
				)
				.orderBy(desc(submissions.createdAt))
				.limit(1);

			if (!latestSubmission.length) {
				throw new Error("Submission record not found");
			}

			const submissionId = latestSubmission[0].id;

			// Check if user already has a submission for this problem in this contest
			const existingSubmission = await tx
				.select({ id: contestSubmission.id, points: contestSubmission.points })
				.from(contestSubmission)
				.where(
					and(
						eq(contestSubmission.contestId, contestId),
						eq(contestSubmission.problemId, problemId),
						eq(contestSubmission.userId, userId as string)
					)
				)
				.limit(1);

			if (existingSubmission.length) {
				// Update existing submission if new points are higher
				if (earnedPoints > existingSubmission[0].points) {
					await tx
						.update(contestSubmission)
						.set({
							submissionId,
							points: earnedPoints,
							submittedAt: new Date(),
						})
						.where(eq(contestSubmission.id, existingSubmission[0].id));
				}
			} else {
				// Create new contest submission record
				await tx.insert(contestSubmission).values({
					contestId,
					userId: userId as string,
					problemId,
					submissionId,
					points: earnedPoints,
					submittedAt: new Date(),
				});
			}

			// Update user's total points for this contest
			await updateContestPoints(tx, contestId, userId as string);

			return {
				...result,
				earnedPoints,
			};
		});
	} catch (error) {
		console.error("Error submitting contest solution:", error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Unknown error occurred",
			passedTests: 0,
			totalTests: 0,
		};
	}
}

// Helper function to update contest points
async function updateContestPoints(tx: any, contestId: string, userId: string) {
	// Calculate total points for this user in this contest
	const totalPointsResult = await tx
		.select({
			totalPoints: sql<number>`SUM(${contestSubmission.points})`,
		})
		.from(contestSubmission)
		.where(
			and(
				eq(contestSubmission.contestId, contestId),
				eq(contestSubmission.userId, userId)
			)
		)
		.groupBy(contestSubmission.userId);

	const totalPoints = totalPointsResult.length
		? totalPointsResult[0].totalPoints
		: 0;

	// Check if user already has a contest points record
	const existingPoints = await tx
		.select({ id: contestPoints.contestId })
		.from(contestPoints)
		.where(
			and(
				eq(contestPoints.contestId, contestId),
				eq(contestPoints.userId, userId)
			)
		)
		.limit(1);

	if (existingPoints.length) {
		// Update existing record
		await tx
			.update(contestPoints)
			.set({
				pointsEarned: totalPoints,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(contestPoints.contestId, contestId),
					eq(contestPoints.userId, userId)
				)
			);
	} else {
		// Create new record
		await tx.insert(contestPoints).values({
			contestId,
			userId,
			pointsEarned: totalPoints,
			updatedAt: new Date(),
		});
	}
}

// Get contest leaderboard
export async function getContestLeaderboard(contestId: string) {
	try {
		// Check if contest exists and has leaderboard enabled
		const contestResult = await appDb
			.select({
				leaderBoard: contests.leaderBoard,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return { success: false, error: "Contest not found" };
		}

		if (!contestResult[0].leaderBoard) {
			return {
				success: false,
				error: "Leaderboard is disabled for this contest",
			};
		}

		// Get leaderboard data using Drizzle ORM joins instead of raw SQL
		const leaderboardData = await appDb
			.select({
				userId: contestPoints.userId,
				pointsEarned: contestPoints.pointsEarned,
				userName: users.name,
				userRegNo: users.regNo,
				userSection: users.section,
			})
			.from(contestPoints)
			.innerJoin(users, eq(contestPoints.userId, users.id))
			.where(eq(contestPoints.contestId, contestId))
			.orderBy(desc(contestPoints.pointsEarned));

		// Add rank calculation in JavaScript
		const formattedData = leaderboardData.map((row, index) => ({
			rank: index + 1,
			points: row.pointsEarned,
			user: {
				id: row.userId,
				name: row.userName,
				regNo: row.userRegNo,
				section: row.userSection,
			},
		}));

		// Handle tied rankings properly
		const rankedData = [];
		let currentRank = 1;

		for (let i = 0; i < formattedData.length; i++) {
			if (i > 0 && formattedData[i].points < formattedData[i - 1].points) {
				currentRank = i + 1;
			}

			rankedData.push({
				...formattedData[i],
				rank: currentRank,
			});
		}

		return {
			success: true,
			data: rankedData,
		};
	} catch (error) {
		console.error("Error fetching contest leaderboard:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to fetch leaderboard",
		};
	}
}

// Check if user can access a contest (for protected contests)
export async function checkContestAccess(contestId: string, password?: string) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return { success: false, error: "Authentication required" };
		}

		const contestResult = await appDb
			.select({
				protectedContest: contests.protectedContest,
				passwordHash: contests.passwordHash,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return { success: false, error: "Contest not found" };
		}

		const { protectedContest, passwordHash } = contestResult[0];

		// If contest is not protected, allow access
		if (!protectedContest) {
			return { success: true };
		}

		// Check if user already has access cookie
		const cookieStore = await cookies();
		const accessCookie = cookieStore.get(`contest_access_${contestId}`);

		if (accessCookie && accessCookie.value === "granted") {
			return { success: true };
		}

		// If contest is protected but no password provided
		if (!password) {
			return {
				success: false,
				error: "Password required for this contest",
				requiresPassword: true,
			};
		}

		// Verify password
		const bcrypt = require("bcrypt");
		const passwordMatch = await bcrypt.compare(password, passwordHash);

		if (!passwordMatch) {
			return {
				success: false,
				error: "Incorrect password",
				requiresPassword: true,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error checking contest access:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to check contest access",
		};
	}
}

// Get contest by ID
export async function getContestById(contestId: string) {
	try {
		const contestResult = await appDb
			.select({
				id: contests.id,
				title: contests.title,
				description: contests.description,
				startTime: contests.startTime,
				endTime: contests.endTime,
				leaderBoard: contests.leaderBoard,
				protectedContest: contests.protectedContest,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return { success: false, error: "Contest not found" };
		}

		return {
			success: true,
			data: contestResult[0],
		};
	} catch (error) {
		console.error("Error fetching contest:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch contest",
		};
	}
}

// Verify contest password
export async function verifyContestPassword(
	contestId: string,
	password: string
) {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return { success: false, error: "Authentication required" };
		}

		// Get contest with password hash
		const contestResult = await appDb
			.select({
				id: contests.id,
				passwordHash: contests.passwordHash,
			})
			.from(contests)
			.where(eq(contests.id, contestId))
			.limit(1);

		if (!contestResult.length) {
			return { success: false, error: "Contest not found" };
		}

		const contest = contestResult[0];

		if (!contest.passwordHash) {
			return { success: false, error: "Contest has no password set" };
		}

		// Verify password
		const passwordMatch = await bcrypt.compare(password, contest.passwordHash);

		if (!passwordMatch) {
			return { success: false, error: "Incorrect password" };
		}

		// Set access cookie - with a shorter expiration (2 hours) to require re-authentication
		const cookieStore = await cookies();
		cookieStore.set(`contest_access_${contestId}`, "granted", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 2, // 2 hours
			path: "/",
		});

		return { success: true };
	} catch (error) {
		console.error("Error verifying contest password:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to verify password",
		};
	}
}

// Add this function to your existing contest-actions.ts file
export async function getContestProblem(contestId: string, problemId: string) {
	try {
		// First, check if the problem is part of the contest
		const contestResult = await getContestWithProblems(contestId);
		if (!contestResult.success) {
			return { success: false, error: contestResult.error };
		}

		const contest = contestResult.data;
		const problemExists = contest.problems.some(
			(p) => p.problem.id === problemId
		);

		if (!problemExists) {
			return { success: false, error: "Problem not found in this contest" };
		}

		// If the problem is part of the contest, get the full problem details
		const problemResult = await getProblemById(problemId);
		return problemResult;
	} catch (error) {
		console.error("Error getting contest problem:", error);
		return { success: false, error: "Failed to load problem" };
	}
}
