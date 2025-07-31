"use client";

import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getProblemById, deleteProblem } from "@/app/actions/admin";
import { ProblemStatement } from "@/components/ProblemStatement";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProblemDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const problemId = React.use(params).id;
	const router = useRouter();
	const [problem, setProblem] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		async function loadProblem() {
			try {
				setIsLoading(true);
				const result = await getProblemById(problemId);

				if (result.success && result.data) {
					setProblem(result.data);
				} else {
					toast.error("Error", {
						description: "Failed to load problem data.",
					});
					router.push("/admin/problems");
				}
			} catch (error) {
				toast.error("Error", {
					description:
						"An unexpected error occurred while loading problem data.",
				});
				router.push("/admin/problems");
			} finally {
				setIsLoading(false);
			}
		}

		loadProblem();
	}, [problemId, router]);

	const handleDeleteProblem = async () => {
		try {
			setIsDeleting(true);
			const result = await deleteProblem(problemId);

			if (result.success) {
				toast.success("Problem deleted", {
					description: "The problem has been permanently deleted.",
				});
				router.push("/admin/problems");
			} else {
				toast.error("Failed to delete problem", {
					description: result.error || "An unknown error occurred.",
				});
				setDeleteDialogOpen(false);
			}
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred.",
			});
			setDeleteDialogOpen(false);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!problem) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<h1 className="text-2xl font-bold">Problem not found</h1>
				<p className="text-muted-foreground">
					The problem you're looking for doesn't exist or has been removed.
				</p>
				<Button asChild className="mt-4">
					<Link href="/admin/problems">Back to Problems</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" asChild>
						<Link href="/admin/problems">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Problems
						</Link>
					</Button>
					<h1 className="text-3xl font-bold">{problem.title}</h1>
					<Badge
						className={
							problem.difficulty === "easy"
								? "bg-green-500"
								: problem.difficulty === "medium"
								? "bg-yellow-500"
								: "bg-red-500"
						}
					>
						{problem.difficulty}
					</Badge>
					{problem.hidden && <Badge variant="outline">Hidden</Badge>}
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" asChild>
						<Link href={`/admin/problems/${problemId}/edit`}>
							<Edit className="mr-2 h-4 w-4" />
							Edit Problem
						</Link>
					</Button>
					<Button
						variant="destructive"
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Test Cases</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{problem.testCases?.length || 0}
						</div>
						<p className="text-xs text-muted-foreground">
							{problem.testCases?.filter((tc: any) => tc.isHidden)?.length || 0}{" "}
							hidden
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Tags</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-1">
							{problem.tags && problem.tags.length > 0 ? (
								problem.tags.map((tag: string, index: number) => (
									<Badge key={index} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))
							) : (
								<span className="text-xs text-muted-foreground">No tags</span>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="description" className="w-full">
				<TabsList>
					<TabsTrigger value="description">Description</TabsTrigger>
					<TabsTrigger value="solution">Solution</TabsTrigger>
					<TabsTrigger value="test-cases">Test Cases</TabsTrigger>
				</TabsList>
				<TabsContent value="description" className="mt-4">
					<Card>
						<CardContent className="pt-6">
							<div className="prose max-w-none dark:prose-invert">
								<ProblemStatement description={problem.description} />
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="solution" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle>SQL Solution</CardTitle>
							<CardDescription>
								The reference solution for this problem.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
								<code className="text-sm font-mono">{problem.sqlSolution}</code>
							</pre>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="test-cases" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle>Test Cases</CardTitle>
							<CardDescription>
								Test cases used to validate user solutions.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{problem.testCases && problem.testCases.length > 0 ? (
									problem.testCases.map((testCase: any, index: number) => (
										<Card key={index}>
											<CardHeader className="pb-2">
												<div className="flex justify-between items-center">
													<CardTitle className="text-sm font-medium">
														Test Case {index + 1}
													</CardTitle>
													{testCase.isHidden && (
														<Badge variant="outline" className="text-xs">
															Hidden
														</Badge>
													)}
												</div>
											</CardHeader>
											<CardContent className="space-y-2">
												<div>
													<h4 className="text-xs font-medium mb-1">
														Input Data:
													</h4>
													<pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-[100px]">
														{testCase.inputData}
													</pre>
												</div>
												<div>
													<h4 className="text-xs font-medium mb-1">
														Expected Output:
													</h4>
													<pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-[100px]">
														{testCase.expectedOutput}
													</pre>
												</div>
											</CardContent>
										</Card>
									))
								) : (
									<div className="text-center py-4 text-muted-foreground">
										No test cases defined
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							problem and all associated test cases.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDeleteProblem();
							}}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Problem"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
