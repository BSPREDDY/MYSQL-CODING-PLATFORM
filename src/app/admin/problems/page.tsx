"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemTable } from "@/components/ProblemTable";
import { Search, Plus } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ProblemsPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [activeTab, setActiveTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Initialize state from URL params
	useEffect(() => {
		const tab = searchParams.get("tab") || "all";
		const query = searchParams.get("search") || "";

		setActiveTab(tab);
		setSearchQuery(query);
	}, [searchParams]);

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);

		// Update URL without full page refresh
		const params = new URLSearchParams(searchParams);
		params.set("tab", value);
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	// Handle search
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
		setSearchQuery(query);

		// Update URL without full page refresh
		const params = new URLSearchParams(searchParams);
		if (query) {
			params.set("search", query);
		} else {
			params.delete("search");
		}
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Problem Management
				</h1>
				<p className="text-muted-foreground">
					View and manage all SQL problems on your platform.
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="relative w-full max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search problems..."
						className="w-full bg-background pl-8 md:w-[300px]"
						value={searchQuery}
						onChange={handleSearch}
					/>
				</div>
				<Link href="/admin/create_problem">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Problem
					</Button>
				</Link>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="all">All Problems</TabsTrigger>
					<TabsTrigger value="easy">Easy</TabsTrigger>
					<TabsTrigger value="medium">Medium</TabsTrigger>
					<TabsTrigger value="hard">Hard</TabsTrigger>
					<TabsTrigger value="hidden">Hidden</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>All Problems</CardTitle>
							<CardDescription>
								Manage all SQL problems on your platform
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProblemTableSkeleton />}>
								<ProblemTable filter="all" search={searchQuery} />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="easy" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Easy Problems</CardTitle>
							<CardDescription>
								Manage easy difficulty SQL problems
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProblemTableSkeleton />}>
								<ProblemTable filter="easy" search={searchQuery} />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="medium" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Medium Problems</CardTitle>
							<CardDescription>
								Manage medium difficulty SQL problems
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProblemTableSkeleton />}>
								<ProblemTable filter="medium" search={searchQuery} />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="hard" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Hard Problems</CardTitle>
							<CardDescription>
								Manage hard difficulty SQL problems
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProblemTableSkeleton />}>
								<ProblemTable filter="hard" search={searchQuery} />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="hidden" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Hidden Problems</CardTitle>
							<CardDescription>
								Manage problems that are hidden from users
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<ProblemTableSkeleton />}>
								<ProblemTable filter="hidden" search={searchQuery} />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ProblemTableSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-8 w-full" />
			{Array(5)
				.fill(0)
				.map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
		</div>
	);
}
