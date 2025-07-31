"use client";

import { useEffect, useState } from "react";
import { parseFutureDate, parseOldDate } from "@/lib/time";
import { PrimaryButton } from "./LinkButton";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Lock, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { AdminContestActions } from "@/app/actions/AdminContestActions";

interface ContestCardParams {
	title: string;
	id: string;
	endTime: Date;
	startTime: Date;
	isAdmin?: boolean;
}

export function ContestCard({
	title,
	id,
	startTime,
	endTime,
	isAdmin = false,
}: ContestCardParams) {
	const [isLockedOut, setIsLockedOut] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const duration = `${
		(new Date(endTime).getTime() - new Date(startTime).getTime()) /
		(1000 * 60 * 60)
	} hours`;
	const isActive =
		startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

	// Check if user is locked out of this contest
	useEffect(() => {
		async function checkLockStatus() {
			try {
				console.log(`🔍 Checking lock status for contest ${id}`);

				const response = await fetch(
					`/api/contests/${id}/check-lock-status?t=${Date.now()}`,
					{
						cache: "no-store",
						headers: {
							"Cache-Control": "no-cache",
							Accept: "application/json",
						},
					}
				);

				console.log(`📡 Response status: ${response.status}`);
				console.log(
					`📡 Response headers:`,
					Object.fromEntries(response.headers.entries())
				);

				if (!response.ok) {
					const errorText = await response.text();
					console.error(`❌ HTTP ${response.status}:`, errorText);
					setError(`HTTP ${response.status}: ${errorText}`);
					setIsLockedOut(false);
					return;
				}

				const contentType = response.headers.get("content-type");
				console.log(`📄 Content-Type: ${contentType}`);

				if (!contentType || !contentType.includes("application/json")) {
					const responseText = await response.text();
					console.error(
						"❌ Non-JSON response:",
						responseText.substring(0, 200)
					);
					setError(`Expected JSON, got: ${contentType}`);
					setIsLockedOut(false);
					return;
				}

				const data = await response.json();
				console.log(`✅ Lock status data:`, data);

				setIsLockedOut(data.isLockedOut || false);
				setError(null);
			} catch (error) {
				console.error("💥 Error checking lock status:", error);
				setError(error instanceof Error ? error.message : "Unknown error");
				setIsLockedOut(false);
			} finally {
				setLoading(false);
			}
		}

		checkLockStatus();
	}, [id]);

	return (
		<Card className="relative">
			{isAdmin && <AdminContestActions contestId={id} />}

			<CardHeader>
				<div className="flex justify-between">
					<CardTitle>{title}</CardTitle>
					<div className="flex items-center gap-2">
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								{error && process.env.NODE_ENV === "development" && (
									<div
										className="text-xs text-red-500 max-w-32 truncate"
										title={error}
									>
										Error: {error}
									</div>
								)}

								{isAdmin && (
									<Link
										href={`/admin/contests/${id}/security`}
										className="text-gray-500 hover:text-primary"
									>
										<Shield className="h-5 w-5" />
									</Link>
								)}
								{isLockedOut && (
									<div className="flex items-center text-red-500">
										<Lock className="h-4 w-4 mr-1" />
										<span>Locked Out</span>
									</div>
								)}
								{isActive && !isLockedOut && (
									<div className="text-green-500">Active</div>
								)}
								{endTime.getTime() < Date.now() && (
									<div className="text-red-500">Ended</div>
								)}
							</>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-gray-500 dark:text-gray-400">
							{startTime.getTime() < Date.now() ? "Started" : "Starts in"}
						</p>
						<p>
							{startTime.getTime() < Date.now()
								? parseOldDate(new Date(startTime))
								: parseFutureDate(new Date(startTime))}
						</p>
					</div>
					<div>
						<p className="text-gray-500 dark:text-gray-400">Duration</p>
						<p>{duration}</p>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				{isLockedOut ? (
					<div className="px-4 py-2 bg-red-100 text-red-700 rounded-md flex items-center">
						<Lock className="h-4 w-4 mr-2" />
						Locked Out
					</div>
				) : (
					<PrimaryButton href={`/contest/${id}`}>
						{isActive ? "Participate" : "View Contest"}
					</PrimaryButton>
				)}

				{isAdmin && (
					<div className="flex gap-2">
						<Link
							href={`/admin/contests/${id}/edit`}
							className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
						>
							Edit
						</Link>
						<Link
							href={`/admin/contests/${id}/security`}
							className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md"
						>
							Security
						</Link>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}

// "use client";

// import { useEffect, useState } from "react";
// import { parseFutureDate, parseOldDate } from "@/lib/time";
// import { PrimaryButton } from "./LinkButton";
// import {
// 	Card,
// 	CardContent,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Lock, Shield } from "lucide-react";
// import Link from "next/link";

// interface ContestCardParams {
// 	title: string;
// 	id: string;
// 	endTime: Date;
// 	startTime: Date;
// 	isAdmin?: boolean;
// }

// export function ContestCard({
// 	title,
// 	id,
// 	startTime,
// 	endTime,
// 	isAdmin = false,
// }: ContestCardParams) {
// 	const [isLockedOut, setIsLockedOut] = useState(false);
// 	const [loading, setLoading] = useState(true);

// 	const duration = `${
// 		(new Date(endTime).getTime() - new Date(startTime).getTime()) /
// 		(1000 * 60 * 60)
// 	} hours`;
// 	const isActive =
// 		startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

// 	// Check if user is locked out of this contest
// 	useEffect(() => {
// 		async function checkLockStatus() {
// 			try {
// 				const response = await fetch(`/api/contests/${id}/check-lock-status`);
// 				if (response.ok) {
// 					const data = await response.json();
// 					setIsLockedOut(data.isLockedOut);
// 				}
// 			} catch (error) {
// 				console.error("Error checking lock status:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		}

// 		checkLockStatus();
// 	}, [id]);

// 	return (
// 		<Card className="relative">
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<CardTitle>{title}</CardTitle>
// 					<div className="flex items-center gap-2">
// 						{isAdmin && (
// 							<Link
// 								href={`/admin/contests/${id}/security`}
// 								className="text-gray-500 hover:text-primary"
// 							>
// 								<Shield className="h-5 w-5" />
// 							</Link>
// 						)}
// 						{isLockedOut && (
// 							<div className="flex items-center text-red-500">
// 								<Lock className="h-4 w-4 mr-1" />
// 								<span>Locked Out</span>
// 							</div>
// 						)}
// 						{isActive && !isLockedOut && (
// 							<div className="text-green-500">Active</div>
// 						)}
// 						{endTime.getTime() < Date.now() && (
// 							<div className="text-red-500">Ended</div>
// 						)}
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							{startTime.getTime() < Date.now() ? "Started" : "Starts in"}
// 						</p>
// 						<p>
// 							{startTime.getTime() < Date.now()
// 								? parseOldDate(new Date(startTime))
// 								: parseFutureDate(new Date(startTime))}
// 						</p>
// 					</div>
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">Duration</p>
// 						<p>{duration}</p>
// 					</div>
// 				</div>
// 			</CardContent>
// 			<CardFooter className="flex justify-between">
// 				{isLockedOut ? (
// 					<div className="px-4 py-2 bg-red-100 text-red-700 rounded-md flex items-center">
// 						<Lock className="h-4 w-4 mr-2" />
// 						Locked Out
// 					</div>
// 				) : (
// 					<PrimaryButton href={`/contest/${id}`}>
// 						{isActive ? "Participate" : "View Contest"}
// 					</PrimaryButton>
// 				)}

// 				{isAdmin && (
// 					<div className="flex gap-2">
// 						<Link
// 							href={`/admin/contests/${id}/edit`}
// 							className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
// 						>
// 							Edit
// 						</Link>
// 						<Link
// 							href={`/admin/contests/${id}/security`}
// 							className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md"
// 						>
// 							Security
// 						</Link>
// 					</div>
// 				)}
// 			</CardFooter>
// 		</Card>
// 	);
// }

// import { parseFutureDate, parseOldDate } from "@/lib/time";
// import { PrimaryButton } from "./LinkButton";
// import {
// 	Card,
// 	CardContent,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Shield } from "lucide-react";
// import Link from "next/link";

// interface ContestCardParams {
// 	title: string;
// 	id: string;
// 	endTime: Date;
// 	startTime: Date;
// 	isAdmin?: boolean;
// }

// export function ContestCard({
// 	title,
// 	id,
// 	startTime,
// 	endTime,
// 	isAdmin = false,
// }: ContestCardParams) {
// 	const duration = `${
// 		(new Date(endTime).getTime() - new Date(startTime).getTime()) /
// 		(1000 * 60 * 60)
// 	} hours`;
// 	const isActive =
// 		startTime.getTime() < Date.now() && endTime.getTime() > Date.now();

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<CardTitle>{title}</CardTitle>
// 					<div className="flex items-center gap-2">
// 						{isAdmin && (
// 							<Link
// 								href={`/admin/contests/${id}/security`}
// 								className="text-gray-500 hover:text-primary"
// 							>
// 								<Shield className="h-5 w-5" />
// 							</Link>
// 						)}
// 						{startTime.getTime() < Date.now() &&
// 						endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 						{isActive ? <div className="text-green-500">Active</div> : null}
// 						{endTime.getTime() < Date.now() ? (
// 							<div className="text-red-500">Ended</div>
// 						) : null}
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">
// 							{startTime.getTime() < Date.now() ? "Started" : "Starts in"}
// 						</p>
// 						<p>
// 							{startTime.getTime() < Date.now()
// 								? parseOldDate(new Date(startTime))
// 								: parseFutureDate(new Date(startTime))}
// 						</p>
// 					</div>
// 					<div>
// 						<p className="text-gray-500 dark:text-gray-400">Duration</p>
// 						<p>{duration}</p>
// 					</div>
// 				</div>
// 			</CardContent>
// 			<CardFooter className="flex justify-between">
// 				<PrimaryButton href={`/contest/${id}`}>
// 					{isActive ? "Participate" : "View Contest"}
// 				</PrimaryButton>
// 				{isAdmin && (
// 					<div className="flex gap-2">
// 						<Link
// 							href={`/admin/contests/${id}/edit`}
// 							className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
// 						>
// 							Edit
// 						</Link>
// 						<Link
// 							href={`/admin/contests/${id}/security`}
// 							className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md"
// 						>
// 							Security
// 						</Link>
// 					</div>
// 				)}
// 			</CardFooter>
// 		</Card>
// 	);
// }
