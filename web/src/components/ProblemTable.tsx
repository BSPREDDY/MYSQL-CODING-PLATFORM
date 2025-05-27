"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal, Pencil, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAllProblems } from "@/app/actions/admin";

interface ProblemTableProps {
	filter?: string;
	search?: string;
}

export function ProblemTable({
	filter = "all",
	search = "",
}: ProblemTableProps) {
	const [problems, setProblems] = useState<any[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch problems from database
	useEffect(() => {
		async function fetchProblems() {
			try {
				setIsLoading(true);
				const result = await getAllProblems();

				if (result.success) {
					setProblems(result.data || []);
				} else {
					console.error("Failed to fetch problems:", result.error);
				}
			} catch (error) {
				console.error("Error fetching problems:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProblems();
	}, []);

	// Filter problems based on filter and search
	useEffect(() => {
		let result = [...problems];

		// Apply filter
		if (filter !== "all") {
			if (filter === "hidden") {
				result = result.filter((problem) => problem.hidden);
			} else {
				result = result.filter((problem) => problem.difficulty === filter);
			}
		}

		// Apply search
		if (search) {
			const searchLower = search.toLowerCase();
			result = result.filter(
				(problem) =>
					problem.title.toLowerCase().includes(searchLower) ||
					(problem.tags &&
						problem.tags.some((tag: string) =>
							tag.toLowerCase().includes(searchLower)
						))
			);
		}

		setFilteredProblems(result);
	}, [filter, search, problems]);

	// Get badge variant based on difficulty
	const getDifficultyBadge = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return <Badge className="bg-green-500">Easy</Badge>;
			case "medium":
				return <Badge className="bg-yellow-500">Medium</Badge>;
			case "hard":
				return <Badge className="bg-red-500">Hard</Badge>;
			default:
				return <Badge>Unknown</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Problem</TableHead>
						<TableHead>Difficulty</TableHead>
						<TableHead>Tags</TableHead>
						<TableHead>Visibility</TableHead>
						<TableHead className="w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredProblems.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="h-24 text-center">
								No problems found.
							</TableCell>
						</TableRow>
					) : (
						filteredProblems.map((problem) => (
							<TableRow key={problem.id}>
								<TableCell>
									<div className="font-medium">{problem.title}</div>
									<div className="text-sm text-muted-foreground">
										Added{" "}
										{formatDistanceToNow(new Date(problem.createdAt), {
											addSuffix: true,
										})}
									</div>
								</TableCell>
								<TableCell>{getDifficultyBadge(problem.difficulty)}</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{problem.tags &&
											problem.tags.slice(0, 2).map((tag: string, i: number) => (
												<Badge key={i} variant="outline">
													{tag}
												</Badge>
											))}
										{problem.tags && problem.tags.length > 2 && (
											<Badge variant="outline">
												+{problem.tags.length - 2}
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell>
									{problem.hidden ? (
										<Badge variant="outline" className="text-muted-foreground">
											Hidden
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="bg-green-50 text-green-700 border-green-200"
										>
											Visible
										</Badge>
									)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<Link href={`/admin/problems/${problem.id}`}>
												<DropdownMenuItem>
													<Eye className="mr-2 h-4 w-4" />
													View
												</DropdownMenuItem>
											</Link>
											<Link href={`/admin/problems/${problem.id}/edit`}>
												<DropdownMenuItem>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
											</Link>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
