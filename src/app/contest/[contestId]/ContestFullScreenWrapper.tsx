"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Maximize, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isInFullScreen, requestFullScreen } from "@/lib/fullscreen-utils";

// Define a type for our global state
interface ContestFullScreenState {
	[contestId: string]: {
		isInFullScreen: boolean;
		isLockedOut: boolean;
	};
}

//global state initialization to  handle undefined window
if (typeof window !== "undefined") {
	//  global state
	(window as any).__contestFullScreenState =
		(window as any).__contestFullScreenState || ({} as ContestFullScreenState);
}

interface ContestFullScreenWrapperProps {
	contestId: string;
	isActive: boolean;
	children: React.ReactNode;
	isAdmin?: boolean;
}

export function ContestFullScreenWrapper({
	contestId,
	isActive,
	children,
	isAdmin = false,
}: ContestFullScreenWrapperProps) {
	const router = useRouter();
	const { toast } = useToast();
	const fullScreenRef = useRef<HTMLDivElement>(null);

	// Fix the getGlobalState function to properly initialize state
	const getGlobalState = useCallback(() => {
		if (typeof window === "undefined")
			return { isInFullScreen: false, isLockedOut: false };

		// Initialize global state if it doesn't exist
		if (!(window as any).__contestFullScreenState) {
			(window as any).__contestFullScreenState = {};
		}

		// Initialize contest-specific state if it doesn't exist
		if (!(window as any).__contestFullScreenState[contestId]) {
			(window as any).__contestFullScreenState[contestId] = {
				isInFullScreen: false,
				isLockedOut: false,
			};
		}

		return (window as any).__contestFullScreenState[contestId];
	}, [contestId]);

	// Initialize state from global state
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isLockedOut, setIsLockedOut] = useState(false);
	const [fullScreenRequired, setFullScreenRequired] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [fullScreenError, setFullScreenError] = useState<string | null>(null);
	const [securityChecked, setSecurityChecked] = useState(false);
	const [showExitDialog, setShowExitDialog] = useState(false);

	// Check if browser supports fullscreen
	const fullScreenSupported =
		typeof document !== "undefined" &&
		(document.documentElement.requestFullscreen ||
			(document.documentElement as any).webkitRequestFullscreen ||
			(document.documentElement as any).mozRequestFullScreen ||
			(document.documentElement as any).msRequestFullscreen);

	// lockUserOut function for immediate response
	const lockUserOut = useCallback(
		async (reason: string) => {
			// Don't lock out admins if they're exempt
			if (isAdmin) {
				console.log("Admin is exempt from lockout");
				return;
			}

			if (isLockedOut || isLoading || !securityChecked || !fullScreenRequired) {
				return;
			}

			try {
				console.log(`Locking user out: ${reason}`);

				// Immediately update UI state
				setIsLockedOut(true);

				// Update global state
				const globalState = getGlobalState();
				globalState.isLockedOut = true;

				// Show toast notification
				toast({
					title: "Contest Access Revoked",
					description: `${reason}. Please contact an administrator to regain access.`,
					variant: "destructive",
				});

				// Send request to server in background
				fetch(`/api/contests/${contestId}/lock-user`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ reason }),
				}).catch((error) => {
					console.error("Error sending lock request to server:", error);
				});
			} catch (error) {
				console.error("Error locking user out:", error);
			}
		},
		[
			contestId,
			fullScreenRequired,
			getGlobalState,
			isAdmin,
			isLoading,
			isLockedOut,
			securityChecked,
			toast,
		]
	);

	// security check and polling for lock status
	useEffect(() => {
		const globalState = getGlobalState();
		setIsFullScreen(globalState.isInFullScreen || isInFullScreen());
		setIsLockedOut(globalState.isLockedOut);

		// Check contest security settings and lock status
		const checkSecuritySettings = async () => {
			try {
				const response = await fetch(
					`/api/contests/${contestId}/security-status`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						cache: "no-store",
					}
				);

				if (response.ok) {
					const data = await response.json();
					setFullScreenRequired(data.fullScreenRequired);

					if (data.isLockedOut) {
						setIsLockedOut(true);
						const globalState = getGlobalState();
						globalState.isLockedOut = true;
					}
				}
			} catch (error) {
				console.error("Error checking security settings:", error);
			} finally {
				setIsLoading(false);
				setSecurityChecked(true);
			}
		};

		checkSecuritySettings();

		// Poll for lock status changes more frequently (every 2 seconds)
		const intervalId = setInterval(async () => {
			try {
				const response = await fetch(
					`/api/contests/${contestId}/check-lock-status?t=${Date.now()}`,
					{
						cache: "no-store",
						headers: { "Cache-Control": "no-cache" },
					}
				);

				if (response.ok) {
					const data = await response.json();

					// If lock status changed, update state
					if (data.isLockedOut !== isLockedOut) {
						console.log(
							`Lock status changed: ${isLockedOut} -> ${data.isLockedOut}`
						);
						setIsLockedOut(data.isLockedOut);

						// Update global state
						const globalState = getGlobalState();
						globalState.isLockedOut = data.isLockedOut;

						// If user was granted re-entry, show toast
						if (!data.isLockedOut && isLockedOut) {
							toast({
								title: "Re-entry Granted",
								description:
									"An administrator has granted you re-entry to the contest.",
							});

							// If we're not in fullscreen but need to be, prompt user
							if (!isInFullScreen() && fullScreenRequired) {
								setIsFullScreen(false);
							}
						}
					}
				}
			} catch (error) {
				console.error("Error polling lock status:", error);
			}
		}, 2000); // Poll every 2 seconds

		return () => clearInterval(intervalId);
	}, [contestId, getGlobalState, isLockedOut, toast, fullScreenRequired]);

	useEffect(() => {
		if (!securityChecked) return;

		const handleFullScreenChange = () => {
			const currentlyInFullScreen = isInFullScreen();
			console.log(
				`Fullscreen changed: ${isFullScreen} -> ${currentlyInFullScreen}`
			);

			// Update state and global state
			setIsFullScreen(currentlyInFullScreen);
			const globalState = getGlobalState();
			globalState.isInFullScreen = currentlyInFullScreen;

			// If exiting full screen and full screen is required, lock out immediately
			if (
				!currentlyInFullScreen &&
				fullScreenRequired &&
				!isLockedOut &&
				!isLoading
			) {
				console.log("User exited full screen - locking out immediately");
				lockUserOut("You have exited full screen mode");

				setShowExitDialog(false);
			}
		};

		// Handle tab visibility change
		const handleVisibilityChange = () => {
			if (
				document.visibilityState === "hidden" &&
				fullScreenRequired &&
				!isLockedOut &&
				!isAdmin
			) {
				console.log("Tab visibility changed to hidden");
				lockUserOut("You changed tabs or minimized the window");
			}
		};

		// Handle window/workspace changes
		const handleWindowBlur = () => {
			if (fullScreenRequired && isFullScreen && !isLockedOut && !isAdmin) {
				console.log("Window lost focus - possible workspace/window change");
				lockUserOut("You switched to another window or workspace");
			}
		};

		// Add event listeners
		document.addEventListener("fullscreenchange", handleFullScreenChange);
		document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
		document.addEventListener("mozfullscreenchange", handleFullScreenChange);
		document.addEventListener("MSFullscreenChange", handleFullScreenChange);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		// Add window blur event listener
		window.addEventListener("blur", handleWindowBlur);

		return () => {
			// Remove event listeners on cleanup
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
			// And in the cleanup function:
			window.removeEventListener("blur", handleWindowBlur);
		};
	}, [
		contestId,
		fullScreenRequired,
		isFullScreen,
		isLockedOut,
		isLoading,
		securityChecked,
		getGlobalState,
		lockUserOut,
		isAdmin,
	]);

	// Enter full screen mode
	const enterFullScreen = async () => {
		try {
			setFullScreenError(null);

			if (!document.documentElement) {
				throw new Error("Document element not found");
			}

			await requestFullScreen(document.documentElement);

			// Update state and global state
			setIsFullScreen(true);
			const globalState = getGlobalState();
			globalState.isInFullScreen = true;
		} catch (error) {
			console.error("Error entering fullscreen:", error);
			const errorMessage =
				"Failed to enter fullscreen mode. Please try a different browser.";
			setFullScreenError(errorMessage);
			toast({
				title: "Fullscreen Error",
				description: errorMessage,
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

	// In full screen mode, render children with warning banner
	return (
		<div className="min-h-screen" ref={fullScreenRef}>
			<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 sticky top-0 z-50">
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
