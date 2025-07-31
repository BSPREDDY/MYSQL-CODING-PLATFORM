import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, ArrowRight, ArrowRightLeft } from "lucide-react";

import RenderTable, { type TableData } from "./RenderTable";

interface TestCase {
	id: string;
	inputData: string; //  SQL statements
	expectedOutput: string; // JSON string representing expected TableData or array of result objects
	isHidden: boolean;
}

// This is the type for the 'result' prop passed to TestCasePanel
// It comes from the 'panelResults' object in 'handleRunCode'
type QueryExecutionResult = {
	success: boolean;
	data?: any;
	error?: string;
};

const extractActualDataRows = (input: any): Record<string, any>[] | null => {
	if (!input) return null;

	if (
		typeof input === "object" &&
		input.type === "output_mismatch" &&
		Array.isArray(input.actual)
	) {
		// If input.actual is like [[row1, row2]], we want [row1, row2]
		if (input.actual.length === 1 && Array.isArray(input.actual[0])) {
			// Check if elements of the inner array are objects (or if the inner array is empty)
			if (
				input.actual[0].length === 0 ||
				(input.actual[0].length > 0 &&
					input.actual[0].every(
						(item: any) => typeof item === "object" && item !== null
					))
			) {
				return input.actual[0]; // Return the inner array (which should be the array of row objects)
			}
		}
		// If input.actual is already a flat array of row objects [row1, row2] (or an empty array)
		if (
			input.actual.length === 0 ||
			(input.actual.length > 0 &&
				input.actual.every(
					(item: any) => typeof item === "object" && item !== null
				))
		) {
			return input.actual;
		}
		return null; // Structure within input.actual is not as expected
	}

	// Case 2: Input is an object that directly contains 'actual' and 'expected' arrays (less common)
	if (
		typeof input === "object" &&
		Array.isArray(input.actual) &&
		input.expected
	) {
		// Similar logic for input.actual as in Case 1
		if (input.actual.length === 1 && Array.isArray(input.actual[0])) {
			if (
				input.actual[0].length === 0 ||
				(input.actual[0].length > 0 &&
					input.actual[0].every(
						(item: any) => typeof item === "object" && item !== null
					))
			) {
				return input.actual[0];
			}
		}
		if (
			input.actual.length === 0 ||
			(input.actual.length > 0 &&
				input.actual.every(
					(item: any) => typeof item === "object" && item !== null
				))
		) {
			return input.actual;
		}
		return null;
	}

	// Case 3: Input is an array of query output items from runCode (e.g., result of a successful query)
	// e.g., [{ type: "result", data: [rows] }, { type: "message", data: "..." }]
	if (Array.isArray(input)) {
		const resultItem = input.find((item) => item && item.type === "result");
		if (resultItem && Array.isArray(resultItem.data)) {
			// Ensure resultItem.data is an array of objects (or an empty array)
			if (
				resultItem.data.length === 0 ||
				(resultItem.data.length > 0 &&
					resultItem.data.every(
						(item: any) => typeof item === "object" && item !== null
					))
			) {
				return resultItem.data;
			}
		}
		// Case 3b: Input itself is already an array of data rows (no 'type' wrapper)
		// This can happen if expectedOutput is directly an array of rows.
		if (input.length === 0) return []; // Empty array of rows
		if (
			input.length > 0 &&
			typeof input[0] === "object" &&
			input[0] !== null &&
			!input[0].hasOwnProperty("type")
		) {
			// Heuristic: if the first item is an object and doesn't have a 'type' property, assume it's a data row array.
			if (
				input.every((item: any) => typeof item === "object" && item !== null)
			) {
				return input;
			}
		}
	}

	// Case 4: Input is a single query output item of type "result"
	// e.g., { type: "result", data: [rows] }
	if (
		typeof input === "object" &&
		input.type === "result" &&
		Array.isArray(input.data)
	) {
		if (
			input.data.length === 0 ||
			(input.data.length > 0 &&
				input.data.every(
					(item: any) => typeof item === "object" && item !== null
				))
		) {
			return input.data;
		}
	}

	console.warn(
		"extractActualDataRows: Could not extract a clear array of data rows from input:",
		input
	);
	return null; // Could not extract a clear array of data rows
};

export function TestCasePanel({
	testCase,
	result,
}: {
	testCase: TestCase;
	result: QueryExecutionResult | null;
}) {
	let parsedExpectedOutput: any = null;
	try {
		parsedExpectedOutput = testCase.expectedOutput
			? JSON.parse(testCase.expectedOutput)
			: null;
	} catch (error) {
		console.error(
			"Error parsing expected output for test case:",
			testCase.id,
			error
		);
	}

	const expectedDataRows = extractActualDataRows(parsedExpectedOutput);

	let actualDataRows: Record<string, any>[] | null = null;
	let isOutputMismatchType = false;

	if (result && result.data) {
		if (result.data.type === "output_mismatch") {
			isOutputMismatchType = true;
			actualDataRows = extractActualDataRows(result.data);
		} else {
			actualDataRows = extractActualDataRows(result.data);
		}
	}

	const hasOutputMismatch = result && !result.success && isOutputMismatchType;

	// Convert expected data rows to TableData format
	const expectedTableData: TableData | null =
		expectedDataRows &&
		expectedDataRows.length > 0 &&
		typeof expectedDataRows[0] === "object" &&
		expectedDataRows[0] !== null
			? {
					headers: Object.keys(expectedDataRows[0]),
					rows: expectedDataRows.map((row) => Object.values(row)),
			  }
			: expectedDataRows && expectedDataRows.length === 0
			? {
					headers:
						(parsedExpectedOutput &&
							Array.isArray(parsedExpectedOutput) &&
							parsedExpectedOutput.length > 0 &&
							parsedExpectedOutput[0].headers) ||
						[],
					rows: [],
			  }
			: null;

	// Convert actual data rows to TableData format
	const actualTableData: TableData | null =
		actualDataRows &&
		actualDataRows.length > 0 &&
		typeof actualDataRows[0] === "object" &&
		actualDataRows[0] !== null
			? {
					headers: Object.keys(actualDataRows[0]),
					rows: actualDataRows.map((row) => Object.values(row)),
			  }
			: actualDataRows && actualDataRows.length === 0
			? {
					headers:
						(result?.data?.actual &&
							result.data.actual.length === 1 &&
							result.data.actual[0].length === 0 &&
							expectedTableData?.headers) ||
						expectedTableData?.headers ||
						[],
					rows: [],
			  }
			: null;

	// For displaying raw JSON if table conversion fails or isn't applicable
	const actualJsonToDisplay =
		result?.data?.type === "output_mismatch"
			? result.data.actual
			: result?.data;

	return (
		<div className="space-y-4">
			{/* Status indicator */}
			{result && (
				<div
					className={`transition-all flex items-center gap-3 p-3 rounded-lg ${
						result.success
							? "bg-emerald-50 border border-emerald-200 text-emerald-800"
							: "bg-rose-50 border border-rose-200 text-rose-800"
					}`}
				>
					{result.success ? (
						<>
							<CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
							<span>Test case passed successfully!</span>
						</>
					) : (
						<>
							<XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
							<span>
								{hasOutputMismatch
									? "Output mismatch. Expected and actual results differ."
									: result.error
									? `Test case failed: ${result.error}` // Display specific error if present
									: "Test case failed. Check the output below."}
							</span>
						</>
					)}
				</div>
			)}

			{/* Table comparison layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Expected Output Card */}
				<Card className="border-zinc-200 shadow-sm">
					<CardHeader className="pb-2 bg-zinc-50 flex flex-row items-center justify-between">
						<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
							<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
								E
							</span>
							Expected Output
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{expectedTableData ? (
							<div className="overflow-hidden">
								<RenderTable data={expectedTableData} />
							</div>
						) : (
							<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
								{parsedExpectedOutput !== null
									? JSON.stringify(parsedExpectedOutput, null, 2)
									: "No expected output defined or failed to parse."}
							</pre>
						)}
					</CardContent>
				</Card>

				{/* Comparison arrow on small screens */}
				<div className="md:hidden flex items-center justify-center py-2">
					<div className="bg-zinc-100 rounded-full p-2">
						<ArrowRightLeft className="h-5 w-5 text-zinc-600" />
					</div>
				</div>

				{/* Your Output Card */}
				{result ? (
					<Card
						className={`shadow-sm transition-all ${
							result.success
								? "border-green-500 bg-green-50/30"
								: "border-red-500 bg-red-50/30"
						}`}
					>
						<CardHeader className="pb-2 flex flex-row items-center justify-between bg-zinc-50">
							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
									A
								</span>
								Your Output
							</CardTitle>
							{result.success ? (
								<CheckCircle className="h-5 w-5 text-green-600" />
							) : (
								<XCircle className="h-5 w-5 text-red-600" />
							)}
						</CardHeader>
						<CardContent className="p-0">
							{result.error && !hasOutputMismatch ? (
								<div className="bg-red-50 p-4 rounded-md text-sm text-red-800 overflow-auto max-h-64 font-mono m-4 border border-red-100">
									{result.error}
								</div>
							) : actualTableData ? (
								<div className="overflow-hidden">
									<RenderTable data={actualTableData} />
								</div>
							) : (
								<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
									{actualJsonToDisplay !== undefined
										? JSON.stringify(actualJsonToDisplay, null, 2)
										: result.error
										? result.error
										: "No displayable output or error."}
								</pre>
							)}
						</CardContent>
					</Card>
				) : (
					<Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
						<CardHeader className="pb-2 bg-zinc-50">
							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
									A
								</span>
								Your Output
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
								<ArrowRight className="h-8 w-8 mb-3 text-zinc-400" />
								<p className="text-sm font-medium">
									Run your code to see the results
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

export default TestCasePanel;
