"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Maximize, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContestFullScreenWrapperProps {
	contestId: string;
	isActive: boolean;
	children: React.ReactNode;
}

export function FullScreenContestWrapper({
	contestId,
	isActive,
	children,
}: ContestFullScreenWrapperProps) {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isLockedOut, setIsLockedOut] = useState(false);
	const [fullScreenRequired, setFullScreenRequired] = useState(isActive);
	const [isLoading, setIsLoading] = useState(true);
	const [fullScreenError, setFullScreenError] = useState<string | null>(null);
	const router = useRouter();
	const { toast } = useToast();

	// Check if browser supports fullscreen
	const fullScreenSupported =
		typeof document !== "undefined" &&
		(document.documentElement.requestFullscreen ||
			(document.documentElement as any).webkitRequestFullscreen ||
			(document.documentElement as any).mozRequestFullScreen ||
			(document.documentElement as any).msRequestFullscreen);

	// Check if we're already in full-screen mode when component mounts
	useEffect(() => {
		const checkFullScreenStatus = () => {
			// Check localStorage first
			const storedFullScreenState = localStorage.getItem(
				`contest-${contestId}-fullscreen`
			);
			const storedLockoutState = localStorage.getItem(
				`contest-${contestId}-lockout`
			);

			const isDocFullScreen =
				document.fullscreenElement ||
				(document as any).webkitFullscreenElement ||
				(document as any).mozFullScreenElement ||
				(document as any).msFullscreenElement;

			// Update state based on either document full-screen or localStorage
			setIsFullScreen(!!isDocFullScreen || storedFullScreenState === "true");
			setIsLockedOut(storedLockoutState === "true");
			setIsLoading(false);
		};

		// Check if user is locked out from the server
		const checkLockStatus = async () => {
			try {
				const response = await fetch(
					`/api/contests/${contestId}/check-lock-status`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Cache-Control": "no-cache",
						},
					}
				);

				if (!response.ok) {
					console.error(
						`Lock status check failed: ${response.status} ${response.statusText}`
					);
					return;
				}

				const contentType = response.headers.get("content-type");
				if (!contentType || !contentType.includes("application/json")) {
					console.error("Lock status response is not JSON");
					return;
				}

				const data = await response.json();
				if (data.isLockedOut) {
					setIsLockedOut(true);
					localStorage.setItem(`contest-${contestId}-lockout`, "true");
				}
			} catch (error) {
				console.error("Error checking lock status:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkFullScreenStatus();
		if (isActive) {
			checkLockStatus();
		}
	}, [contestId, isActive]);

	// Handle full screen change
	useEffect(() => {
		const handleFullScreenChange = async () => {
			const isDocFullScreen =
				document.fullscreenElement ||
				(document as any).webkitFullscreenElement ||
				(document as any).mozFullScreenElement ||
				(document as any).msFullscreenElement;

			setIsFullScreen(!!isDocFullScreen);
			localStorage.setItem(
				`contest-${contestId}-fullscreen`,
				isDocFullScreen ? "true" : "false"
			);

			// If exiting full screen and full screen is required, lock the user out
			if (
				!isDocFullScreen &&
				fullScreenRequired &&
				isFullScreen &&
				!isLockedOut
			) {
				try {
					console.log("Locking user out due to exiting full screen");
					const response = await fetch(
						`/api/contests/${contestId}/lockout-user`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								reason: "User exited full screen mode",
							}),
						}
					);

					if (response.ok) {
						const contentType = response.headers.get("content-type");
						if (contentType && contentType.includes("application/json")) {
							const result = await response.json();
							setIsLockedOut(true);
							localStorage.setItem(`contest-${contestId}-lockout`, "true");
							toast({
								title: "Contest Access Revoked",
								description:
									"You have exited full screen mode. Please contact an administrator to regain access.",
								variant: "destructive",
							});
						}
					} else {
						console.error(
							"Failed to lock user out:",
							response.status,
							response.statusText
						);
					}
				} catch (error) {
					console.error("Error locking user out:", error);
				}
			}
		};

		// Handle tab visibility change
		const handleVisibilityChange = async () => {
			if (
				document.visibilityState === "hidden" &&
				fullScreenRequired &&
				isFullScreen &&
				!isLockedOut
			) {
				try {
					console.log("Locking user out due to changing tabs");
					const response = await fetch(
						`/api/contests/${contestId}/lockout-user`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								reason: "User changed tabs or minimized window",
							}),
						}
					);

					if (response.ok) {
						const contentType = response.headers.get("content-type");
						if (contentType && contentType.includes("application/json")) {
							const result = await response.json();
							setIsLockedOut(true);
							localStorage.setItem(`contest-${contestId}-lockout`, "true");
							toast({
								title: "Contest Access Revoked",
								description:
									"You changed tabs or minimized the window. Please contact an administrator to regain access.",
								variant: "destructive",
							});
						}
					} else {
						console.error(
							"Failed to lock user out:",
							response.status,
							response.statusText
						);
					}
				} catch (error) {
					console.error("Error locking user out:", error);
				}
			}
		};

		document.addEventListener("fullscreenchange", handleFullScreenChange);
		document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
		document.addEventListener("mozfullscreenchange", handleFullScreenChange);
		document.addEventListener("MSFullscreenChange", handleFullScreenChange);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullScreenChange);
			document.removeEventListener(
				"webkitfullscreenchange",
				handleFullScreenChange
			);
			document.removeEventListener(
				"mozfullscreenchange",
				handleFullScreenChange
			);
			document.removeEventListener(
				"MSFullscreenChange",
				handleFullScreenChange
			);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [contestId, fullScreenRequired, isFullScreen, isLockedOut, toast]);

	// Enter full screen mode
	const enterFullScreen = () => {
		try {
			setFullScreenError(null);

			if (!document.documentElement) {
				throw new Error("Document element not found");
			}

			const element = document.documentElement;

			// Try different fullscreen methods
			const requestFullScreen = async () => {
				try {
					if (element.requestFullscreen) {
						await element.requestFullscreen();
					} else if ((element as any).webkitRequestFullscreen) {
						await (element as any).webkitRequestFullscreen();
					} else if ((element as any).mozRequestFullScreen) {
						await (element as any).mozRequestFullScreen();
					} else if ((element as any).msRequestFullscreen) {
						await (element as any).msRequestFullscreen();
					} else {
						throw new Error("Fullscreen API not supported");
					}

					// Update state and localStorage
					setIsFullScreen(true);
					localStorage.setItem(`contest-${contestId}-fullscreen`, "true");
				} catch (error) {
					console.error("Error requesting fullscreen:", error);
					throw error;
				}
			};

			// Execute with a small delay to ensure the element is ready
			setTimeout(() => {
				requestFullScreen().catch((error) => {
					console.error("Failed to enter fullscreen:", error);
					setFullScreenError(
						"Failed to enter fullscreen mode. Please try a different browser."
					);
					toast({
						title: "Fullscreen Error",
						description:
							"Failed to enter fullscreen mode. Please try a different browser.",
						variant: "destructive",
					});
				});
			}, 100);
		} catch (error) {
			console.error("Error setting up fullscreen:", error);
			setFullScreenError(
				"Failed to set up fullscreen mode. Please try a different browser."
			);
			toast({
				title: "Fullscreen Error",
				description:
					"Failed to set up fullscreen mode. Please try a different browser.",
				variant: "destructive",
			});
		}
	};

	// Exit contest
	const exitContest = () => {
		router.push("/user/contests");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	// If full screen is not required, render children directly
	if (!fullScreenRequired) {
		return <>{children}</>;
	}

	// If user is locked out, show locked out screen
	if (isLockedOut) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
				<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
					<div className="flex justify-center mb-4">
						<Lock className="h-16 w-16 text-red-500" />
					</div>
					<h1 className="text-2xl font-bold text-red-600 mb-2">
						Contest Access Revoked
					</h1>
					<p className="text-gray-600 mb-6">
						You have been locked out of this contest because you exited full
						screen mode or changed tabs. Please contact an administrator to
						regain access.
					</p>
					<Button onClick={exitContest} className="w-full">
						Return to Contests
					</Button>
				</div>
			</div>
		);
	}

	// If not in full screen, show full screen prompt
	if (!isFullScreen) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
				<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
					<div className="flex justify-center mb-4">
						<Maximize className="h-16 w-16 text-blue-500" />
					</div>
					<h1 className="text-2xl font-bold mb-2">Full Screen Required</h1>
					<p className="text-gray-600 mb-6">
						This contest requires full screen mode. Please click the button
						below to enter full screen mode.
						<span className="block mt-2 text-red-500 font-medium">
							Warning: Exiting full screen or changing tabs will lock you out of
							the contest!
						</span>
					</p>

					{fullScreenError && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
							{fullScreenError}
						</div>
					)}

					{!fullScreenSupported && (
						<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm">
							Your browser may not support fullscreen mode. Please try using
							Chrome, Firefox, or Edge.
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Button
							onClick={enterFullScreen}
							className="w-full"
							disabled={!fullScreenSupported}
						>
							Enter Full Screen
						</Button>
						<Button onClick={exitContest} variant="outline" className="w-full">
							Cancel
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// In full screen mode, render children
	return (
		<div className="min-h-screen">
			<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<AlertCircle className="h-5 w-5 text-yellow-400" />
					</div>
					<div className="ml-3">
						<p className="text-sm text-yellow-700">
							<strong>Warning:</strong> Exiting full screen mode or changing
							tabs will lock you out of this contest.
						</p>
					</div>
				</div>
			</div>
			{children}
		</div>
	);
}
