import {
	getContestById,
	getContestProblem,
} from "@/app/actions/contest-actions";
import { verifySession } from "@/app/actions/session";
import { ContestProblemClient } from "./ContestProblemClient";
import { redirect } from "next/navigation";
import { ContestFullScreenWrapper } from "../../ContestFullScreenWrapper";
import { appDb } from "@/db/postgres";
import { problem_test_cases } from "@/db/postgres/schema";
import { sql } from "drizzle-orm";

export default async function ContestProblemPage({
	params,
}: {
	params: { contestId: string; problemId: string };
}) {
	const { contestId, problemId } = await params;
	console.log("Loading problem", contestId, problemId);

	// Verify user session
	const session = await verifySession();
	if (!session.isAuth) {
		redirect(
			"/api/login?callbackUrl=" +
				encodeURIComponent(`/contest/${contestId}/problem/${problemId}`)
		);
	}

	// Get contest data to check if it's active
	const contestResult = await getContestById(contestId);
	if (!contestResult.success) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
				<p>{contestResult.error || "Failed to load contest"}</p>
			</div>
		);
	}

	// Get problem data using the contest-specific function
	const problemResult = await getContestProblem(contestId, problemId);
	if (!problemResult.success) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
				<p>{problemResult.error || "Failed to load problem"}</p>
			</div>
		);
	}

	// Extract problem data correctly - it's in the 'problem' field not 'data'
	const problem = problemResult.problem;
	if (!problem) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
				<p>Problem data structure is invalid</p>
			</div>
		);
	}

	// Fetch test cases for this problem directly from the database
	const testCases = await appDb
		.select({
			id: problem_test_cases.id,
			inputData: problem_test_cases.inputData,
			expectedOutput: problem_test_cases.expectedOutput,
			isHidden: problem_test_cases.isHidden,
		})
		.from(problem_test_cases)
		.where(sql`${problem_test_cases.problemId} = ${problem.id}`);

	// Map the problem data to the expected structure for ContestProblemClient
	const formattedProblemData = {
		id: problem.id || "",
		title: problem.title || "",
		description: problem.description || "",
		boilerplate: problem.boilerplate || problem.sqlBoilerplate || "",
		solution: problem.solution || problem.sqlSolution || "",
		difficulty: problem.difficulty || "medium",
		testCases: testCases,
	};

	// Add default test cases for SQL problems if none exist
	if (formattedProblemData.testCases.length === 0 && problem.sqlBoilerplate) {
		// Create a default test case for SQL problems
		formattedProblemData.testCases = [
			{
				id: "default-test-case",
				inputData: "-- This is a SQL problem. Run your query to see results.",
				expectedOutput: "[]", // Empty array as a string
				isHidden: false,
			},
		];
	}

	const contest = contestResult.data;
	const now = new Date();
	const isActive =
		now >= new Date(contest.startTime) && now <= new Date(contest.endTime);

	// Add debugging to check the structure
	console.log("Formatted problem data:", {
		...formattedProblemData,
		testCases: formattedProblemData.testCases.length,
		sampleTestCase: formattedProblemData.testCases[0] || null,
	});

	// Pass the formatted problem data to the client component
	return (
		<ContestFullScreenWrapper contestId={contestId} isActive={isActive}>
			<ContestProblemClient
				problemData={formattedProblemData}
				contestId={contestId}
				isAuthenticated={session.isAuth}
				contestEndTime={new Date(contest.endTime)}
			/>
		</ContestFullScreenWrapper>
	);
}
