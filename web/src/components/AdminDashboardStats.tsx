// "use server";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getUserStats } from "@/app/actions/admin";
// import { Users, ArrowUpRight } from "lucide-react";

// export async function AdminDashboardStats() {
// 	const statsResult = await getUserStats();

// 	if (!statsResult.success) {
// 		return <div className="text-destructive">Error loading statistics</div>;
// 	}

// 	const stats = statsResult.data;

// 	return (
// 		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Total Users</CardTitle>
// 					<Users className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{stats.totalUsers}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
// 						<span className="text-emerald-500">{stats.recentUsers}</span>
// 						<span className="ml-1">new in last 7 days</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Admin Users</CardTitle>
// 					<Users className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{stats.adminUsers}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						<span>
// 							{Math.round((stats.adminUsers / stats.totalUsers) * 100)}% of
// 							total users
// 						</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Regular Users</CardTitle>
// 					<Users className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{stats.regularUsers}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						<span>
// 							{Math.round((stats.regularUsers / stats.totalUsers) * 100)}% of
// 							total users
// 						</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">User Growth</CardTitle>
// 					<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">
// 						{stats.recentUsers > 0
// 							? `+${stats.recentUsers}`
// 							: stats.recentUsers}
// 					</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						<span>New users in the last 7 days</span>
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }


"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStats } from "@/app/actions/admin"
import { Users, ArrowUpRight, UserCheck, TrendingUp } from "lucide-react"

export async function AdminDashboardStats() {
  const statsResult = await getUserStats()

  if (!statsResult.success) {
    return <div className="text-destructive">Error loading statistics</div>
  }

  const stats = statsResult.data

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {stats.totalUsers}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">{stats.recentUsers}</span>
            <span className="ml-1">new in last 7 days</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
          <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2">
            <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            {stats.adminUsers}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <span>{Math.round((stats.adminUsers / stats.totalUsers) * 100)}% of total users</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
          <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {stats.regularUsers}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <span>{Math.round((stats.regularUsers / stats.totalUsers) * 100)}% of total users</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
            <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {stats.recentUsers > 0 ? `+${stats.recentUsers}` : stats.recentUsers}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <span>New users in the last 7 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
