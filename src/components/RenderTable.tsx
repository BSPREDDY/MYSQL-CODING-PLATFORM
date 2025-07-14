// export type TableData = {
// 	headers: string[];
// 	rows: (string | number)[][];
// } | null;
// export type QueryOutput = {
// 	type: "table" | "message";
// 	data: TableData | string;
// };

// export type QueryOutputs = QueryOutput[];
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";

// function RenderTable({ data }: { data: TableData }) {
// 	if (!data) return null;

// 	return (
// 		<div className="space-y-8 p-4">
// 			<div className="rounded-md border bg-white shadow-sm overflow-hidden">
// 				<div className="overflow-auto max-h-[calc(100vh-300px)]">
// 					<Table>
// 						<TableHeader className="sticky top-0 bg-white z-10">
// 							<TableRow>
// 								{data.headers.map((header, index) => (
// 									<TableHead
// 										key={`header-${index}`}
// 										className="font-bold text-black bg-gray-100 px-6 py-4"
// 									>
// 										{header}
// 									</TableHead>
// 								))}
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody>
// 							{data.rows.map((row, rowIndex) => (
// 								<TableRow
// 									key={`row-${rowIndex}`}
// 									// className="hover:bg-gray-50 transition-colors"
// 								>
// 									{row.map((cell, cellIndex) => (
// 										<TableCell
// 											key={`cell-${rowIndex}-${cellIndex}`}
// 											className="px-6 py-4 border-b"
// 										>
// 											{cell}
// 										</TableCell>
// 									))}
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					</Table>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default RenderTable;

//------------------------------------------------------------------------------------------------------
//Better Styled

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"; // Assuming this path is correct

export type TableData = {
	headers: string[];
	// Allow rows to contain any type, as Object.values() can return mixed types
	rows: any[][];
} | null;

// QueryOutput and QueryOutputs types would typically be defined elsewhere or alongside TestCasePanel
// For this component, only TableData is directly used.

function RenderTable({ data }: { data: TableData }) {
	if (!data || !data.rows || data.rows.length === 0) {
		// Optionally render a message for no data, or return null
		return (
			<div className="p-4 text-center text-zinc-500">No data to display.</div>
		);
	}

	// Ensure headers are present if rows are present
	if (!data.headers || data.headers.length === 0) {
		// Fallback if headers are missing but rows exist (e.g., generate generic headers)
		// Or treat as an invalid state
		if (data.rows[0]) {
			data.headers = data.rows[0].map((_, index) => `Column ${index + 1}`);
		} else {
			return (
				<div className="p-4 text-center text-zinc-500">
					Invalid table data format.
				</div>
			);
		}
	}

	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
				<div className="overflow-auto max-h-[calc(100vh-300px)]">
					{" "}
					{/* Adjust max-h as needed */}
					<Table>
						<TableHeader className="sticky top-0 bg-white z-10">
							<TableRow>
								{data.headers.map((header, index) => (
									<TableHead
										key={`header-${index}`}
										className="font-semibold text-zinc-900 bg-zinc-50 px-6 py-3 text-left whitespace-nowrap"
									>
										{header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.rows.map((row, rowIndex) => (
								<TableRow
									key={`row-${rowIndex}`}
									className="hover:bg-zinc-50 transition-colors"
								>
									{row.map((cell, cellIndex) => (
										<TableCell
											key={`cell-${rowIndex}-${cellIndex}`}
											className="px-6 py-3 text-zinc-700 font-mono text-sm border-b border-zinc-100 whitespace-nowrap"
										>
											{/*
                                                Safely render cell content.
                                                If cell is an object or array, stringify it.
                                                null will be rendered as "null", undefined as empty.
                                            */}
											{typeof cell === "object" && cell !== null
												? JSON.stringify(cell)
												: cell === null || cell === undefined
												? ""
												: String(cell)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export default RenderTable;
