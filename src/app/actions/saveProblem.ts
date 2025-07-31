"use server";

import { appDb } from "@/db/postgres";
import {
	problems,
	tags,
	problem_tags,
	problem_test_cases,
} from "@/db/postgres/schema";
import { executeUserQuery } from "./playGroundAction";
import { eq } from "drizzle-orm";
import test from "node:test";
import { deleteAllTables } from "./playGroundAction";
import { clearAllTableData } from "./playGroundAction";
type TestCase = {
	inputData: string;
	isHidden: boolean;
};

type ProblemInput = {
	title: string;
	description: string;
	sqlBoilerplate: string;
	sqlSolution: string;
	difficulty?: "easy" | "medium" | "hard";
	hidden?: boolean;
	tags?: string[];
	testCases?: TestCase[];
};

export async function saveProblem(
	data: ProblemInput
): Promise<{ success: boolean; error?: string }> {
	try {
		// Validate required fields
		if (
			!data.title ||
			!data.description ||
			!data.sqlBoilerplate ||
			!data.sqlSolution
		) {
			return { success: false, error: "Missing required fields" };
		}

		// === Clear all table data first before executing boilerplate ===
		await clearAllTableData();

		// === Execute Boilerplate SQL ONCE before running the test cases ===
		const boilerplateResult = await executeUserQuery(data.sqlBoilerplate);
		if (!boilerplateResult.success) {
			return {
				success: false,
				error: `Boilerplate execution failed: ${boilerplateResult.error}`,
			};
		}

		const generatedTestCases: {
			inputData: string;
			expectedOutput: string;
			isHidden: boolean;
		}[] = [];

		// === Execute each test case ===
		for (const testCase of data.testCases || []) {
			if (!testCase.inputData.trim()) continue;

			// Clear table data before each test case input execution
			await clearAllTableData();

			// Execute the test case input
			const inputResult = await executeUserQuery(testCase.inputData);
			if (!inputResult.success) {
				return {
					success: false,
					error: `Test case input failed: ${inputResult.error}`,
				};
			}

			// Execute the solution query to get expected output
			const solutionResult = await executeUserQuery(data.sqlSolution);
			if (!solutionResult.success) {
				return {
					success: false,
					error: `Solution execution failed: ${solutionResult.error}`,
				};
			}

			// Save generated test case with expected output
			generatedTestCases.push({
				inputData: testCase.inputData,
				expectedOutput: JSON.stringify(solutionResult.data || []),
				isHidden: testCase.isHidden,
			});
		}

		// Final cleanup after all test cases
		await deleteAllTables();

		// === Save problem and related entities to the DB ===
		return await appDb.transaction(async (tx) => {
			const [problem] = await tx
				.insert(problems)
				.values({
					title: data.title,
					description: data.description,
					sqlBoilerplate: data.sqlBoilerplate,
					sqlSolution: data.sqlSolution,
					difficulty: data.difficulty || "medium",
					hidden: data.hidden || false,
				})
				.returning({ id: problems.id });

			const problemId = problem.id;

			// Handle tags if present
			if (data.tags?.length) {
				for (const tagName of data.tags) {
					let [tag] = await tx
						.select()
						.from(tags)
						.where(eq(tags.name, tagName));
					if (!tag) {
						[tag] = await tx
							.insert(tags)
							.values({ name: tagName })
							.returning({ id: tags.id });
					}
					await tx.insert(problem_tags).values({ problemId, tagId: tag.id });
				}
			}

			// Save test cases
			for (const tc of generatedTestCases) {
				await tx.insert(problem_test_cases).values({
					problemId,
					inputData: tc.inputData,
					expectedOutput: tc.expectedOutput,
					isHidden: tc.isHidden,
				});
			}

			return { success: true };
		});
	} catch (error) {
		console.error("Error saving problem:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
