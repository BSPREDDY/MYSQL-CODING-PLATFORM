"use server";

import { appDb } from "@/db/postgres";
import {
	users,
	submissions,
	problems,
	contests,
	contestPoints,
	problem_test_cases,
	problem_tags,
	tags,
} from "@/db/postgres/schema";
import { eq, and, gte, lte, desc, count, sql, like, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { subDays, subMonths, startOfMonth, endOfMonth, format } from "date-fns";

// Get all problems with filtering options
export async function getAllProblems(
	filter = "all",
	search = "",
	page = 1,
	limit = 10
) {
	try {
		// Base query to select problems
		let query = appDb
			.select({
				id: problems.id,
				title: problems.title,
				difficulty: problems.difficulty,
				hidden: problems.hidden,
				createdAt: problems.createdAt,
				updatedAt: problems.updatedAt,
			})
			.from(problems);

		// Apply filters
		if (filter === "easy") {
			query = query.where(eq(problems.difficulty, "easy"));
		} else if (filter === "medium") {
			query = query.where(eq(problems.difficulty, "medium"));
		} else if (filter === "hard") {
			query = query.where(eq(problems.difficulty, "hard"));
		} else if (filter === "hidden") {
			query = query.where(eq(problems.hidden, true));
		} else if (filter === "visible") {
			query = query.where(eq(problems.hidden, false));
		} else if (filter === "recent") {
			const thirtyDaysAgo = subDays(new Date(), 30);
			query = query.where(gte(problems.createdAt, thirtyDaysAgo));
		}

		// Apply search if provided
		if (search) {
			query = query.where(like(problems.title, `%${search}%`));
		}

		// Count total problems matching the criteria (for pagination)
		const countQuery = appDb
			.select({ count: count() })
			.from(problems)
			.where(
				and(
					...[
						filter === "easy" ? eq(problems.difficulty, "easy") : undefined,
						filter === "medium" ? eq(problems.difficulty, "medium") : undefined,
						filter === "hard" ? eq(problems.difficulty, "hard") : undefined,
						filter === "hidden" ? eq(problems.hidden, true) : undefined,
						filter === "visible" ? eq(problems.hidden, false) : undefined,
						filter === "recent"
							? gte(problems.createdAt, subDays(new Date(), 30))
							: undefined,
						search ? like(problems.title, `%${search}%`) : undefined,
					].filter(Boolean)
				)
			);

		const totalResult = await countQuery;
		const total = totalResult[0]?.count || 0;

		// Apply pagination
		const offset = (page - 1) * limit;
		query = query.limit(limit).offset(offset).orderBy(desc(problems.createdAt));

		// Execute the query
		const allProblems = await query;

		// For each problem, get its tags
		const problemsWithTags = await Promise.all(
			allProblems.map(async (problem) => {
				const problemTagsData = await appDb
					.select({
						tagName: tags.name,
					})
					.from(problem_tags)
					.innerJoin(tags, eq(problem_tags.tagId, tags.id))
					.where(eq(problem_tags.problemId, problem.id));

				// Get submission count for this problem
				const submissionCountResult = await appDb
					.select({ count: count() })
					.from(submissions)
					.where(eq(submissions.problemId, problem.id));

				const submissionCount = submissionCountResult[0]?.count || 0;

				// Get successful submission count for this problem
				const successfulSubmissionCountResult = await appDb
					.select({ count: count() })
					.from(submissions)
					.where(
						and(
							eq(submissions.problemId, problem.id),
							eq(submissions.status, "AC")
						)
					);

				const successfulSubmissionCount =
					successfulSubmissionCountResult[0]?.count || 0;

				return {
					...problem,
					tags: problemTagsData.map((tag) => tag.tagName),
					submissionCount,
					successRate:
						submissionCount > 0
							? Math.round((successfulSubmissionCount / submissionCount) * 100)
							: 0,
				};
			})
		);

		return {
			success: true,
			data: problemsWithTags,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	} catch (error) {
		console.error("Error fetching all problems:", error);
		return {
			success: false,
			error: "Failed to fetch problems",
		};
	}
}

// Get user statistics for the admin dashboard
export async function getUserStats() {
	try {
		// Get total users
		const totalUsersResult = await appDb.select({ count: count() }).from(users);
		const totalUsers = totalUsersResult[0]?.count || 0;

		// Get recent users (last 7 days)
		const sevenDaysAgo = subDays(new Date(), 7);

		const recentUsersResult = await appDb
			.select({ count: count() })
			.from(users)
			.where(gte(users.createdAt, sevenDaysAgo));

		const recentUsers = recentUsersResult[0]?.count || 0;

		// Get user roles distribution
		const adminUsersResult = await appDb
			.select({ count: count() })
			.from(users)
			.where(eq(users.role, "admin"));

		const adminUsers = adminUsersResult[0]?.count || 0;
		const regularUsers = totalUsers - adminUsers;

		return {
			success: true,
			data: {
				totalUsers,
				recentUsers,
				adminUsers,
				regularUsers,
			},
		};
	} catch (error) {
		console.error("Error fetching user stats:", error);
		return {
			success: false,
			error: "Failed to fetch user statistics",
		};
	}
}

// Get recent users for the admin dashboard
export async function getRecentUsers(limit = 5) {
	try {
		const recentUsers = await appDb
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.orderBy(desc(users.createdAt))
			.limit(limit);

		return {
			success: true,
			data: recentUsers,
		};
	} catch (error) {
		console.error("Error fetching recent users:", error);
		return {
			success: false,
			error: "Failed to fetch recent users",
		};
	}
}

// Get all users with filtering options
export async function getAllUsers(filter = "all", search = "") {
	try {
		let query = appDb
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users);

		// Apply filters
		if (filter === "admin") {
			query = query.where(eq(users.role, "admin"));
		} else if (filter === "user") {
			query = query.where(eq(users.role, "user"));
		} else if (filter === "recent") {
			const thirtyDaysAgo = subDays(new Date(), 30);
			query = query.where(gte(users.createdAt, thirtyDaysAgo));
		}

		// Apply search if provided
		if (search) {
			query = query.where(
				or(like(users.name, `%${search}%`), like(users.email, `%${search}%`))
			);
		}

		const allUsers = await query.orderBy(desc(users.createdAt));

		return {
			success: true,
			data: allUsers,
		};
	} catch (error) {
		console.error("Error fetching all users:", error);
		return {
			success: false,
			error: "Failed to fetch users",
		};
	}
}

// Get user by ID with detailed information
export async function getUserById(userId: string) {
	try {
		// Validate userId - ensure it's a valid UUID and not 'stats'
		if (!userId || typeof userId !== "string" || userId === "stats") {
			return {
				success: false,
				error: "Invalid user ID",
			};
		}

		const user = await appDb
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user.length) {
			return {
				success: false,
				error: "User not found",
			};
		}

		return {
			success: true,
			data: user[0],
		};
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		return {
			success: false,
			error: "Failed to fetch user details",
		};
	}
}

// Get user submissions
export async function getUserSubmissions(userId: string, limit?: number) {
	try {
		let query = appDb
			.select({
				id: submissions.id,
				problemId: submissions.problemId,
				status: submissions.status,
				createdAt: submissions.createdAt,
				problemTitle: problems.title,
				problemDifficulty: problems.difficulty,
			})
			.from(submissions)
			.leftJoin(problems, eq(submissions.problemId, problems.id))
			.where(eq(submissions.userId, userId))
			.orderBy(desc(submissions.createdAt));

		if (limit) {
			query = query.limit(limit);
		}

		const userSubmissions = await query;

		return {
			success: true,
			data: userSubmissions,
		};
	} catch (error) {
		console.error("Error fetching user submissions:", error);
		return {
			success: false,
			error: "Failed to fetch user submissions",
		};
	}
}

// Get unique problems solved by user
export async function getUserSolvedProblems(userId: string) {
	try {
		// Get distinct problem IDs where the user has at least one accepted submission
		const solvedProblemsResult = await appDb
			.select({
				problemId: submissions.problemId,
			})
			.from(submissions)
			.where(and(eq(submissions.userId, userId), eq(submissions.status, "AC")))
			.groupBy(submissions.problemId);

		// Return the count of unique problems
		return {
			success: true,
			data: solvedProblemsResult.length,
		};
	} catch (error) {
		console.error("Error fetching user solved problems:", error);
		return {
			success: false,
			error: "Failed to fetch user solved problems",
		};
	}
}

// Get user contest participation
export async function getUserContestParticipation(
	userId: string,
	limit?: number
) {
	try {
		let query = appDb
			.select({
				contestId: contestPoints.contestId,
				pointsEarned: contestPoints.pointsEarned,
				updatedAt: contestPoints.updatedAt,
				contestTitle: contests.title,
				startTime: contests.startTime,
				endTime: contests.endTime,
			})
			.from(contestPoints)
			.leftJoin(contests, eq(contestPoints.contestId, contests.id))
			.where(eq(contestPoints.userId, userId))
			.orderBy(desc(contestPoints.updatedAt));

		if (limit) {
			query = query.limit(limit);
		}

		const userContests = await query;

		return {
			success: true,
			data: userContests,
		};
	} catch (error) {
		console.error("Error fetching user contest participation:", error);
		return {
			success: false,
			error: "Failed to fetch user contest participation",
		};
	}
}

// Create a new user
export async function createUser(userData: {
	name: string;
	email: string;
	password: string;
	role: "user" | "admin";
}) {
	try {
		// Check if email already exists
		const existingUser = await appDb.query.users.findFirst({
			where: eq(users.email, userData.email),
		});

		if (existingUser) {
			return {
				success: false,
				error: "Email already exists. Please use a different email address.",
			};
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Insert the new user
		const result = await appDb
			.insert(users)
			.values({
				name: userData.name,
				email: userData.email,
				password: hashedPassword,
				role: userData.role,
			})
			.returning({ id: users.id });

		if (!result.length) {
			return {
				success: false,
				error: "Failed to create user",
			};
		}

		return {
			success: true,
			data: { id: result[0].id },
		};
	} catch (error) {
		console.error("Error creating user:", error);
		return {
			success: false,
			error: "Failed to create user",
		};
	}
}

// Update an existing user
export async function updateUser(
	userId: string,
	userData: {
		name: string;
		email: string;
		password?: string;
		role: "user" | "admin";
	}
) {
	try {
		// Check if user exists
		const existingUser = await appDb.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!existingUser) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// Check if email is already used by another user
		if (userData.email !== existingUser.email) {
			const emailExists = await appDb.query.users.findFirst({
				where: eq(users.email, userData.email),
			});

			if (emailExists) {
				return {
					success: false,
					error: "Email already exists. Please use a different email address.",
				};
			}
		}

		// Prepare update data
		const updateData: any = {
			name: userData.name,
			email: userData.email,
			role: userData.role,
			updatedAt: new Date(),
		};

		// Add password if provided
		if (userData.password) {
			updateData.password = await bcrypt.hash(userData.password, 10);
		}

		// Update the user
		await appDb.update(users).set(updateData).where(eq(users.id, userId));

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating user:", error);
		return {
			success: false,
			error: "Failed to update user",
		};
	}
}

// Delete a user
export async function deleteUser(userId: string) {
	try {
		// Check if user exists
		const existingUser = await appDb.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!existingUser) {
			return {
				success: false,
				error: "User not found",
			};
		}

		// Delete the user
		await appDb.delete(users).where(eq(users.id, userId));

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error deleting user:", error);
		return {
			success: false,
			error: "Failed to delete user",
		};
	}
}

// Get recent submissions for the admin dashboard
export async function getRecentSubmissions(limit = 5) {
	try {
		const recentSubmissions = await appDb
			.select({
				id: submissions.id,
				userId: submissions.userId,
				problemId: submissions.problemId,
				status: submissions.status,
				createdAt: submissions.createdAt,
				userName: users.name,
				problemTitle: problems.title,
				problemDifficulty: problems.difficulty,
			})
			.from(submissions)
			.leftJoin(users, eq(submissions.userId, users.id))
			.leftJoin(problems, eq(submissions.problemId, problems.id))
			.orderBy(desc(submissions.createdAt))
			.limit(limit);

		return {
			success: true,
			data: recentSubmissions,
		};
	} catch (error) {
		console.error("Error fetching recent submissions:", error);
		return {
			success: false,
			error: "Failed to fetch recent submissions",
		};
	}
}

// Get analytics data for the admin dashboard
export async function getAnalyticsData() {
	try {
		// Get total users
		const totalUsersResult = await appDb.select({ count: count() }).from(users);
		const totalUsers = totalUsersResult[0]?.count || 0;

		// Get total submissions
		const totalSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions);
		const totalSubmissions = totalSubmissionsResult[0]?.count || 0;

		// Get total contests
		const totalContestsResult = await appDb
			.select({ count: count() })
			.from(contests);
		const totalContests = totalContestsResult[0]?.count || 0;

		// Get active contests
		const now = new Date();
		const activeContestsResult = await appDb
			.select({ count: count() })
			.from(contests)
			.where(and(lte(contests.startTime, now), gte(contests.endTime, now)));
		const activeContests = activeContestsResult[0]?.count || 0;

		// Get success rate
		const successfulSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions)
			.where(eq(submissions.status, "AC"));
		const successfulSubmissions = successfulSubmissionsResult[0]?.count || 0;
		const successRate =
			totalSubmissions > 0
				? Math.round((successfulSubmissions / totalSubmissions) * 100)
				: 0;

		// Calculate user growth
		const currentMonth = new Date();
		const lastMonth = subMonths(currentMonth, 1);

		const currentMonthUsersResult = await appDb
			.select({ count: count() })
			.from(users)
			.where(gte(users.createdAt, startOfMonth(currentMonth)));

		const lastMonthUsersResult = await appDb
			.select({ count: count() })
			.from(users)
			.where(
				and(
					gte(users.createdAt, startOfMonth(lastMonth)),
					lte(users.createdAt, endOfMonth(lastMonth))
				)
			);

		const currentMonthUsers = currentMonthUsersResult[0]?.count || 0;
		const lastMonthUsers = lastMonthUsersResult[0]?.count || 0;

		const userGrowth =
			lastMonthUsers > 0
				? Math.round(
						((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
				  )
				: currentMonthUsers > 0
				? 100
				: 0;

		// Calculate submission growth
		const currentMonthSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions)
			.where(gte(submissions.createdAt, startOfMonth(currentMonth)));

		const lastMonthSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions)
			.where(
				and(
					gte(submissions.createdAt, startOfMonth(lastMonth)),
					lte(submissions.createdAt, endOfMonth(lastMonth))
				)
			);

		const currentMonthSubmissions =
			currentMonthSubmissionsResult[0]?.count || 0;
		const lastMonthSubmissions = lastMonthSubmissionsResult[0]?.count || 0;

		const submissionGrowth =
			lastMonthSubmissions > 0
				? Math.round(
						((currentMonthSubmissions - lastMonthSubmissions) /
							lastMonthSubmissions) *
							100
				  )
				: currentMonthSubmissions > 0
				? 100
				: 0;

		// Calculate success rate change
		const currentMonthSuccessfulSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions)
			.where(
				and(
					eq(submissions.status, "AC"),
					gte(submissions.createdAt, startOfMonth(currentMonth))
				)
			);

		const lastMonthSuccessfulSubmissionsResult = await appDb
			.select({ count: count() })
			.from(submissions)
			.where(
				and(
					eq(submissions.status, "AC"),
					gte(submissions.createdAt, startOfMonth(lastMonth)),
					lte(submissions.createdAt, endOfMonth(lastMonth))
				)
			);

		const currentMonthSuccessRate =
			currentMonthSubmissions > 0
				? Math.round(
						((currentMonthSuccessfulSubmissionsResult[0]?.count || 0) /
							currentMonthSubmissions) *
							100
				  )
				: 0;

		const lastMonthSuccessRate =
			lastMonthSubmissions > 0
				? Math.round(
						((lastMonthSuccessfulSubmissionsResult[0]?.count || 0) /
							lastMonthSubmissions) *
							100
				  )
				: 0;

		const successRateChange = currentMonthSuccessRate - lastMonthSuccessRate;

		return {
			success: true,
			data: {
				totalUsers,
				totalSubmissions,
				totalContests,
				activeContests,
				successRate,
				userGrowth,
				submissionGrowth,
				successRateChange,
			},
		};
	} catch (error) {
		console.error("Error fetching analytics data:", error);
		return {
			success: false,
			error: "Failed to fetch analytics data",
		};
	}
}

// Get user growth data for charts
export async function getUserGrowthData() {
	try {
		// Get user registrations by month for the last 6 months
		const sixMonthsAgo = subMonths(new Date(), 6);

		const result = await appDb.execute(sql`
      SELECT 
        DATE_TRUNC('month', ${users.createdAt}) as month,
        COUNT(*) as count
      FROM ${users}
      WHERE ${users.createdAt} >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', ${users.createdAt})
      ORDER BY month ASC
    `);

		// Format the data for the chart
		const formattedData = result.rows.map((row: any) => ({
			month: format(new Date(row.month), "MMM"),
			users: Number(row.count),
		}));

		return {
			success: true,
			data: formattedData,
		};
	} catch (error) {
		console.error("Error fetching user growth data:", error);
		return {
			success: false,
			error: "Failed to fetch user growth data",
		};
	}
}

// Get submission data for charts
export async function getSubmissionChartData() {
	try {
		// Get submissions by month for the last 6 months
		const sixMonthsAgo = subMonths(new Date(), 6);

		const result = await appDb.execute(sql`
      SELECT 
        DATE_TRUNC('month', ${submissions.createdAt}) as month,
        SUM(CASE WHEN ${submissions.status} = 'AC' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN ${submissions.status} != 'AC' THEN 1 ELSE 0 END) as rejected
      FROM ${submissions}
      WHERE ${submissions.createdAt} >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', ${submissions.createdAt})
      ORDER BY month ASC
    `);

		// Format the data for the chart
		const formattedData = result.rows.map((row: any) => ({
			month: format(new Date(row.month), "MMM"),
			accepted: Number(row.accepted),
			rejected: Number(row.rejected),
		}));

		return {
			success: true,
			data: formattedData,
		};
	} catch (error) {
		console.error("Error fetching submission chart data:", error);
		return {
			success: false,
			error: "Failed to fetch submission chart data",
		};
	}
}

// Get problem difficulty distribution for charts
export async function getProblemDifficultyData() {
	try {
		const result = await appDb.execute(sql`
      SELECT 
        ${problems.difficulty} as difficulty,
        COUNT(*) as count
      FROM ${problems}
      GROUP BY ${problems.difficulty}
    `);

		// Format the data for the chart
		const formattedData = result.rows.map((row: any) => ({
			name: row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1),
			value: Number(row.count),
		}));

		return {
			success: true,
			data: formattedData,
		};
	} catch (error) {
		console.error("Error fetching problem difficulty data:", error);
		return {
			success: false,
			error: "Failed to fetch problem difficulty data",
		};
	}
}

// Get contest participation data for charts
export async function getContestParticipationData() {
	try {
		// Get the 6 most recent contests
		const recentContests = await appDb
			.select({
				id: contests.id,
				title: contests.title,
			})
			.from(contests)
			.orderBy(desc(contests.startTime))
			.limit(6);

		// For each contest, count the number of participants
		const participationData = await Promise.all(
			recentContests.map(async (contest) => {
				const participantsResult = await appDb
					.select({ count: count() })
					.from(contestPoints)
					.where(eq(contestPoints.contestId, contest.id));

				return {
					name:
						contest.title.length > 15
							? contest.title.substring(0, 15) + "..."
							: contest.title,
					participants: participantsResult[0]?.count || 0,
				};
			})
		);

		return {
			success: true,
			data: participationData.reverse(), // Reverse to show in chronological order
		};
	} catch (error) {
		console.error("Error fetching contest participation data:", error);
		return {
			success: false,
			error: "Failed to fetch contest participation data",
		};
	}
}

// Get user submission history for user stats chart
export async function getUserSubmissionHistory(userId: string) {
	try {
		// Validate userId
		if (!userId || typeof userId !== "string" || userId === "stats") {
			return {
				success: false,
				error: "Invalid user ID",
			};
		}

		// Get submissions by month for the last 6 months
		const sixMonthsAgo = subMonths(new Date(), 6);

		const result = await appDb.execute(sql`
      SELECT 
        DATE_TRUNC('month', ${submissions.createdAt}) as month,
        COUNT(*) as submissions,
        SUM(CASE WHEN ${submissions.status} = 'AC' THEN 1 ELSE 0 END) as accepted
      FROM ${submissions}
      WHERE ${submissions.userId} = ${userId} AND ${submissions.createdAt} >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', ${submissions.createdAt})
      ORDER BY month ASC
    `);

		// Format the data for the chart
		const formattedData = result.rows.map((row: any) => ({
			month: format(new Date(row.month), "MMM"),
			submissions: Number(row.submissions),
			accepted: Number(row.accepted),
		}));

		return {
			success: true,
			data: formattedData,
		};
	} catch (error) {
		console.error("Error fetching user submission history:", error);
		return {
			success: false,
			error: "Failed to fetch user submission history",
		};
	}
}

// Get problem by ID with test cases and tags
export async function getProblemById(problemId: string) {
	try {
		// Get problem details
		const problem = await appDb
			.select({
				id: problems.id,
				title: problems.title,
				description: problems.description,
				sqlBoilerplate: problems.sqlBoilerplate,
				sqlSolution: problems.sqlSolution,
				difficulty: problems.difficulty,
				hidden: problems.hidden,
				createdAt: problems.createdAt,
				updatedAt: problems.updatedAt,
			})
			.from(problems)
			.where(eq(problems.id, problemId))
			.limit(1);

		if (!problem.length) {
			return {
				success: false,
				error: "Problem not found",
			};
		}

		// Get test cases for this problem
		const testCases = await appDb
			.select({
				id: problem_test_cases.id,
				inputData: problem_test_cases.inputData,
				expectedOutput: problem_test_cases.expectedOutput,
				isHidden: problem_test_cases.isHidden,
			})
			.from(problem_test_cases)
			.where(eq(problem_test_cases.problemId, problemId));

		// Get tags for this problem
		const problemTagsData = await appDb
			.select({
				tagId: problem_tags.tagId,
				tagName: tags.name,
			})
			.from(problem_tags)
			.innerJoin(tags, eq(problem_tags.tagId, tags.id))
			.where(eq(problem_tags.problemId, problemId));

		return {
			success: true,
			data: {
				...problem[0],
				testCases,
				tags: problemTagsData.map((tag) => tag.tagName),
			},
		};
	} catch (error) {
		console.error("Error fetching problem by ID:", error);
		return {
			success: false,
			error: "Failed to fetch problem details",
		};
	}
}

// Update problem
export async function updateProblem(
	problemId: string,
	problemData: {
		title: string;
		description: string;
		sqlBoilerplate: string;
		sqlSolution: string;
		difficulty: "easy" | "medium" | "hard";
		hidden: boolean;
		tags?: string[];
		testCases: Array<{
			id?: string;
			inputData: string;
			expectedOutput: string;
			isHidden: boolean;
			isNew?: boolean;
		}>;
	}
) {
	try {
		return await appDb.transaction(async (tx) => {
			// Update problem
			await tx
				.update(problems)
				.set({
					title: problemData.title,
					description: problemData.description,
					sqlBoilerplate: problemData.sqlBoilerplate,
					sqlSolution: problemData.sqlSolution,
					difficulty: problemData.difficulty,
					hidden: problemData.hidden,
					updatedAt: new Date(),
				})
				.where(eq(problems.id, problemId));

			// Handle test cases
			for (const testCase of problemData.testCases) {
				if (testCase.id && !testCase.isNew) {
					// Update existing test case
					await tx
						.update(problem_test_cases)
						.set({
							inputData: testCase.inputData,
							expectedOutput: testCase.expectedOutput,
							isHidden: testCase.isHidden,
							updatedAt: new Date(),
						})
						.where(eq(problem_test_cases.id, testCase.id));
				} else {
					// Create new test case
					await tx.insert(problem_test_cases).values({
						problemId,
						inputData: testCase.inputData,
						expectedOutput: testCase.expectedOutput,
						isHidden: testCase.isHidden,
					});
				}
			}

			// Handle tags
			if (problemData.tags) {
				// First, remove all existing tags for this problem
				await tx
					.delete(problem_tags)
					.where(eq(problem_tags.problemId, problemId));

				// Then, add the new tags
				for (const tagName of problemData.tags) {
					// Check if tag exists
					let tagId;
					const existingTag = await tx
						.select()
						.from(tags)
						.where(eq(tags.name, tagName))
						.limit(1);

					if (existingTag.length > 0) {
						tagId = existingTag[0].id;
					} else {
						// Create new tag
						const newTag = await tx
							.insert(tags)
							.values({ name: tagName })
							.returning({ id: tags.id });
						tagId = newTag[0].id;
					}

					// Add tag to problem
					await tx.insert(problem_tags).values({
						problemId,
						tagId,
					});
				}
			}

			return {
				success: true,
			};
		});
	} catch (error) {
		console.error("Error updating problem:", error);
		return {
			success: false,
			error: "Failed to update problem",
		};
	}
}

// Delete problem
export async function deleteProblem(problemId: string) {
	try {
		return await appDb.transaction(async (tx) => {
			// Delete test cases
			await tx
				.delete(problem_test_cases)
				.where(eq(problem_test_cases.problemId, problemId));

			// Delete problem tags
			await tx
				.delete(problem_tags)
				.where(eq(problem_tags.problemId, problemId));

			// Delete problem
			await tx.delete(problems).where(eq(problems.id, problemId));

			return {
				success: true,
			};
		});
	} catch (error) {
		console.error("Error deleting problem:", error);
		return {
			success: false,
			error: "Failed to delete problem",
		};
	}
}
