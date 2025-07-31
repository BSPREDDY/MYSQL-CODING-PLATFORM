"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Loader2, Download, FileSpreadsheet, Filter } from "lucide-react";
import {
	getStudentPerformance,
	getAllSections,
} from "@/app/actions/adminUsers";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Contest = {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
};

type ContestDetail = {
	id: string;
	title: string;
};

type StudentPerformance = {
	id: string;
	name: string;
	email: string;
	regNo: string | null;
	section: string | null;
	totalPoints: number;
	problemsSolved: number;
	totalSubmissions: number;
	rank: number;
	[contestId: string]: any; // For dynamic contest columns
};

export function PerformanceAnalytics({ contests }: { contests: Contest[] }) {
	const [selectedContests, setSelectedContests] = useState<string[]>([]);
	const [performanceData, setPerformanceData] = useState<StudentPerformance[]>(
		[]
	);
	const [contestDetails, setContestDetails] = useState<ContestDetail[]>([]);
	const [loading, setLoading] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [analyzed, setAnalyzed] = useState(false);

	// Section handling
	const [sections, setSections] = useState<string[]>([]);
	const [selectedSection, setSelectedSection] = useState<string>("all");
	const [loadingSections, setLoadingSections] = useState(false);

	// Filtered data based on selected section
	const [filteredData, setFilteredData] = useState<StudentPerformance[]>([]);

	// Fetch sections on mount
	useEffect(() => {
		async function fetchSections() {
			setLoadingSections(true);
			try {
				const result = await getAllSections();
				if (result.success) {
					setSections(result.data);
				}
			} catch (error) {
				console.error("Error fetching sections:", error);
			} finally {
				setLoadingSections(false);
			}
		}

		fetchSections();
	}, []);

	// Filter data when section or performance data changes
	useEffect(() => {
		if (!performanceData.length) {
			setFilteredData([]);
			return;
		}

		if (selectedSection === "all") {
			setFilteredData(performanceData);
		} else {
			const filtered = performanceData.filter(
				(student) => student.section === selectedSection
			);

			// Recalculate ranks for section-specific view
			const ranked = [...filtered]
				.sort((a, b) => b.totalPoints - a.totalPoints)
				.map((student, index) => ({
					...student,
					rank: index + 1,
				}));

			setFilteredData(ranked);
		}
	}, [selectedSection, performanceData]);

	const handleContestToggle = (contestId: string) => {
		setSelectedContests((prev) =>
			prev.includes(contestId)
				? prev.filter((id) => id !== contestId)
				: [...prev, contestId]
		);
	};

	const analyzePerformance = async () => {
		if (selectedContests.length === 0) return;

		setLoading(true);
		try {
			const result = await getStudentPerformance(selectedContests);
			if (result.success) {
				setPerformanceData(result.data);
				setContestDetails(result.contests);
				setAnalyzed(true);
				// Reset to "all" sections view when new data is loaded
				setSelectedSection("all");
			} else {
				console.error("Failed to get performance data:", result.error);
				toast({
					title: "Error",
					description: "Failed to get performance data",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error analyzing performance:", error);
			toast({
				title: "Error",
				description: "An error occurred while analyzing performance",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		if (filteredData.length === 0) return;

		// Create CSV content
		const headers = [
			"Rank",
			"Name",
			"Registration No",
			"Section",
			"Email",
			...contestDetails.map((contest) => contest.title),
			"Total Points",
			"Problems Solved",
		];

		const rows = filteredData.map((student) => [
			student.rank,
			student.name,
			student.regNo || "N/A",
			student.section || "N/A",
			student.email,
			...contestDetails.map((contest) => student[contest.id] || 0),
			student.totalPoints,
			student.problemsSolved,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n");

		// Create and download the file
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		const fileName = `performance_report${
			selectedSection !== "all" ? `_section_${selectedSection}` : ""
		}.csv`;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast({
			title: "Success",
			description: `CSV exported for ${
				selectedSection !== "all"
					? `Section ${selectedSection}`
					: "all sections"
			}`,
		});
	};

	const exportToExcel = async () => {
		if (performanceData.length === 0 || selectedContests.length === 0) return;

		setExporting(true);
		try {
			// Create workbook
			const workbook = XLSX.utils.book_new();

			// Function to create worksheet data
			const createWorksheetData = (data: StudentPerformance[]) => {
				const headers = [
					"Rank",
					"Name",
					"Registration No",
					"Section",
					"Email",
					...contestDetails.map((contest) => contest.title),
					"Total Points",
					"Problems Solved",
				];

				const rows = data.map((student) => [
					student.rank,
					student.name,
					student.regNo || "N/A",
					student.section || "N/A",
					student.email,
					...contestDetails.map((contest) => student[contest.id] || 0),
					student.totalPoints,
					student.problemsSolved,
				]);

				return [headers, ...rows];
			};

			// Add overall worksheet
			const overallData = createWorksheetData(performanceData);
			const overallWorksheet = XLSX.utils.aoa_to_sheet(overallData);
			XLSX.utils.book_append_sheet(
				workbook,
				overallWorksheet,
				"Overall Performance"
			);

			// For each section in the data, create a worksheet
			const sectionsInData = [
				...new Set(
					performanceData.filter((s) => s.section).map((s) => s.section)
				),
			] as string[];

			for (const sectionName of sectionsInData) {
				if (!sectionName) continue;

				const sectionData = performanceData.filter(
					(s) => s.section === sectionName
				);
				if (sectionData.length) {
					// Sort by total points and recalculate ranks
					const rankedSectionData = [...sectionData]
						.sort((a, b) => b.totalPoints - a.totalPoints)
						.map((student, index) => ({
							...student,
							rank: index + 1,
						}));

					const sectionWorksheetData = createWorksheetData(rankedSectionData);
					const sectionWorksheet =
						XLSX.utils.aoa_to_sheet(sectionWorksheetData);
					XLSX.utils.book_append_sheet(
						workbook,
						sectionWorksheet,
						`Section ${sectionName}`
					);
				}
			}

			// Generate Excel file
			const fileName = `performance_report_${
				new Date().toISOString().split("T")[0]
			}.xlsx`;
			XLSX.writeFile(workbook, fileName);

			toast({
				title: "Success",
				description: "Performance report exported with section-wise sheets",
			});
		} catch (error) {
			console.error("Error exporting to Excel:", error);
			toast({
				title: "Error",
				description: "Failed to export performance report",
				variant: "destructive",
			});
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Contest Selection Card */}
			<Card className="shadow-md border-gray-200">
				<CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-lg">
					<CardTitle className="text-xl text-gray-900">
						Select Contests
					</CardTitle>
					<CardDescription>
						Choose one or more contests to analyze student performance
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{contests.map((contest) => (
							<div
								key={contest.id}
								className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md transition-colors"
							>
								<Checkbox
									id={contest.id}
									checked={selectedContests.includes(contest.id)}
									onCheckedChange={() => handleContestToggle(contest.id)}
									className="data-[state=checked]:bg-black"
								/>
								<Label
									htmlFor={contest.id}
									className="cursor-pointer font-medium text-gray-800 flex-1"
								>
									{contest.title}
								</Label>
							</div>
						))}
					</div>

					<Button
						onClick={analyzePerformance}
						disabled={selectedContests.length === 0 || loading}
						className="w-full bg-black hover:bg-gray-800 text-white font-medium"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Analyzing...
							</>
						) : (
							"Analyze Performance"
						)}
					</Button>
				</CardContent>
			</Card>

			{analyzed && (
				<>
					{/* Results Header and Export Options */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-2xl font-bold text-gray-900">
							Performance Results
						</h2>

						<div className="flex flex-wrap gap-3 items-center">
							{sections.length > 0 && (
								<div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
									<Filter className="h-4 w-4 text-gray-600" />
									<Select
										value={selectedSection}
										onValueChange={setSelectedSection}
									>
										<SelectTrigger className="w-[180px] border-gray-300">
											<SelectValue placeholder="Filter by Section" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Sections</SelectItem>
											{sections.map((section) => (
												<SelectItem key={section} value={section}>
													Section {section}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={exportToCSV}
									disabled={filteredData.length === 0}
									className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
								>
									<Download className="h-4 w-4" />
									Export to CSV
									{selectedSection !== "all" && (
										<Badge variant="secondary" className="ml-1 bg-gray-100">
											Section {selectedSection}
										</Badge>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={exportToExcel}
									disabled={performanceData.length === 0 || exporting}
									className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
								>
									{exporting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<FileSpreadsheet className="h-4 w-4" />
									)}
									Export to Excel
									<Badge variant="secondary" className="ml-1 bg-gray-100">
										All Sections
									</Badge>
								</Button>
							</div>
						</div>
					</div>

					{/* Export Info Card */}
					<Card className="bg-gray-100 border-gray-300 shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg text-gray-900">
								Export Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-700">
								The <strong>Excel export</strong> will automatically create
								separate sheets for each section, allowing you to view
								performance data organized by section. The{" "}
								<strong>CSV export</strong> contains data for the currently
								selected section view.
							</p>
						</CardContent>
					</Card>

					{/* Performance Table */}
					{filteredData.length > 0 ? (
						<Card className="shadow-md">
							<CardHeader className="bg-gray-50 border-b border-gray-200">
								<CardTitle className="flex items-center">
									<span>Performance Table</span>
									{selectedSection !== "all" && (
										<Badge variant="outline" className="ml-2 border-gray-300">
											Section {selectedSection}
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="rounded-b-md overflow-x-auto">
									<Table>
										<TableHeader className="bg-gray-50">
											<TableRow>
												<TableHead className="font-bold">Rank</TableHead>
												<TableHead className="font-bold">Name</TableHead>
												<TableHead className="font-bold">Reg No</TableHead>
												<TableHead className="font-bold">Section</TableHead>
												{contestDetails.map((contest) => (
													<TableHead key={contest.id} className="font-bold">
														{contest.title}
													</TableHead>
												))}
												<TableHead className="font-bold">
													Total Points
												</TableHead>
												<TableHead className="font-bold">
													Problems Solved
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredData.map((student, index) => (
												<TableRow
													key={student.id}
													className={
														index % 2 === 0 ? "bg-white" : "bg-gray-50"
													}
												>
													<TableCell className="font-medium">
														{student.rank}
													</TableCell>
													<TableCell className="font-medium text-black">
														{student.name}
													</TableCell>
													<TableCell>{student.regNo || "N/A"}</TableCell>
													<TableCell>{student.section || "N/A"}</TableCell>
													{contestDetails.map((contest) => (
														<TableCell key={contest.id}>
															{student[contest.id] || 0}
														</TableCell>
													))}
													<TableCell className="font-semibold text-black">
														{student.totalPoints}
													</TableCell>
													<TableCell>{student.problemsSolved}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className="shadow-md">
							<CardContent className="flex justify-center items-center h-40">
								<p className="text-gray-500 text-lg">
									No performance data available for the selected criteria
								</p>
							</CardContent>
						</Card>
					)}
				</>
			)}
		</div>
	);
}
