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
	Send,
	LogIn,
	Info,
	Check,
	AlertCircle,
	ArrowUpRight,
	BookOpen,
	Maximize2,
	Minimize2,
	PanelLeft,
	PanelRight,
	ChevronDown,
	ChevronUp,
	Clock,
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
	const [editorPanelSize, setEditorPanelSize] = useState(70); // Default: editor 70%, test cases 30%
	const [testCasesPanelCollapsed, setTestCasesPanelCollapsed] = useState(false);
	const [testResults, setTestResults] = useState<
		Record<string, QueryExecutionResult | null>
	>({});
	const [submissionResult, setSubmissionResult] = useState<{
		success: boolean;
		message: string;
		passedTests: number;
		totalTests: number;
	} | null>(null);
	const [isTestCasesPanelFullscreen, setIsTestCasesPanelFullscreen] =
		useState(false);

	// Rate limiting state
	const [lastRunTime, setLastRunTime] = useState<number>(0);
	const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
	const [runCooldown, setRunCooldown] = useState<number>(0);
	const [submitCooldown, setSubmitCooldown] = useState<number>(0);
	const COOLDOWN_PERIOD = 10; // 10 seconds cooldown

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

	// Cooldown timer effect
	useEffect(() => {
		const timer = setInterval(() => {
			const now = Math.floor(Date.now() / 1000);

			if (lastRunTime > 0) {
				const elapsed = now - lastRunTime;
				if (elapsed < COOLDOWN_PERIOD) {
					setRunCooldown(COOLDOWN_PERIOD - elapsed);
				} else {
					setRunCooldown(0);
				}
			}

			if (lastSubmitTime > 0) {
				const elapsed = now - lastSubmitTime;
				if (elapsed < COOLDOWN_PERIOD) {
					setSubmitCooldown(COOLDOWN_PERIOD - elapsed);
				} else {
					setSubmitCooldown(0);
				}
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [lastRunTime, lastSubmitTime]);

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

		// Check if in cooldown period
		const now = Math.floor(Date.now() / 1000);
		if (now - lastRunTime < COOLDOWN_PERIOD) {
			toast({
				variant: "destructive",
				title: "Rate Limited",
				description: `Please wait ${runCooldown} seconds before running code again.`,
				duration: 3000,
			});
			return;
		}

		setIsExecuting(true);
		setTestResults({});
		setLastRunTime(now);

		try {
			const userCode = codeEditorRef.current.getValue();

			// Execute the code using runCode action
			const runCodeResult = await runCode({
				code: userCode,
				problemId: problemData.id,
			});

			// Prepare results object to track test case outcomes for TestCasePanel
			const panelResults: Record<string, QueryExecutionResult | null> = {};

			// Process each test result from runCodeResult
			for (const testResult of runCodeResult.results) {
				if (!testResult.passed) {
					// Handle failed test cases
					if (testResult.actualOutput?.type === "output_mismatch") {
						// For output mismatch, pass the entire actualOutput object.
						panelResults[testResult.testCaseId] = {
							success: false,
							data: testResult.actualOutput, // Pass the full object containing type, actual, expected
						};
					} else {
						// Handle other types of errors (e.g., runtime errors from SQL execution)
						const errorDetails =
							testResult.actualOutput?.error ||
							testResult.actualOutput?.message ||
							testResult.actualOutput || // Could be a string or other error structure
							"Unknown error";

						panelResults[testResult.testCaseId] = {
							success: false,
							error:
								typeof errorDetails === "object"
									? JSON.stringify(errorDetails, null, 2)
									: String(errorDetails),
						};
					}
				} else {
					// Handle passed test cases - include the actual data
					panelResults[testResult.testCaseId] = {
						success: true,
						data: testResult.actualOutput, // This would be the data array from successful query
					};
				}
			}

			// Update test results state for TestCasePanel components
			setTestResults(panelResults);

			// Check for any failed tests to show a summary toast
			const failedTests = runCodeResult.results.filter((r) => !r.passed);

			if (failedTests.length > 0) {
				// Get the first failed test
				const firstFailedTest = failedTests[0];

				// Check if it's an output mismatch using the original structured data
				if (firstFailedTest.actualOutput?.type === "output_mismatch") {
					toast({
						variant: "destructive",
						title: "Output Mismatch",
						description: (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<div className="text-red-700 font-semibold mb-2">
									Your query result doesn't match the expected output.
								</div>
								<div className="text-red-700 font-mono whitespace-pre-wrap text-sm">
									Check the test results panel for details.
								</div>
							</div>
						),
						duration: 5000,
					});
				} else {
					// Handle other types of errors for the toast
					const errorDetails =
						firstFailedTest?.actualOutput?.error ||
						firstFailedTest?.actualOutput?.message ||
						"Unknown error";

					const formatError = (error: any) => {
						if (typeof error === "string") return error;
						if (error.error) return error.error; // If error is an object like { error: "message" }
						return JSON.stringify(error, null, 2);
					};

					const formattedErrorMessage = formatError(errorDetails);

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
				}
			} else {
				// Success case: All tests passed
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
					: typeof error === "string"
					? error
					: JSON.stringify(error) || "An unexpected error occurred";

			toast({
				variant: "destructive",
				title: "Execution Error",
				description: errorMessage,
				duration: 5000,
			});
			console.error("Error in handleRunCode:", error);
		} finally {
			setIsExecuting(false);
		}
	};

	const handleSubmitCode = async () => {
		if (!codeEditorRef.current) return;

		// Check if in cooldown period
		const now = Math.floor(Date.now() / 1000);
		if (now - lastSubmitTime < COOLDOWN_PERIOD) {
			toast({
				variant: "destructive",
				title: "Rate Limited",
				description: `Please wait ${submitCooldown} seconds before submitting again.`,
				duration: 3000,
			});
			return;
		}

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
		setLastSubmitTime(now);

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

	const toggleTestCasesPanelFullscreen = () => {
		setIsTestCasesPanelFullscreen(!isTestCasesPanelFullscreen);

		// When entering fullscreen, ensure panel isn't collapsed
		if (!isTestCasesPanelFullscreen && testCasesPanelCollapsed) {
			setTestCasesPanelCollapsed(false);
			// If it was collapsed, ensure editor panel size is appropriate for expanded test cases
			setEditorPanelSize(70); // Default expanded size for editor
		}
	};

	// Update the toggleTestCasesPanel function to better control sizing
	const toggleTestCasesPanel = () => {
		const isCurrentlyCollapsed = testCasesPanelCollapsed;
		setTestCasesPanelCollapsed(!isCurrentlyCollapsed);

		if (!isCurrentlyCollapsed) {
			// Panel is now collapsing
			setEditorPanelSize(90); // Editor gets 90%, test panel gets 10% (for its header)
		} else {
			// Panel is now expanding
			setEditorPanelSize(70); // Editor gets 70%, test panel gets 30%
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
								disabled={isExecuting || isSubmitting || runCooldown > 0}
								className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
							>
								{runCooldown > 0 ? (
									<>
										<Clock size={16} />
										Wait {runCooldown}s
									</>
								) : (
									<>
										<Play size={16} />
										{isExecuting ? "Running..." : "Run Code"}
									</>
								)}
							</Button>
							<Button
								onClick={handleSubmitCode}
								disabled={isExecuting || isSubmitting || submitCooldown > 0}
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
							>
								{submitCooldown > 0 ? (
									<>
										<Clock size={16} />
										Wait {submitCooldown}s
									</>
								) : isAuthenticated ? (
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

					<div className="flex-1 flex flex-col h-full overflow-hidden">
						{/* Resizable Panel with flex and overflow handling */}
						<ResizablePanel
							key={String(testCasesPanelCollapsed)} // Add this key to force re-mount on toggle
							direction="vertical"
							defaultSize={editorPanelSize}
							minSize={30}
							maxSize={95} // Allow editor to take up to 95% if test panel is very small
							onResize={setEditorPanelSize}
							className="h-full flex flex-col"
						>
							{/* Editor Panel with explicit overflow handling */}
							<div className="flex-grow flex flex-col h-full p-4 overflow-hidden">
								<div className="h-full w-full rounded-lg overflow-hidden border border-zinc-200 shadow-sm flex flex-col">
									<CodeMirrorEditor editorRef={codeEditorRef} />
								</div>
							</div>

							{/* Test Cases Panel with explicit overflow handling */}
							<div
								className={`bg-zinc-50 flex-shrink-0 overflow-hidden transition-all duration-300 ${
									isTestCasesPanelFullscreen
										? "fixed inset-0 z-50 bg-white overflow-auto"
										: testCasesPanelCollapsed
										? "" // Rely on ResizablePanel's percentage for height
										: ""
								}`}
							>
								<Tabs defaultValue="testcases" className="w-full h-full">
									<div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200">
										<TabsList className="bg-zinc-100 p-0.5">
											<TabsTrigger
												value="testcases"
												className="data-[state=active]:bg-white"
											>
												Test Cases
											</TabsTrigger>
										</TabsList>

										{/* Control buttons group */}
										<div className="flex items-center gap-2">
											<button
												onClick={toggleTestCasesPanelFullscreen}
												className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-2 rounded-md transition-colors"
												title={
													isTestCasesPanelFullscreen
														? "Exit fullscreen"
														: "Fullscreen test cases"
												}
											>
												{isTestCasesPanelFullscreen ? (
													<Minimize2 className="h-4 w-4" />
												) : (
													<Maximize2 className="h-4 w-4" />
												)}
											</button>
											<button
												onClick={toggleTestCasesPanel}
												className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-2 rounded-md transition-colors"
												title={
													testCasesPanelCollapsed
														? "Expand test cases panel"
														: "Collapse test cases panel"
												}
											>
												{testCasesPanelCollapsed ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</button>
										</div>
									</div>

									{/* Show content only when not collapsed or when in fullscreen */}
									{(!testCasesPanelCollapsed || isTestCasesPanelFullscreen) && (
										<TabsContent
											value="testcases"
											className={`${
												isTestCasesPanelFullscreen ? "p-6" : "p-4"
											} overflow-auto h-full focus-visible:outline-none focus-visible:ring-0`}
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
																				testResults[testCase.id]?.success
																					? "text-emerald-700 border-emerald-300"
																					: testResults[testCase.id] &&
																					  !testResults[testCase.id]?.success
																					? "text-rose-700 border-rose-300"
																					: "border-transparent" // Added for neutral state
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
									)}
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
