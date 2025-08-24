"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { getProblems, getAvailableTags } from "@/app/actions/problem-actions";
import { Button } from "@/components/ui/button";

interface Problem {
	id: string;
	title: string;
	difficulty: string;
	tags: { id: string; name: string }[];
}

interface Tag {
	id: string;
	name: string;
}

export default function ProblemsPage() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState("all");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const pageSize = 10;

	// Fetch problems and tags
	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);

				// Fetch available tags
				const tagsResult = await getAvailableTags();
				if (tagsResult.success) {
					setAvailableTags(tagsResult.tags);
				}

				// Fetch problems with filters
				const difficulties =
					difficultyFilter !== "all" ? [difficultyFilter] : [];
				const result = await getProblems({
					search: searchQuery,
					page: currentPage,
					limit: pageSize,
					tags: selectedTags,
					difficulties,
				});

				setProblems(result.problems || []);
				setTotalPages(result.totalPages || 1);
				setTotalCount(result.totalCount || 0);
			} catch (error) {
				console.error("Error fetching problems:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [searchQuery, difficultyFilter, selectedTags, currentPage]);

	// Handle tag selection
	const handleTagSelect = (tagId: string) => {
		setSelectedTags((prev) =>
			prev.includes(tagId)
				? prev.filter((id) => id !== tagId)
				: [...prev, tagId]
		);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	// Handle difficulty change
	const handleDifficultyChange = (value: string) => {
		setDifficultyFilter(value);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	// Handle search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Reset to first page when search changes
	};

	// Function to determine difficulty badge
	const getDifficultyBadge = (difficulty: string) => {
		switch (difficulty.toLowerCase()) {
			case "easy":
				return (
					<Badge className="bg-green-100 text-green-800 hover:bg-green-200">
						Easy
					</Badge>
				);
			case "medium":
				return (
					<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
						Medium
					</Badge>
				);
			case "hard":
				return (
					<Badge className="bg-red-100 text-red-800 hover:bg-red-200">
						Hard
					</Badge>
				);
			default:
				return <Badge>Unknown</Badge>;
		}
	};

	// Generate pagination items
	const renderPaginationItems = () => {
		const items = [];
		const maxVisiblePages = 5;

		// Always show first page
		items.push(
			<PaginationItem key="first">
				<PaginationLink
					onClick={() => setCurrentPage(1)}
					isActive={currentPage === 1}
				>
					1
				</PaginationLink>
			</PaginationItem>
		);

		// Show ellipsis if needed
		if (currentPage > 3) {
			items.push(
				<PaginationItem key="ellipsis-1">
					<PaginationEllipsis />
				</PaginationItem>
			);
		}

		// Show pages around current page
		const startPage = Math.max(2, currentPage - 1);
		const endPage = Math.min(totalPages - 1, currentPage + 1);

		for (let i = startPage; i <= endPage; i++) {
			if (i > 1 && i < totalPages) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							onClick={() => setCurrentPage(i)}
							isActive={currentPage === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		}

		// Show ellipsis if needed
		if (currentPage < totalPages - 2) {
			items.push(
				<PaginationItem key="ellipsis-2">
					<PaginationEllipsis />
				</PaginationItem>
			);
		}

		// Always show last page if there's more than one page
		if (totalPages > 1) {
			items.push(
				<PaginationItem key="last">
					<PaginationLink
						onClick={() => setCurrentPage(totalPages)}
						isActive={currentPage === totalPages}
					>
						{totalPages}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return items;
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center mb-6">
					<Link href="/">
						<Button variant="outline" size="sm" className="mr-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Button>
					</Link>
					<h1 className="text-3xl font-bold">SQL Problems</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Practice SQL Problems</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
							<form onSubmit={handleSearch} className="flex-1">
								<div className="relative">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search problems by title, description, or tags..."
										className="pl-8"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</form>

							<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
								<Select
									value={difficultyFilter}
									onValueChange={handleDifficultyChange}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Difficulty" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Difficulties</SelectItem>
										<SelectItem value="easy">Easy</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="hard">Hard</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{availableTags.length > 0 && (
							<div className="mb-6">
								<h3 className="text-sm font-medium mb-2">Filter by tags:</h3>
								<div className="flex flex-wrap gap-2">
									{availableTags.map((tag) => (
										<Badge
											key={tag.id}
											className={
												selectedTags.includes(tag.id)
													? "bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
													: "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
											}
											onClick={() => handleTagSelect(tag.id)}
										>
											{tag.name}
										</Badge>
									))}
								</div>
							</div>
						)}

						{isLoading ? (
							<div className="flex justify-center items-center py-12">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
						) : (
							<>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-12 text-center">#</TableHead>
												<TableHead>Title</TableHead>
												<TableHead>Difficulty</TableHead>
												<TableHead>Tags</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{problems.length > 0 ? (
												problems.map((problem, index) => (
													<TableRow
														key={problem.id}
														className="hover:bg-muted/50"
													>
														<TableCell className="text-center font-medium">
															{(currentPage - 1) * pageSize + index + 1}
														</TableCell>
														<TableCell>
															<Link
																href={`/problems/${problem.id}`}
																className="font-medium hover:underline text-primary"
															>
																{problem.title}
															</Link>
														</TableCell>
														<TableCell>
															{getDifficultyBadge(problem.difficulty)}
														</TableCell>
														<TableCell>
															<div className="flex flex-wrap gap-1">
																{problem.tags &&
																	problem.tags.map((tag) => (
																		<Badge
																			key={tag.id}
																			className="bg-secondary/50 text-secondary-foreground text-xs"
																		>
																			{tag.name}
																		</Badge>
																	))}
															</div>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={4} className="h-24 text-center">
														No problems found matching your criteria. Try
														adjusting your filters.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>

								{totalPages > 1 && (
									<div className="mt-6">
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() =>
															setCurrentPage((prev) => Math.max(prev - 1, 1))
														}
														isActive={currentPage > 1}
													/>
												</PaginationItem>

												{renderPaginationItems()}

												<PaginationItem>
													<PaginationNext
														onClick={() =>
															setCurrentPage((prev) =>
																Math.min(prev + 1, totalPages)
															)
														}
														isActive={currentPage < totalPages}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>

										<div className="text-center text-sm text-muted-foreground mt-2">
											Showing{" "}
											{Math.min((currentPage - 1) * pageSize + 1, totalCount)}{" "}
											to {Math.min(currentPage * pageSize, totalCount)} of{" "}
											{totalCount} problems
										</div>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";

// interface Problem {
// 	id: string;
// 	title: string;
// 	description: string;
// 	difficulty: string | null;
// 	hidden: boolean;
// 	sqlBoilerplate: string;
// 	sqlSolution: string;
// 	createdAt: string;
// 	updatedAt: string | null;
// 	tags?: string[];
// }

// interface Tag {
// 	id: string;
// 	name: string;
// }

// export default function ProblemsPage() {
// 	const [problems, setProblems] = useState<Problem[]>([]);
// 	const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const [difficultyFilter, setDifficultyFilter] = useState("all");

// 	// Fetch problems from API
// 	useEffect(() => {
// 		const fetchProblems = async () => {
// 			try {
// 				setIsLoading(true);
// 				const response = await fetch("/api/problems");
// 				const data = await response.json();

// 				if (data.success) {
// 					// Filter out hidden problems
// 					const visibleProblems = data.problems.filter(
// 						(problem: Problem) => !problem.hidden
// 					);
// 					setProblems(visibleProblems);
// 					setFilteredProblems(visibleProblems);
// 				} else {
// 					console.error("Failed to fetch problems:", data.error);
// 				}
// 			} catch (error) {
// 				console.error("Error fetching problems:", error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchProblems();
// 	}, []);

// 	// Filter problems based on search query and difficulty
// 	useEffect(() => {
// 		let result = [...problems];

// 		// Apply search filter
// 		if (searchQuery) {
// 			const query = searchQuery.toLowerCase();
// 			result = result.filter((problem) => {
// 				const titleMatch = problem.title.toLowerCase().includes(query);
// 				const descriptionMatch = problem.description
// 					.toLowerCase()
// 					.includes(query);

// 				// Check tags if they exist
// 				let tagsMatch = false;
// 				if (problem.tags && problem.tags.length > 0) {
// 					tagsMatch = problem.tags.some((tag) =>
// 						tag.toLowerCase().includes(query)
// 					);
// 				}

// 				return titleMatch || descriptionMatch || tagsMatch;
// 			});
// 		}

// 		// Apply difficulty filter
// 		if (difficultyFilter !== "all") {
// 			result = result.filter(
// 				(problem) => problem.difficulty?.toLowerCase() === difficultyFilter
// 			);
// 		}

// 		setFilteredProblems(result);
// 	}, [searchQuery, difficultyFilter, problems]);

// 	// Function to determine difficulty badge
// 	const getDifficultyBadge = (difficulty: string | null) => {
// 		if (!difficulty) return null;

// 		switch (difficulty.toLowerCase()) {
// 			case "easy":
// 				return (
// 					<Badge className="bg-green-500 text-white border-0 rounded">
// 						Easy
// 					</Badge>
// 				);
// 			case "medium":
// 				return (
// 					<Badge className="bg-yellow-500 text-white border-0 rounded">
// 						Medium
// 					</Badge>
// 				);
// 			case "hard":
// 				return (
// 					<Badge className="bg-red-500 text-white border-0 rounded">Hard</Badge>
// 				);
// 			default:
// 				return null;
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen bg-[#0c0c10]">
// 			<div className="container mx-auto px-4 py-8">
// 				<h1 className="text-3xl font-bold text-white mb-8">Problems</h1>

// 				<div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-8">
// 					<div className="relative flex-grow">
// 						<Input
// 							placeholder="Filter by title, description or tags"
// 							className="bg-[#13131c] border-[#2a2a3a] text-gray-200 w-full rounded-md"
// 							value={searchQuery}
// 							onChange={(e) => setSearchQuery(e.target.value)}
// 						/>
// 					</div>
// 					<div className="flex gap-3">
// 						<Select
// 							value={difficultyFilter}
// 							onValueChange={setDifficultyFilter}
// 						>
// 							<SelectTrigger className="w-[180px] bg-[#13131c] border-[#2a2a3a] text-gray-200 rounded-md">
// 								<SelectValue placeholder="Difficulty" />
// 							</SelectTrigger>
// 							<SelectContent className="bg-[#13131c] border-[#2a2a3a] text-gray-200">
// 								<SelectItem value="all">All Difficulties</SelectItem>
// 								<SelectItem value="easy">Easy</SelectItem>
// 								<SelectItem value="medium">Medium</SelectItem>
// 								<SelectItem value="hard">Hard</SelectItem>
// 							</SelectContent>
// 						</Select>
// 					</div>
// 				</div>

// 				<div className="bg-[#13131c] rounded-lg overflow-hidden border border-[#2a2a3a]">
// 					<table className="w-full">
// 						<thead>
// 							<tr className="border-b border-[#2a2a3a]">
// 								<th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">
// 									#
// 								</th>
// 								<th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">
// 									Title
// 								</th>
// 								<th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">
// 									Solution
// 								</th>
// 								<th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">
// 									Difficulty
// 								</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{isLoading ? (
// 								<tr>
// 									<td
// 										colSpan={4}
// 										className="px-4 py-8 text-center text-gray-400"
// 									>
// 										Loading problems...
// 									</td>
// 								</tr>
// 							) : filteredProblems.length > 0 ? (
// 								filteredProblems.map((problem, index) => (
// 									<tr key={problem.id} className="border-b border-[#2a2a3a]">
// 										<td className="px-4 py-4 text-gray-300">{index + 1}</td>
// 										<td className="px-4 py-4">
// 											<div>
// 												<Link
// 													href={`/problems/${problem.id}`}
// 													className="text-gray-200 hover:text-blue-400 font-medium"
// 												>
// 													{problem.title}
// 												</Link>
// 												<div className="flex flex-wrap gap-2 mt-2">
// 													{problem.tags &&
// 														problem.tags.map((tag, i) => (
// 															<Badge
// 																key={i}
// 																variant="outline"
// 																className="bg-[#1e1e2a] text-gray-300 border-[#2a2a3a]"
// 															>
// 																{tag}
// 															</Badge>
// 														))}
// 												</div>
// 											</div>
// 										</td>
// 										<td className="px-4 py-4">
// 											<Button
// 												variant="outline"
// 												size="sm"
// 												className="text-gray-300 border-[#2a2a3a] hover:bg-[#2a2a3a] rounded"
// 											>
// 												Solution
// 											</Button>
// 										</td>
// 										<td className="px-4 py-4">
// 											{getDifficultyBadge(problem.difficulty)}
// 										</td>
// 									</tr>
// 								))
// 							) : (
// 								<tr>
// 									<td
// 										colSpan={4}
// 										className="px-4 py-8 text-center text-gray-400"
// 									>
// 										No problems found.
// 									</td>
// 								</tr>
// 							)}
// 						</tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
