"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import CodeMirrorEditor, {
	type CodeMirrorHandle,
} from "@/components/CodeMirrorEditor";
import { ProblemStatement } from "@/components/ProblemStatement";
import {
	Play,
	ChevronLeft,
	ChevronRight,
	Send,
	LogIn,
	Info,
	Check,
	AlertCircle,
	ArrowUpRight,
	Lightbulb,
	BookOpen,
	Maximize2,
	Minimize2,
	PanelLeft,
	PanelRight,
} from "lucide-react";
import { submitSolution, runCode } from "@/app/actions/playGroundAction";
import { TestCasePanel } from "@/components/TestCasePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ResizablePanel } from "@/components/ResizablePanel";

interface TestCase {
	id: string;
	inputData: string;
	expectedOutput: string;
	isHidden: boolean;
}

interface Problem {
	id: string;
	title: string;
	description: string;
	boilerplate: string;
	solution: string;
	difficulty: "easy" | "medium" | "hard";
	testCases?: TestCase[];
}

type QueryExecutionResult = {
	success: boolean;
	data?: Array<{
		type: string;
		data?: Array<Record<string, string | number>>;
		message?: string;
	}>;
	error?: string;
};

export function ProblemPageClient({
	problemData,
	isAuthenticated = false,
}: {
	problemData: Problem;
	isAuthenticated?: boolean;
}) {
	const router = useRouter();
	const codeEditorRef = useRef<CodeMirrorHandle | null>(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const [isExecuting, setIsExecuting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeTestCase, setActiveTestCase] = useState("case-1");
	const [activeLeftTab, setActiveLeftTab] = useState("description");
	const [editorPanelSize, setEditorPanelSize] = useState(70);
	const [leftPanelSize, setLeftPanelSize] = useState(40);
	const [testResults, setTestResults] = useState<
		Record<string, QueryExecutionResult | null>
	>({});
	const [submissionResult, setSubmissionResult] = useState<{
		success: boolean;
		message: string;
		passedTests: number;
		totalTests: number;
	} | null>(null);
	const { toast } = useToast();

	// Track window size to handle responsive behavior
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1200
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Auto-collapse on small screens
	useEffect(() => {
		if (windowWidth < 768) {
			setIsCollapsed(true);
		}
	}, [windowWidth]);

	if (!problemData) {
		return (
			<div className="flex w-screen h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white items-center justify-center">
				<h1 className="text-3xl font-bold text-red-500">Problem Not Found</h1>
				<Toaster />
			</div>
		);
	}

	const visibleTestCases =
		problemData.testCases?.filter((tc) => !tc.isHidden) || [];

	const handleRunCode = async () => {
		if (!codeEditorRef.current) return;

		setIsExecuting(true);
		setTestResults({});

		try {
			const userCode = codeEditorRef.current.getValue();

			// Execute the code using runCode action
			const result = await runCode({
				code: userCode,
				problemId: problemData.id,
			});

			// Prepare results object to track test case outcomes
			const results: Record<string, QueryExecutionResult | null> = {};

			// Process each test result
			for (const testResult of result.results) {
				if (!testResult.passed) {
					// Handle failed test cases
					const errorDetails =
						// Priority order for error extraction
						testResult.actualOutput?.error ||
						testResult.actualOutput?.message ||
						testResult.actualOutput ||
						"Unknown error";

					results[testResult.testCaseId] = {
						success: false,
						error:
							typeof errorDetails === "object"
								? JSON.stringify(errorDetails, null, 2)
								: String(errorDetails),
					};
				} else {
					// Handle passed test cases
					results[testResult.testCaseId] = {
						success: true,
						data: testResult.actualOutput,
					};
				}
			}

			// Update test results state
			setTestResults(results);

			// Check for any failed tests
			const failedTests = result.results.filter((r) => !r.passed);

			if (failedTests.length > 0) {
				// Get the first failed test's error
				const firstFailedTest = failedTests[0];
				const errorDetails =
					firstFailedTest?.actualOutput?.error ||
					firstFailedTest?.actualOutput?.message ||
					"Unknown error";

				// Custom error formatting function
				const formatError = (error: any) => {
					if (typeof error === "string") return error;
					if (error.error) return error.error;
					return JSON.stringify(error, null, 2);
				};

				const formattedErrorMessage = formatError(errorDetails);

				// Toast notification for error
				toast({
					variant: "destructive",
					title: "Test Case Failed",
					description: (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3">
							<div className="text-red-700 font-mono whitespace-pre-wrap text-sm">
								{formattedErrorMessage}
							</div>
						</div>
					),
					duration: 5000,
				});
			} else {
				// Success case
				toast({
					title: "All test cases passed! 🎉",
					description: "Try submitting your solution now.",
					variant: "default",
					className: "bg-green-500 text-white border-0",
					duration: 5000,
				});
			}
		} catch (error) {
			// Comprehensive error handling for unexpected errors
			const errorMessage =
				error instanceof Error
					? error.message
					: JSON.stringify(error) || "An unexpected error occurred";

			toast({
				variant: "destructive",
				title: "Execution Error",
				description: errorMessage,
				duration: 5000,
			});
		} finally {
			setIsExecuting(false);
		}
	};

	const handleSubmitCode = async () => {
		if (!codeEditorRef.current) return;

		// Check if user is authenticated
		if (!isAuthenticated) {
			toast({
				variant: "destructive",
				title: "Authentication Required",
				description: "Please log in to submit your solution.",
			});

			// Redirect to login page after a short delay
			setTimeout(() => {
				router.push("/api/login");
			}, 2000);

			return;
		}

		setIsSubmitting(true);
		setSubmissionResult(null);

		try {
			const userCode = codeEditorRef.current.getValue();

			// Submit solution to run against all test cases (including hidden ones)
			const result = await submitSolution({
				code: userCode,
				problemId: problemData.id,
			});

			setSubmissionResult(result);
			setActiveLeftTab("submission"); // Switch to submission tab after submission

			if (result.success) {
				toast({
					title: "Success! 🎉",
					description: `Your solution passed ${result.passedTests}/${result.totalTests} test cases.`,
					variant: "default",
					className: "bg-green-500 text-white border-0",
					duration: 5000,
				});
			} else {
				if (result.message.includes("logged in")) {
					// Session expired or not authenticated
					toast({
						variant: "destructive",
						title: "Authentication Required",
						description: "Your session has expired. Please log in again.",
					});

					// Redirect to login page after a short delay
					setTimeout(() => {
						router.push("/api/login");
					}, 2000);
				} else {
					toast({
						variant: "destructive",
						title: "Incorrect Solution",
						description:
							result.message || "Your solution didn't pass all test cases.",
					});
				}
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description:
					"An unexpected error occurred while submitting your solution.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getDifficultyClass = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
			case "medium":
				return "bg-amber-100 text-amber-800 hover:bg-amber-200";
			case "hard":
				return "bg-rose-100 text-rose-800 hover:bg-rose-200";
			default:
				return "bg-zinc-100 text-zinc-800 hover:bg-zinc-200";
		}
	};

	const getDifficultyIcon = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return <Check className="h-3.5 w-3.5" />;
			case "medium":
				return <Info className="h-3.5 w-3.5" />;
			case "hard":
				return <AlertCircle className="h-3.5 w-3.5" />;
			default:
				return null;
		}
	};

	const toggleMaximizeEditor = () => {
		setIsMaximized(!isMaximized);
		if (!isMaximized) {
			// Save current sizes before maximizing
			setEditorPanelSize(90); // Almost full height for editor
			setIsCollapsed(true); // Collapse the left panel
		} else {
			// Restore to default sizes
			setEditorPanelSize(70);
			setIsCollapsed(false);
		}
	};

	return (
		<>
			<div className="flex w-screen h-screen bg-zinc-50 text-zinc-900 p-0 m-0 overflow-hidden">
				{/* Problem Statement Panel */}
				<div
					className={`h-screen ${
						isCollapsed
							? "w-0 opacity-0"
							: "w-full md:w-[45%] lg:w-[40%] opacity-100"
					} transition-all duration-300 ease-in-out bg-white border-r border-zinc-200 overflow-hidden flex-shrink-0`}
				>
					<div className="h-full overflow-auto">
						<div className="max-w-3xl mx-auto p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="flex-1">
									<h1 className="text-2xl font-bold text-zinc-900 mb-1">
										{problemData.title}
									</h1>
									<div className="flex items-center gap-2">
										<Badge
											className={`${getDifficultyClass(
												problemData.difficulty
											)} flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-medium text-xs capitalize`}
										>
											{getDifficultyIcon(problemData.difficulty)}
											{problemData.difficulty}
										</Badge>
										<span className="text-zinc-500 text-sm">SQL Challenge</span>
									</div>
								</div>
							</div>

							{/* Tabs for Description and Submission */}
							<Tabs
								value={activeLeftTab}
								onValueChange={setActiveLeftTab}
								className="w-full mb-6"
							>
								<div className="border-b border-zinc-200">
									<TabsList className="bg-zinc-100 p-0.5">
										<TabsTrigger
											value="description"
											className="px-6 py-2 data-[state=active]:bg-white"
										>
											<BookOpen className="h-4 w-4 mr-2" />
											Description
										</TabsTrigger>
										<TabsTrigger
											value="submission"
											className="px-6 py-2 data-[state=active]:bg-white"
										>
											<ArrowUpRight className="h-4 w-4 mr-2" />
											Results
										</TabsTrigger>
										<TabsTrigger
											value="hints"
											className="px-6 py-2 data-[state=active]:bg-white"
										>
											<Lightbulb className="h-4 w-4 mr-2" />
											Hints
										</TabsTrigger>
									</TabsList>
								</div>

								<TabsContent
									value="description"
									className="pt-4 focus-visible:outline-none focus-visible:ring-0"
								>
									<div className="prose max-w-full">
										<ProblemStatement description={problemData.description} />
									</div>
								</TabsContent>

								<TabsContent
									value="submission"
									className="pt-4 focus-visible:outline-none focus-visible:ring-0"
								>
									{submissionResult ? (
										<div
											className={`p-6 rounded-lg ${
												submissionResult.success
													? "bg-emerald-50 text-emerald-800 border border-emerald-200"
													: "bg-rose-50 text-rose-800 border border-rose-200"
											}`}
										>
											<h3 className="font-bold text-lg mb-3 flex items-center gap-2">
												{submissionResult.success ? (
													<Check className="h-5 w-5 text-emerald-600" />
												) : (
													<AlertCircle className="h-5 w-5 text-rose-600" />
												)}
												{submissionResult.success
													? "All tests passed!"
													: "Some tests failed"}
											</h3>
											<p className="mb-4">{submissionResult.message}</p>
											<div className="mt-2 font-medium flex items-center justify-between bg-white p-3 rounded border border-zinc-200">
												<span>Test cases passed:</span>
												<span
													className={
														submissionResult.success
															? "text-emerald-600"
															: "text-rose-600"
													}
												>
													{submissionResult.passedTests} of{" "}
													{submissionResult.totalTests}
												</span>
											</div>
										</div>
									) : (
										<div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-lg border border-zinc-200">
											<div className="max-w-md mx-auto">
												<ArrowUpRight className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
												<h3 className="text-lg font-medium text-zinc-700 mb-2">
													No submission yet
												</h3>
												<p className="text-zinc-500">
													Run your code against the test cases and submit your
													solution to see results here.
												</p>
											</div>
										</div>
									)}
								</TabsContent>

								<TabsContent
									value="hints"
									className="pt-4 focus-visible:outline-none focus-visible:ring-0"
								>
									<div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
										<h3 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
											<Lightbulb className="h-5 w-5 text-amber-600" />
											Helpful tips
										</h3>
										<ul className="space-y-3 text-amber-800">
											<li className="flex items-start gap-2">
												<span className="bg-amber-200 text-amber-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
													1
												</span>
												<span>
													Make sure your SQL syntax is correct and follows
													standard conventions.
												</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="bg-amber-200 text-amber-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
													2
												</span>
												<span>
													Test your solution with different data sets to ensure
													it works for all cases.
												</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="bg-amber-200 text-amber-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
													3
												</span>
												<span>
													Consider edge cases like NULL values or empty results.
												</span>
											</li>
										</ul>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>

				{/* Panel Controls */}
				<div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 z-20">
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="bg-white text-zinc-600 hover:text-zinc-900 p-2.5 rounded-lg shadow-md border border-zinc-200 transition-all hover:shadow-lg hover:bg-zinc-50 flex items-center justify-center"
						title={
							isCollapsed
								? "Show problem description"
								: "Hide problem description"
						}
					>
						{isCollapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
					</button>

					<button
						onClick={toggleMaximizeEditor}
						className="bg-white text-zinc-600 hover:text-zinc-900 p-2.5 rounded-lg shadow-md border border-zinc-200 transition-all hover:shadow-lg hover:bg-zinc-50 flex items-center justify-center"
						title={isMaximized ? "Restore view" : "Maximize editor"}
					>
						{isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
					</button>
				</div>

				{/* Code Editor */}
				<div
					className={`h-screen ${
						isCollapsed ? "w-full" : "w-full md:w-[55%] lg:w-[60%]"
					} transition-all duration-300 ease-in-out flex flex-col bg-white`}
				>
					<div className="flex justify-between items-center px-6 py-3 border-b border-zinc-200 bg-white w-full">
						<div className="flex w-full items-center justify-center gap-4">
							<Button
								onClick={handleRunCode}
								disabled={isExecuting || isSubmitting}
								className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
							>
								<Play size={16} />
								{isExecuting ? "Running..." : "Run Code"}
							</Button>
							<Button
								onClick={handleSubmitCode}
								disabled={isExecuting || isSubmitting}
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
							>
								{isAuthenticated ? (
									<>
										<Send size={16} />
										{isSubmitting ? "Submitting..." : "Submit"}
									</>
								) : (
									<>
										<LogIn size={16} />
										Login to Submit
									</>
								)}
							</Button>
						</div>
					</div>

					<div className="flex-1 flex flex-col">
						{/* Resizable Editor and Test Cases */}
						<ResizablePanel
							direction="vertical"
							defaultSize={editorPanelSize}
							minSize={30}
							maxSize={90}
							onResize={setEditorPanelSize}
							className="h-full"
						>
							<div className="p-4 h-full">
								<div className="h-full rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
									<CodeMirrorEditor editorRef={codeEditorRef} />
								</div>
							</div>

							{/* Test Cases Panel */}
							<div className="bg-zinc-50 h-full">
								<Tabs defaultValue="testcases" className="w-full h-full">
									<div className="flex items-center px-4 py-2 border-b border-zinc-200">
										<TabsList className="bg-zinc-100 p-0.5">
											<TabsTrigger
												value="testcases"
												className="data-[state=active]:bg-white"
											>
												Test Cases
											</TabsTrigger>
										</TabsList>
									</div>

									<TabsContent
										value="testcases"
										className="p-4 h-full overflow-auto focus-visible:outline-none focus-visible:ring-0"
									>
										{visibleTestCases.length > 0 ? (
											<div className="space-y-4">
												<Tabs
													value={activeTestCase}
													onValueChange={setActiveTestCase}
												>
													<TabsList className="mb-4 bg-zinc-100 p-0.5">
														{visibleTestCases.map((testCase, index) => (
															<TabsTrigger
																key={testCase.id}
																value={`case-${index + 1}`}
																className={`
                                                                    data-[state=active]:bg-white
                                                                    ${
																																			testResults[
																																				testCase
																																					.id
																																			]?.success
																																				? "text-emerald-700 border-emerald-300"
																																				: testResults[
																																						testCase
																																							.id
																																				  ] &&
																																				  !testResults[
																																						testCase
																																							.id
																																				  ]
																																						?.success
																																				? "text-rose-700 border-rose-300"
																																				: ""
																																		}
                                                                `}
															>
																Case {index + 1}
																{testResults[testCase.id]?.success && (
																	<Check className="h-3.5 w-3.5 ml-1.5 text-emerald-600" />
																)}
															</TabsTrigger>
														))}
													</TabsList>

													{visibleTestCases.map((testCase, index) => (
														<TabsContent
															key={testCase.id}
															value={`case-${index + 1}`}
															className="focus-visible:outline-none focus-visible:ring-0"
														>
															<TestCasePanel
																testCase={testCase}
																result={testResults[testCase.id]}
															/>
														</TabsContent>
													))}
												</Tabs>
											</div>
										) : (
											<div className="text-center py-8 text-zinc-500 bg-zinc-100 rounded-lg">
												<div className="max-w-md mx-auto">
													<h3 className="text-lg font-medium text-zinc-700 mb-2">
														No test cases available
													</h3>
													<p className="text-zinc-500">
														There are no test cases defined for this problem
														yet.
													</p>
												</div>
											</div>
										)}
									</TabsContent>
								</Tabs>
							</div>
						</ResizablePanel>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}
