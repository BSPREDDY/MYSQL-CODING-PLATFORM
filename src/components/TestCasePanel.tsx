// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, XCircle } from "lucide-react";
// import RenderTable, { type TableData } from "./RenderTable";

// interface TestCase {
// 	id: string;
// 	inputData: string;
// 	expectedOutput: string;
// 	isHidden: boolean;
// }

// type QueryExecutionResult = {
// 	success: boolean;
// 	data?: Array<{
// 		type: string;
// 		data?: Array<Record<string, string | number>>;
// 		message?: string;
// 	}>;
// 	error?: string;
// };

// // Helper function to convert result data to TableData format
// const convertToTableData = (data: any): TableData => {
// 	if (!data || !Array.isArray(data) || data.length === 0) return null;

// 	// Find the first result item with table data
// 	const tableResult = data.find(
// 		(item) =>
// 			item.type === "result" && Array.isArray(item.data) && item.data.length > 0
// 	);

// 	if (!tableResult || !tableResult.data || !tableResult.data.length)
// 		return null;

// 	return {
// 		headers: Object.keys(tableResult.data[0]),
// 		rows: tableResult.data.map((row) => Object.values(row)),
// 	};
// };

// export function TestCasePanel({
// 	testCase,
// 	result,
// }: {
// 	testCase: TestCase;
// 	result: QueryExecutionResult | null;
// }) {
// 	// Parse the expected output (stored as JSON string)
// 	// Add error handling for JSON parsing
// 	let expectedOutput;
// 	try {
// 		expectedOutput =
// 			typeof testCase.expectedOutput === "string"
// 				? JSON.parse(testCase.expectedOutput)
// 				: testCase.expectedOutput;
// 	} catch (error) {
// 		console.error("Error parsing expected output:", error);
// 		expectedOutput = testCase.expectedOutput; // Use raw value if parsing fails
// 	}

// 	// Convert expected output to TableData format if it's in the right structure
// 	const expectedTableData = convertToTableData(expectedOutput);

// 	// Also convert actual result data if available
// 	const actualTableData = result?.data ? convertToTableData(result.data) : null;

// 	// Format the data for display in case we need to fall back to raw JSON
// 	const formatData = (data: any) => {
// 		if (data === null || data === undefined) {
// 			return "No data";
// 		}
// 		if (typeof data === "object") {
// 			return JSON.stringify(data, null, 2);
// 		}
// 		return String(data);
// 	};

// 	return (
// 		<div className="space-y-4">
// 			<div className="grid grid-cols-2 gap-4">
// 				<Card>
// 					<CardHeader className="pb-2">
// 						<CardTitle className="text-sm font-medium">
// 							Expected Output
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						{expectedTableData ? (
// 							<div className="overflow-auto max-h-64">
// 								<RenderTable data={expectedTableData} />
// 							</div>
// 						) : (
// 							<pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-32">
// 								{formatData(expectedOutput)}
// 							</pre>
// 						)}
// 					</CardContent>
// 				</Card>

// 				{result && (
// 					<Card
// 						className={result.success ? "border-green-500" : "border-red-500"}
// 					>
// 						<CardHeader className="pb-2 flex flex-row items-center justify-between">
// 							<CardTitle className="text-sm font-medium">Your Output</CardTitle>
// 							{result.success ? (
// 								<CheckCircle className="h-5 w-5 text-green-500" />
// 							) : (
// 								<XCircle className="h-5 w-5 text-red-500" />
// 							)}
// 						</CardHeader>
// 						<CardContent>
// 							{result.error ? (
// 								<div className="bg-red-50 p-3 rounded-md text-sm text-red-800 overflow-auto max-h-32">
// 									{result.error}
// 								</div>
// 							) : actualTableData ? (
// 								<div className="overflow-auto max-h-64">
// 									<RenderTable data={actualTableData} />
// 								</div>
// 							) : (
// 								<pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-32">
// 									{result.data ? formatData(result.data) : "No output"}
// 								</pre>
// 							)}
// 						</CardContent>
// 					</Card>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

//-------------------------------------------------------------------------------------------------------
//Better Styled

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, XCircle, ArrowRight, ArrowRightLeft } from "lucide-react";

// // Import the existing RenderTable component
// import RenderTable, { type TableData } from "./RenderTable";

// interface TestCase {
// 	id: string;
// 	inputData: string;
// 	expectedOutput: string;
// 	isHidden: boolean;
// }

// type QueryExecutionResult = {
// 	success: boolean;
// 	data?: Array<{
// 		type: string;
// 		data?: Array<Record<string, string | number>>;
// 		message?: string;
// 	}>;
// 	error?: string;
// };

// // Export as both named and default export
// export function TestCasePanel({
// 	testCase,
// 	result,
// }: {
// 	testCase: TestCase;
// 	result: QueryExecutionResult | null;
// }) {
// 	// Extract only the result type data from the array of data
// 	const extractResultData = (data: any): any => {
// 		if (!data || !Array.isArray(data)) return null;

// 		// Find the result item (ignore message items)
// 		const resultItem = data.find((item) => item.type === "result");

// 		// If we found a result item with data, return just that
// 		if (resultItem && resultItem.data) {
// 			return resultItem.data;
// 		}

// 		return null;
// 	};

// 	// Parse the expected output (stored as JSON string)
// 	let expectedOutput;
// 	try {
// 		expectedOutput =
// 			typeof testCase.expectedOutput === "string"
// 				? JSON.parse(testCase.expectedOutput)
// 				: testCase.expectedOutput;
// 	} catch (error) {
// 		console.error("Error parsing expected output:", error);
// 		expectedOutput = testCase.expectedOutput;
// 	}

// 	// Get just the result data for expected and actual
// 	const expectedData = extractResultData(expectedOutput);
// 	const actualData = result?.data ? extractResultData(result.data) : null;

// 	// Convert to table format if possible
// 	const expectedTableData =
// 		expectedData && expectedData.length > 0
// 			? {
// 					headers: Object.keys(expectedData[0]),
// 					rows: expectedData.map((row) => Object.values(row)),
// 			  }
// 			: null;

// 	const actualTableData =
// 		actualData && actualData.length > 0
// 			? {
// 					headers: Object.keys(actualData[0]),
// 					rows: actualData.map((row) => Object.values(row)),
// 			  }
// 			: null;

// 	// Find the result item for JSON display
// 	const resultItem = result?.data
// 		? result.data.find((item) => item.type === "result")
// 		: null;
// 	const expectedResultItem =
// 		expectedOutput && Array.isArray(expectedOutput)
// 			? expectedOutput.find((item) => item.type === "result")
// 			: null;

// 	return (
// 		<div className="space-y-4">
// 			{/* Status indicator */}
// 			{result && (
// 				<div
// 					className={`transition-all flex items-center gap-3 p-3 rounded-lg ${
// 						result.success
// 							? "bg-emerald-50 border border-emerald-200 text-emerald-800"
// 							: "bg-rose-50 border border-rose-200 text-rose-800"
// 					}`}
// 				>
// 					{result.success ? (
// 						<>
// 							<CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
// 							<span>Test case passed successfully!</span>
// 						</>
// 					) : (
// 						<>
// 							<XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
// 							<span>Test case failed. Check the output below.</span>
// 						</>
// 					)}
// 				</div>
// 			)}

// 			{/* Table comparison layout */}
// 			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 				<Card className="border-zinc-200 shadow-sm">
// 					<CardHeader className="pb-2 bg-zinc-50 flex flex-row items-center justify-between">
// 						<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 							<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 								E
// 							</span>
// 							Expected Output
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent className="p-0">
// 						{expectedTableData ? (
// 							<div className="overflow-hidden">
// 								<RenderTable data={expectedTableData} />
// 							</div>
// 						) : (
// 							<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
// 								{expectedResultItem
// 									? JSON.stringify([expectedResultItem], null, 2)
// 									: JSON.stringify(expectedOutput, null, 2)}
// 							</pre>
// 						)}
// 					</CardContent>
// 				</Card>

// 				{/* Comparison arrow on small screens */}
// 				<div className="md:hidden flex items-center justify-center py-2">
// 					<div className="bg-zinc-100 rounded-full p-2">
// 						<ArrowRightLeft className="h-5 w-5 text-zinc-600" />
// 					</div>
// 				</div>

// 				{result ? (
// 					<Card
// 						className={`shadow-sm transition-all ${
// 							result.success
// 								? "border-green-500 bg-green-50/30"
// 								: "border-red-500 bg-red-50/30"
// 						}`}
// 					>
// 						<CardHeader className="pb-2 flex flex-row items-center justify-between bg-zinc-50">
// 							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 									A
// 								</span>
// 								Your Output
// 							</CardTitle>
// 							{result.success ? (
// 								<CheckCircle className="h-5 w-5 text-green-600" />
// 							) : (
// 								<XCircle className="h-5 w-5 text-red-600" />
// 							)}
// 						</CardHeader>
// 						<CardContent className="p-0">
// 							{result.error ? (
// 								<div className="bg-red-50 p-4 rounded-md text-sm text-red-800 overflow-auto max-h-64 font-mono m-4 border border-red-100">
// 									{result.error}
// 								</div>
// 							) : actualTableData ? (
// 								<div className="overflow-hidden">
// 									<RenderTable data={actualTableData} />
// 								</div>
// 							) : (
// 								<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
// 									{resultItem
// 										? JSON.stringify([resultItem], null, 2)
// 										: "No result data found"}
// 								</pre>
// 							)}
// 						</CardContent>
// 					</Card>
// 				) : (
// 					<Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
// 						<CardHeader className="pb-2 bg-zinc-50">
// 							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 									A
// 								</span>
// 								Your Output
// 							</CardTitle>
// 						</CardHeader>
// 						<CardContent>
// 							<div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
// 								<ArrowRight className="h-8 w-8 mb-3 text-zinc-400" />
// 								<p className="text-sm font-medium">
// 									Run your code to see the results
// 								</p>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// // Also provide a default export
// export default TestCasePanel;

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, XCircle, ArrowRight, ArrowRightLeft } from "lucide-react";

// // Import the existing RenderTable component
// import RenderTable, { type TableData } from "./RenderTable";

// interface TestCase {
// 	id: string;
// 	inputData: string;
// 	expectedOutput: string;
// 	isHidden: boolean;
// }

// type QueryExecutionResult = {
// 	success: boolean;
// 	data?: any; // This can now be various types depending on the result
// 	error?: string;
// };

// // Export as both named and default export
// export function TestCasePanel({
// 	testCase,
// 	result,
// }: {
// 	testCase: TestCase;
// 	result: QueryExecutionResult | null;
// }) {
// 	// Extract only the result type data from the array of data
// 	const extractResultData = (data: any): any => {
// 		if (!data) return null;

// 		// Handle output_mismatch format (special case for comparison)
// 		if (data.type === "output_mismatch" && data.actual) {
// 			// For output mismatch, directly return the actual data
// 			return data.actual;
// 		}

// 		// Handle case where data itself contains expected and actual
// 		if (data.expected && data.actual) {
// 			return data.actual;
// 		}

// 		// Handle array of query outputs
// 		if (Array.isArray(data)) {
// 			// Find the result item (ignore message items)
// 			const resultItem = data.find((item) => item.type === "result");

// 			// If we found a result item with data, return just that
// 			if (resultItem && resultItem.data) {
// 				return resultItem.data;
// 			}

// 			// If the data is already in array format (but not with type property)
// 			// This handles when output_mismatch.actual is already an array
// 			if (data.length > 0 && !data[0].type) {
// 				return data;
// 			}
// 		}

// 		return data; // Return the data as is if no specific format is detected
// 	};

// 	// Get expected output data
// 	let expectedOutput;
// 	try {
// 		expectedOutput =
// 			typeof testCase.expectedOutput === "string"
// 				? JSON.parse(testCase.expectedOutput)
// 				: testCase.expectedOutput;
// 	} catch (error) {
// 		console.error("Error parsing expected output:", error);
// 		expectedOutput = testCase.expectedOutput;
// 	}

// 	// Handle various result data formats
// 	let actualData = null;
// 	let expectedDataFromMismatch = null;

// 	if (result) {
// 		if (result.data) {
// 			// For output_mismatch case
// 			if (result.data.type === "output_mismatch") {
// 				actualData = result.data.actual;
// 				expectedDataFromMismatch = result.data.expected;
// 			}
// 			// Also check nested structure for output_mismatch
// 			else if (result.data.expected && result.data.actual) {
// 				actualData = result.data.actual;
// 				expectedDataFromMismatch = result.data.expected;
// 			}
// 			// For regular array of query outputs
// 			else if (Array.isArray(result.data)) {
// 				actualData = extractResultData(result.data);
// 			} else {
// 				actualData = extractResultData(result.data);
// 			}
// 		}
// 	}

// 	// Get the expected data - prioritize mismatch data if available
// 	const expectedData =
// 		expectedDataFromMismatch || extractResultData(expectedOutput);

// 	// Debug log to understand what's happening
// 	console.log("Actual Data Structure:", actualData);

// 	// Convert to table format if possible
// 	const expectedTableData =
// 		expectedData && Array.isArray(expectedData) && expectedData.length > 0
// 			? {
// 					headers: Object.keys(expectedData[0]),
// 					rows: expectedData.map((row) => Object.values(row)),
// 			  }
// 			: null;

// 	// Improved handling for actualData to ensure correct table formatting
// 	let actualTableData = null;

// 	if (actualData) {
// 		// First, ensure actualData is an array
// 		const dataArray = Array.isArray(actualData) ? actualData : [actualData];

// 		// Then check if it has valid objects to create a table
// 		if (
// 			dataArray.length > 0 &&
// 			typeof dataArray[0] === "object" &&
// 			dataArray[0] !== null
// 		) {
// 			actualTableData = {
// 				headers: Object.keys(dataArray[0]),
// 				rows: dataArray.map((row) => Object.values(row)),
// 			};
// 		}
// 	}

// 	// Find the result items for JSON display - safely handle various data formats
// 	let resultItem = null;
// 	if (result?.data) {
// 		// For output_mismatch format
// 		if (
// 			result.data.type === "output_mismatch" ||
// 			(result.data.expected && result.data.actual)
// 		) {
// 			resultItem = {
// 				type: "result",
// 				data: result.data.actual,
// 			};
// 		}
// 		// For regular array format
// 		else if (Array.isArray(result.data)) {
// 			resultItem = result.data.find((item) => item.type === "result");
// 		} else {
// 			resultItem = result.data;
// 		}
// 	}

// 	let expectedResultItem = null;
// 	if (expectedOutput && Array.isArray(expectedOutput)) {
// 		expectedResultItem = expectedOutput.find((item) => item.type === "result");
// 	}

// 	// Determine if there's an output mismatch
// 	const hasOutputMismatch =
// 		result &&
// 		!result.success &&
// 		((result.data && result.data.type === "output_mismatch") ||
// 			(result.data && result.data.expected && result.data.actual));

// 	return (
// 		<div className="space-y-4">
// 			{/* Status indicator */}
// 			{result && (
// 				<div
// 					className={`transition-all flex items-center gap-3 p-3 rounded-lg ${
// 						result.success
// 							? "bg-emerald-50 border border-emerald-200 text-emerald-800"
// 							: "bg-rose-50 border border-rose-200 text-rose-800"
// 					}`}
// 				>
// 					{result.success ? (
// 						<>
// 							<CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
// 							<span>Test case passed successfully!</span>
// 						</>
// 					) : (
// 						<>
// 							<XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
// 							<span>
// 								{hasOutputMismatch
// 									? "Output mismatch. Expected and actual results differ."
// 									: "Test case failed. Check the output below."}
// 							</span>
// 						</>
// 					)}
// 				</div>
// 			)}

// 			{/* Table comparison layout */}
// 			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 				<Card className="border-zinc-200 shadow-sm">
// 					<CardHeader className="pb-2 bg-zinc-50 flex flex-row items-center justify-between">
// 						<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 							<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 								E
// 							</span>
// 							Expected Output
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent className="p-0">
// 						{expectedTableData ? (
// 							<div className="overflow-hidden">
// 								<RenderTable data={expectedTableData} />
// 							</div>
// 						) : (
// 							<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
// 								{expectedResultItem
// 									? JSON.stringify([expectedResultItem], null, 2)
// 									: JSON.stringify(expectedOutput, null, 2)}
// 							</pre>
// 						)}
// 					</CardContent>
// 				</Card>

// 				{/* Comparison arrow on small screens */}
// 				<div className="md:hidden flex items-center justify-center py-2">
// 					<div className="bg-zinc-100 rounded-full p-2">
// 						<ArrowRightLeft className="h-5 w-5 text-zinc-600" />
// 					</div>
// 				</div>

// 				{result ? (
// 					<Card
// 						className={`shadow-sm transition-all ${
// 							result.success
// 								? "border-green-500 bg-green-50/30"
// 								: "border-red-500 bg-red-50/30"
// 						}`}
// 					>
// 						<CardHeader className="pb-2 flex flex-row items-center justify-between bg-zinc-50">
// 							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 									A
// 								</span>
// 								Your Output
// 							</CardTitle>
// 							{result.success ? (
// 								<CheckCircle className="h-5 w-5 text-green-600" />
// 							) : (
// 								<XCircle className="h-5 w-5 text-red-600" />
// 							)}
// 						</CardHeader>
// 						<CardContent className="p-0">
// 							{result.error ? (
// 								<div className="bg-red-50 p-4 rounded-md text-sm text-red-800 overflow-auto max-h-64 font-mono m-4 border border-red-100">
// 									{result.error}
// 								</div>
// 							) : hasOutputMismatch ? (
// 								// Output mismatch - show the actual data as a table
// 								<div>
// 									{actualTableData ? (
// 										<div className="overflow-hidden">
// 											<RenderTable data={actualTableData} />
// 										</div>
// 									) : (
// 										<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
// 											{JSON.stringify(actualData, null, 2)}
// 										</pre>
// 									)}
// 								</div>
// 							) : actualTableData ? (
// 								<div className="overflow-hidden">
// 									<RenderTable data={actualTableData} />
// 								</div>
// 							) : (
// 								<pre className="bg-zinc-50 p-4 rounded-md text-sm overflow-auto max-h-64 font-mono text-zinc-700 m-4">
// 									{resultItem
// 										? JSON.stringify(
// 												Array.isArray(resultItem) ? resultItem : [resultItem],
// 												null,
// 												2
// 										  )
// 										: "No result data found"}
// 								</pre>
// 							)}
// 						</CardContent>
// 					</Card>
// 				) : (
// 					<Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
// 						<CardHeader className="pb-2 bg-zinc-50">
// 							<CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
// 								<span className="inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded-full h-5 w-5 text-xs font-medium">
// 									A
// 								</span>
// 								Your Output
// 							</CardTitle>
// 						</CardHeader>
// 						<CardContent>
// 							<div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
// 								<ArrowRight className="h-8 w-8 mb-3 text-zinc-400" />
// 								<p className="text-sm font-medium">
// 									Run your code to see the results
// 								</p>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// // Also provide a default export
// export default TestCasePanel;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming path
import { CheckCircle, XCircle, ArrowRight, ArrowRightLeft } from "lucide-react";

// Import the existing RenderTable component (assuming it's in the same directory or adjust path)
import RenderTable, { type TableData } from "./RenderTable"; // Ensure this path is correct

interface TestCase {
	id: string;
	inputData: string; // Usually SQL statements
	expectedOutput: string; // JSON string representing expected TableData or array of result objects
	isHidden: boolean;
}

// This is the type for the 'result' prop passed to TestCasePanel
// It comes from the 'panelResults' object in 'handleRunCode'
type QueryExecutionResult = {
	success: boolean;
	data?: any; // Can be various types: output_mismatch object, array of query output objects, error object
	error?: string; // Error message string
};

/**
 * Extracts the actual data rows (array of objects) from various possible structures
 * that `result.data` or `testCase.expectedOutput` might hold.
 * This version is enhanced to handle potential double-wrapping of arrays in mismatch scenarios.
 */
const extractActualDataRows = (input: any): Record<string, any>[] | null => {
	if (!input) return null;

	// Case 1: Input is an 'output_mismatch' object from runCode
	// e.g., { type: "output_mismatch", actual: [rows] or [[rows]], expected: [rows] }
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
	result, // This is of type QueryExecutionResult
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
			// Pass the whole mismatch object (result.data) to extractActualDataRows
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
					headers: Object.keys(actualDataRows[0]), // This should now get correct column names
					rows: actualDataRows.map((row) => Object.values(row)), // This should map to primitive values
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
			? result.data.actual // Show the 'actual' part of the mismatch
			: result?.data; // Otherwise show the whole data part of the result

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
