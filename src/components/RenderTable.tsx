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
	rows: any[][];
} | null;

function RenderTable({ data }: { data: TableData }) {
	if (!data || !data.rows || data.rows.length === 0) {
		return (
			<div className="p-4 text-center text-zinc-500">No data to display.</div>
		);
	}

	if (!data.headers || data.headers.length === 0) {
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
