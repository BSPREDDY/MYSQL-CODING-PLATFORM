"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserStats } from "@/app/actions/admin";
import { Users, ArrowUpRight } from "lucide-react";

export async function AdminDashboardStats() {
	const statsResult = await getUserStats();

	if (!statsResult.success) {
		return <div className="text-destructive">Error loading statistics</div>;
	}

	const stats = statsResult.data;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalUsers}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
						<span className="text-emerald-500">{stats.recentUsers}</span>
						<span className="ml-1">new in last 7 days</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Admin Users</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.adminUsers}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						<span>
							{Math.round((stats.adminUsers / stats.totalUsers) * 100)}% of
							total users
						</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Regular Users</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.regularUsers}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						<span>
							{Math.round((stats.regularUsers / stats.totalUsers) * 100)}% of
							total users
						</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">User Growth</CardTitle>
					<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats.recentUsers > 0
							? `+${stats.recentUsers}`
							: stats.recentUsers}
					</div>
					<div className="flex items-center text-xs text-muted-foreground">
						<span>New users in the last 7 days</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
