"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Maximize, Lock } from "lucide-react";
import {
	lockUserOutOfContest,
	checkContestLockStatus,
} from "@/app/actions/contest-security";
import { useToast } from "@/hooks/use-toast";

interface FullScreenContestWrapperProps {
	contestId: string;
	children: React.ReactNode;
}

export function FullScreenContestWrapper({
	contestId,
	children,
}: FullScreenContestWrapperProps) {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isLockedOut, setIsLockedOut] = useState(false);
	const [fullScreenRequired, setFullScreenRequired] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [isCheckingStatus, setIsCheckingStatus] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { toast } = useToast();

	// Check if user is locked out
	useEffect(() => {
		const checkLockStatus = async () => {
			setIsCheckingStatus(true);
			try {
				const result = await checkContestLockStatus(contestId);
				if (result.success) {
					setIsLockedOut(result.isLockedOut);
					setFullScreenRequired(result.fullScreenRequired);
				} else {
					toast({
						title: "Error",
						description:
							result.error || "Failed to check contest access status",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Error checking lock status:", error);
			} finally {
				setIsCheckingStatus(false);
				setIsLoading(false);
			}
		};

		checkLockStatus();
	}, [contestId, toast]);

	// Handle full screen change
	useEffect(() => {
		const handleFullScreenChange = async () => {
			const isDocFullScreen =
				document.fullscreenElement ||
				(document as any).webkitFullscreenElement ||
				(document as any).mozFullScreenElement ||
				(document as any).msFullscreenElement;

			setIsFullScreen(!!isDocFullScreen);

			// If exiting full screen and full screen is required, lock the user out
			if (!isDocFullScreen && fullScreenRequired && !isLockedOut) {
				await lockUserOutOfContest(contestId, "User exited full screen mode");
				setIsLockedOut(true);
				toast({
					title: "Contest Access Revoked",
					description:
						"You have exited full screen mode. Please contact an administrator to regain access.",
					variant: "destructive",
				});
			}
		};

		// Handle tab visibility change
		const handleVisibilityChange = async () => {
			if (
				document.visibilityState === "hidden" &&
				fullScreenRequired &&
				!isLockedOut
			) {
				await lockUserOutOfContest(
					contestId,
					"User changed tabs or minimized window"
				);
				setIsLockedOut(true);
				toast({
					title: "Contest Access Revoked",
					description:
						"You changed tabs or minimized the window. Please contact an administrator to regain access.",
					variant: "destructive",
				});
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
	}, [contestId, fullScreenRequired, isLockedOut, toast]);

	// Enter full screen mode
	const enterFullScreen = async () => {
		try {
			if (containerRef.current) {
				if (containerRef.current.requestFullscreen) {
					await containerRef.current.requestFullscreen();
				} else if ((containerRef.current as any).webkitRequestFullscreen) {
					await (containerRef.current as any).webkitRequestFullscreen();
				} else if ((containerRef.current as any).mozRequestFullScreen) {
					await (containerRef.current as any).mozRequestFullScreen();
				} else if ((containerRef.current as any).msRequestFullscreen) {
					await (containerRef.current as any).msRequestFullscreen();
				}
			}
		} catch (error) {
			console.error("Error entering full screen:", error);
			toast({
				title: "Error",
				description:
					"Failed to enter full screen mode. Please try again or use a different browser.",
				variant: "destructive",
			});
		}
	};

	// Exit contest
	const exitContest = () => {
		router.push("/contests");
	};

	if (isLoading || isCheckingStatus) {
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
					<div className="flex flex-col gap-2">
						<Button onClick={enterFullScreen} className="w-full">
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
		<div ref={containerRef} className="min-h-screen">
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
