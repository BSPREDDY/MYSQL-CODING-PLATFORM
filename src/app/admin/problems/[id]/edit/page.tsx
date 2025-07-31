"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Loader2, Plus, X, Save, Trash2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
	getProblemById,
	updateProblem,
	deleteProblem,
} from "@/app/actions/admin";
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

// Define the form schema
const formSchema = z.object({
	title: z.string().min(3, {
		message: "Title must be at least 3 characters.",
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
	sqlBoilerplate: z.string().min(1, {
		message: "SQL boilerplate code is required.",
	}),
	sqlSolution: z.string().min(1, {
		message: "SQL solution is required.",
	}),
	difficulty: z.enum(["easy", "medium", "hard"], {
		required_error: "Please select a difficulty level.",
	}),
	hidden: z.boolean().default(false),
	tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TestCase {
	id?: string;
	inputData: string;
	expectedOutput: string;
	isHidden: boolean;
	isNew?: boolean;
	isDeleted?: boolean;
}

export default function EditProblemPage({
	params,
}: {
	params: { id: string };
}) {
	const problemId = params.id;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [newTag, setNewTag] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Initialize the form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			sqlBoilerplate: "",
			sqlSolution: "",
			difficulty: "medium",
			hidden: false,
			tags: [],
		},
	});

	// Load problem data
	useEffect(() => {
		async function loadProblem() {
			try {
				setIsLoading(true);
				const result = await getProblemById(problemId);

				if (result.success && result.data) {
					const problem = result.data;
					form.reset({
						title: problem.title,
						description: problem.description,
						sqlBoilerplate: problem.sqlBoilerplate,
						sqlSolution: problem.sqlSolution,
						difficulty: problem.difficulty as "easy" | "medium" | "hard",
						hidden: problem.hidden,
						tags: problem.tags || [],
					});

					// Set tags state
					setTags(problem.tags || []);

					// Set test cases
					setTestCases(problem.testCases || []);
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
	}, [problemId, router, form]);

	// Handle form submission
	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true);

			// Use the tags state instead of form values
			const formValues = { ...values, tags };

			// Prepare problem data with test cases
			const problemData = {
				...formValues,
				testCases: testCases
					.filter((tc) => !tc.isDeleted) // Filter out deleted test cases
					.map((tc) => ({
						id: tc.id, // Include ID for existing test cases
						inputData: tc.inputData,
						expectedOutput: tc.expectedOutput,
						isHidden: tc.isHidden,
						isNew: tc.isNew, // Flag for new test cases
					})),
			};

			const result = await updateProblem(problemId, problemData);

			if (result.success) {
				toast.success("Problem updated successfully", {
					description: "The problem has been updated.",
				});
				router.push(`/admin/problems/${problemId}`);
			} else {
				toast.error("Failed to update problem", {
					description: result.error || "An unknown error occurred.",
				});
			}
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	// Handle adding a new test case
	const addTestCase = () => {
		setTestCases([
			...testCases,
			{
				inputData: "",
				expectedOutput: "",
				isHidden: false,
				isNew: true,
			},
		]);
	};

	// Handle updating a test case
	const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
		const updatedTestCases = [...testCases];
		updatedTestCases[index] = {
			...updatedTestCases[index],
			[field]: value,
		};
		setTestCases(updatedTestCases);
	};

	// Handle removing a test case
	const removeTestCase = (index: number) => {
		const updatedTestCases = [...testCases];

		// If it's an existing test case (has an ID), mark it as deleted
		if (updatedTestCases[index].id) {
			updatedTestCases[index] = {
				...updatedTestCases[index],
				isDeleted: true,
			};
			setTestCases(updatedTestCases);
		} else {
			// If it's a new test case, remove it from the array
			setTestCases(updatedTestCases.filter((_, i) => i !== index));
		}
	};

	// Handle adding a tag
	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	// Handle removing a tag
	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	// Handle problem deletion
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

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex items-center justify-between">
				<Link
					href={`/admin/problems/${problemId}`}
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Problem
				</Link>
				<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Problem
				</Button>
			</div>

			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Edit Problem</h1>
				<p className="text-muted-foreground">
					Update problem details, test cases, and settings.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Tabs defaultValue="details" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="details">Problem Details</TabsTrigger>
							<TabsTrigger value="code">SQL Code</TabsTrigger>
							<TabsTrigger value="test-cases">Test Cases</TabsTrigger>
							<TabsTrigger value="settings">Settings</TabsTrigger>
						</TabsList>

						<TabsContent value="details" className="space-y-6 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Basic Information</CardTitle>
									<CardDescription>
										Edit the problem title and description.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Problem Title</FormLabel>
												<FormControl>
													<Input placeholder="Enter problem title" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter problem description (supports Markdown)"
														className="min-h-[300px] font-mono text-sm"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Use Markdown to format the problem description.
													Include tables, code blocks, and other formatting as
													needed.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="code" className="space-y-6 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>SQL Boilerplate</CardTitle>
									<CardDescription>
										Initial SQL code provided to users.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="sqlBoilerplate"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder="Enter SQL boilerplate code"
														className="min-h-[200px] font-mono text-sm"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													This code will be used to set up the database
													environment for the problem.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>SQL Solution</CardTitle>
									<CardDescription>
										The correct SQL solution for this problem.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="sqlSolution"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder="Enter SQL solution code"
														className="min-h-[200px] font-mono text-sm"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													This is the reference solution that will be used to
													verify test cases.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="test-cases" className="space-y-6 mt-6">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Test Cases</CardTitle>
										<CardDescription>
											Define test cases to validate user solutions.
										</CardDescription>
									</div>
									<Button type="button" onClick={addTestCase} variant="outline">
										<Plus className="mr-2 h-4 w-4" />
										Add Test Case
									</Button>
								</CardHeader>
								<CardContent>
									<div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
										{testCases
											.filter((tc) => !tc.isDeleted)
											.map((testCase, index) => (
												<Card key={index} className="border rounded-md">
													<CardHeader className="pb-2">
														<div className="flex justify-between items-center">
															<h3 className="font-medium">
																Test Case {index + 1}
															</h3>
															<div className="flex items-center gap-2">
																<div className="flex items-center space-x-2">
																	<Checkbox
																		id={`hidden-${index}`}
																		checked={testCase.isHidden}
																		onCheckedChange={(checked) =>
																			updateTestCase(
																				index,
																				"isHidden",
																				checked === true
																			)
																		}
																	/>
																	<label
																		htmlFor={`hidden-${index}`}
																		className="text-sm"
																	>
																		Hidden Test Case
																	</label>
																</div>
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={() => removeTestCase(index)}
																	className="h-8 w-8 p-0"
																>
																	<X className="h-4 w-4 text-destructive" />
																	<span className="sr-only">Remove</span>
																</Button>
															</div>
														</div>
													</CardHeader>
													<CardContent className="space-y-4">
														<div>
															<label className="text-sm font-medium mb-1 block">
																Input Data (SQL setup)
															</label>
															<Textarea
																value={testCase.inputData}
																onChange={(e) =>
																	updateTestCase(
																		index,
																		"inputData",
																		e.target.value
																	)
																}
																placeholder="SQL statements to set up the test case"
																className="h-[100px] font-mono text-xs"
															/>
														</div>

														<div>
															<label className="text-sm font-medium mb-1 block">
																Expected Output (JSON)
															</label>
															<Textarea
																value={testCase.expectedOutput}
																onChange={(e) =>
																	updateTestCase(
																		index,
																		"expectedOutput",
																		e.target.value
																	)
																}
																placeholder="Expected output in JSON format"
																className="h-[100px] font-mono text-xs"
															/>
														</div>
													</CardContent>
												</Card>
											))}

										{testCases.filter((tc) => !tc.isDeleted).length === 0 && (
											<div className="text-center py-8 text-muted-foreground">
												No test cases defined. Click "Add Test Case" to create
												one.
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="settings" className="space-y-6 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Problem Settings</CardTitle>
									<CardDescription>
										Configure difficulty, visibility, and tags.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="difficulty"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Difficulty</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select difficulty" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="easy">Easy</SelectItem>
														<SelectItem value="medium">Medium</SelectItem>
														<SelectItem value="hard">Hard</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Set the difficulty level of this problem.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="hidden"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Hidden Problem</FormLabel>
													<FormDescription>
														If checked, this problem will not be visible to
														regular users in the problem list.
													</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									<div className="space-y-2">
										<FormLabel>Tags</FormLabel>
										<div className="flex flex-wrap gap-2 mb-2">
											{tags.map((tag, index) => (
												<Badge key={index} className="flex items-center gap-1">
													{tag}
													<button
														type="button"
														onClick={() => removeTag(tag)}
														className="ml-1 h-3 w-3 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/40"
													>
														<X className="h-2 w-2" />
													</button>
												</Badge>
											))}
											{tags.length === 0 && (
												<div className="text-sm text-muted-foreground">
													No tags added yet.
												</div>
											)}
										</div>
										<div className="flex gap-2">
											<Input
												value={newTag}
												onChange={(e) => setNewTag(e.target.value)}
												placeholder="Add a tag..."
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addTag();
													}
												}}
											/>
											<Button
												type="button"
												onClick={addTag}
												size="sm"
												variant="outline"
											>
												<Plus className="h-4 w-4 mr-1" /> Add
											</Button>
										</div>
										<FormDescription>
											Tags help users find problems by category or topic.
										</FormDescription>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					<div className="flex justify-end space-x-4">
						<Button
							variant="outline"
							type="button"
							onClick={() => router.push(`/admin/problems/${problemId}`)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>

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
