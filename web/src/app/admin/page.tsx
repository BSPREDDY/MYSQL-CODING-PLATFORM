// export default function Admin() {
// 	return (
// 		<div className="max-w-4xl mx-auto p-6 space-y-6">
// 			<div className="space-y-4">
// 				<h1 className="text-4xl">Admin Dashboard</h1>
// 			</div>
// 		</div>
// 	);
// }
// import { Suspense } from "react";
// import Link from "next/link";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
// 	BarChart3,
// 	Users,
// 	Trophy,
// 	ArrowRight,
// 	ArrowUpRight,
// 	Clock,
// 	UserPlus,
// 	CalendarClock,
// } from "lucide-react";
// import { getUserStats } from "@/app/actions/admin";
// import { getContests } from "@/app/actions/contest";
// import { AdminDashboardStats } from "@/components/AdminDashboardStats";
// import { RecentUsersTable } from "@/components/RecentUsersTable";
// import { RecentSubmissionsTable } from "@/components/RecentSubmissionsTable";

// export default async function AdminDashboard() {
// 	return (
// 		<div className="space-y-8">
// 			<div className="flex flex-col space-y-2">
// 				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
// 				<p className="text-muted-foreground">
// 					Welcome to your SQL Contest admin dashboard. Monitor and manage your
// 					platform from here.
// 				</p>
// 			</div>

// 			<Suspense fallback={<StatsCardSkeleton />}>
// 				<AdminDashboardStats />
// 			</Suspense>

// 			<Tabs defaultValue="overview" className="space-y-4">
// 				<TabsList>
// 					<TabsTrigger value="overview">Overview</TabsTrigger>
// 					<TabsTrigger value="users">Users</TabsTrigger>
// 					<TabsTrigger value="contests">Contests</TabsTrigger>
// 					<TabsTrigger value="submissions">Submissions</TabsTrigger>
// 				</TabsList>

// 				<TabsContent value="overview" className="space-y-4">
// 					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// 						<Card>
// 							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 								<CardTitle className="text-sm font-medium">
// 									Active Contests
// 								</CardTitle>
// 								<Trophy className="h-4 w-4 text-muted-foreground" />
// 							</CardHeader>
// 							<CardContent>
// 								<Suspense fallback={<Skeleton className="h-7 w-20" />}>
// 									<ActiveContestsCard />
// 								</Suspense>
// 							</CardContent>
// 							<CardFooter>
// 								<Link href="/admin/contests" className="w-full">
// 									<Button variant="outline" className="w-full">
// 										<span>View all contests</span>
// 										<ArrowRight className="ml-2 h-4 w-4" />
// 									</Button>
// 								</Link>
// 							</CardFooter>
// 						</Card>

// 						<Card>
// 							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 								<CardTitle className="text-sm font-medium">
// 									Recent Signups
// 								</CardTitle>
// 								<UserPlus className="h-4 w-4 text-muted-foreground" />
// 							</CardHeader>
// 							<CardContent>
// 								<Suspense fallback={<Skeleton className="h-7 w-20" />}>
// 									<RecentSignupsCard />
// 								</Suspense>
// 							</CardContent>
// 							<CardFooter>
// 								<Link href="/admin/users" className="w-full">
// 									<Button variant="outline" className="w-full">
// 										<span>View all users</span>
// 										<ArrowRight className="ml-2 h-4 w-4" />
// 									</Button>
// 								</Link>
// 							</CardFooter>
// 						</Card>

// 						<Card>
// 							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 								<CardTitle className="text-sm font-medium">
// 									Upcoming Contests
// 								</CardTitle>
// 								<CalendarClock className="h-4 w-4 text-muted-foreground" />
// 							</CardHeader>
// 							<CardContent>
// 								<Suspense fallback={<Skeleton className="h-7 w-20" />}>
// 									<UpcomingContestsCard />
// 								</Suspense>
// 							</CardContent>
// 							<CardFooter>
// 								<Link href="/admin/contests/create" className="w-full">
// 									<Button variant="outline" className="w-full">
// 										<span>Create new contest</span>
// 										<ArrowRight className="ml-2 h-4 w-4" />
// 									</Button>
// 								</Link>
// 							</CardFooter>
// 						</Card>
// 					</div>

// 					<div className="grid gap-4 md:grid-cols-2">
// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>Recent Users</CardTitle>
// 								<CardDescription>
// 									Latest users who joined the platform
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<Suspense fallback={<TableSkeleton />}>
// 									<RecentUsersTable />
// 								</Suspense>
// 							</CardContent>
// 							<CardFooter>
// 								<Link href="/admin/users" className="w-full">
// 									<Button variant="outline" className="w-full">
// 										View all users
// 									</Button>
// 								</Link>
// 							</CardFooter>
// 						</Card>

// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>Recent Submissions</CardTitle>
// 								<CardDescription>
// 									Latest problem submissions from users
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<Suspense fallback={<TableSkeleton />}>
// 									<RecentSubmissionsTable />
// 								</Suspense>
// 							</CardContent>
// 							<CardFooter>
// 								<Link href="/admin/submissions" className="w-full">
// 									<Button variant="outline" className="w-full">
// 										View all submissions
// 									</Button>
// 								</Link>
// 							</CardFooter>
// 						</Card>
// 					</div>
// 				</TabsContent>

// 				<TabsContent value="users" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>User Management</CardTitle>
// 							<CardDescription>
// 								View and manage all users on your platform
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="space-y-4">
// 							<div className="grid gap-4 md:grid-cols-3">
// 								<Link href="/admin/users">
// 									<Card className="hover:bg-muted/50 transition-colors">
// 										<CardHeader className="pb-2">
// 											<CardTitle className="text-sm">All Users</CardTitle>
// 										</CardHeader>
// 										<CardContent className="pb-2">
// 											<div className="flex items-center justify-between">
// 												<Users className="h-8 w-8 text-primary/80" />
// 												<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 											</div>
// 										</CardContent>
// 									</Card>
// 								</Link>

// 								<Link href="/admin/users/create">
// 									<Card className="hover:bg-muted/50 transition-colors">
// 										<CardHeader className="pb-2">
// 											<CardTitle className="text-sm">Create User</CardTitle>
// 										</CardHeader>
// 										<CardContent className="pb-2">
// 											<div className="flex items-center justify-between">
// 												<UserPlus className="h-8 w-8 text-primary/80" />
// 												<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 											</div>
// 										</CardContent>
// 									</Card>
// 								</Link>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>

// 				<TabsContent value="contests" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Contest Management</CardTitle>
// 							<CardDescription>
// 								Create and manage SQL coding contests
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="space-y-4">
// 							<div className="grid gap-4 md:grid-cols-3">
// 								<Link href="/admin/contests">
// 									<Card className="hover:bg-muted/50 transition-colors">
// 										<CardHeader className="pb-2">
// 											<CardTitle className="text-sm">All Contests</CardTitle>
// 										</CardHeader>
// 										<CardContent className="pb-2">
// 											<div className="flex items-center justify-between">
// 												<Trophy className="h-8 w-8 text-primary/80" />
// 												<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 											</div>
// 										</CardContent>
// 									</Card>
// 								</Link>

// 								<Link href="/admin/contests/create">
// 									<Card className="hover:bg-muted/50 transition-colors">
// 										<CardHeader className="pb-2">
// 											<CardTitle className="text-sm">Create Contest</CardTitle>
// 										</CardHeader>
// 										<CardContent className="pb-2">
// 											<div className="flex items-center justify-between">
// 												<Trophy className="h-8 w-8 text-primary/80" />
// 												<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 											</div>
// 										</CardContent>
// 									</Card>
// 								</Link>

// 								<Link href="/admin/standings">
// 									<Card className="hover:bg-muted/50 transition-colors">
// 										<CardHeader className="pb-2">
// 											<CardTitle className="text-sm">Standings</CardTitle>
// 										</CardHeader>
// 										<CardContent className="pb-2">
// 											<div className="flex items-center justify-between">
// 												<BarChart3 className="h-8 w-8 text-primary/80" />
// 												<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
// 											</div>
// 										</CardContent>
// 									</Card>
// 								</Link>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>

// 				<TabsContent value="submissions" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Submission Management</CardTitle>
// 							<CardDescription>
// 								View and analyze user submissions
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent>
// 							<Suspense fallback={<TableSkeleton />}>
// 								<RecentSubmissionsTable limit={10} />
// 							</Suspense>
// 						</CardContent>
// 						<CardFooter>
// 							<Link href="/admin/submissions" className="w-full">
// 								<Button variant="outline" className="w-full">
// 									View all submissions
// 								</Button>
// 							</Link>
// 						</CardFooter>
// 					</Card>
// 				</TabsContent>
// 			</Tabs>
// 		</div>
// 	);
// }

// async function ActiveContestsCard() {
// 	const contestsResult = await getContests();
// 	const now = new Date();

// 	if (!contestsResult.success) {
// 		return <div className="text-destructive">Error loading contests</div>;
// 	}

// 	const activeContests =
// 		contestsResult.data?.filter(
// 			(contest) =>
// 				new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
// 		) || [];

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<div className="text-2xl font-bold">{activeContests.length}</div>
// 			<div className="flex items-center text-sm text-muted-foreground">
// 				<Clock className="mr-1 h-4 w-4" />
// 				<span>Currently running</span>
// 			</div>
// 		</div>
// 	);
// }

// async function RecentSignupsCard() {
// 	const stats = await getUserStats();

// 	if (!stats.success) {
// 		return <div className="text-destructive">Error loading stats</div>;
// 	}

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<div className="text-2xl font-bold">{stats.data?.recentUsers || 0}</div>
// 			<div className="flex items-center text-sm text-muted-foreground">
// 				<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
// 				<span>Last 7 days</span>
// 			</div>
// 		</div>
// 	);
// }

// async function UpcomingContestsCard() {
// 	const contestsResult = await getContests();
// 	const now = new Date();

// 	if (!contestsResult.success) {
// 		return <div className="text-destructive">Error loading contests</div>;
// 	}

// 	const upcomingContests =
// 		contestsResult.data?.filter(
// 			(contest) => new Date(contest.startTime) > now
// 		) || [];

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<div className="text-2xl font-bold">{upcomingContests.length}</div>
// 			<div className="flex items-center text-sm text-muted-foreground">
// 				<CalendarClock className="mr-1 h-4 w-4" />
// 				<span>Scheduled contests</span>
// 			</div>
// 		</div>
// 	);
// }

// function StatsCardSkeleton() {
// 	return (
// 		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// 			{Array(4)
// 				.fill(0)
// 				.map((_, i) => (
// 					<Card key={i}>
// 						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 							<Skeleton className="h-5 w-20" />
// 							<Skeleton className="h-4 w-4 rounded-full" />
// 						</CardHeader>
// 						<CardContent>
// 							<Skeleton className="h-7 w-20 mb-2" />
// 							<Skeleton className="h-4 w-28" />
// 						</CardContent>
// 					</Card>
// 				))}
// 		</div>
// 	);
// }

// function TableSkeleton() {
// 	return (
// 		<div className="space-y-3">
// 			<Skeleton className="h-8 w-full" />
// 			{Array(5)
// 				.fill(0)
// 				.map((_, i) => (
// 					<Skeleton key={i} className="h-12 w-full" />
// 				))}
// 		</div>
// 	);
// }



import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  Users,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  Clock,
  UserPlus,
  CalendarClock,
  Activity,
  TrendingUp,
} from "lucide-react"
import { getUserStats } from "@/app/actions/admin"
import { getContests } from "@/app/actions/contest"
import { AdminDashboardStats } from "@/components/AdminDashboardStats"
import { RecentUsersTable } from "@/components/RecentUsersTable"
import { RecentSubmissionsTable } from "@/components/RecentSubmissionsTable"

export default async function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your SQL Contest admin dashboard. Monitor and manage your platform from here.
        </p>
      </div>

      <Suspense fallback={<StatsCardSkeleton />}>
        <AdminDashboardStats />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-md rounded-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="contests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg"
          >
            Contests
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg"
          >
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-sm font-medium">Active Contests</CardTitle>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                  <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={<Skeleton className="h-7 w-20" />}>
                  <ActiveContestsCard />
                </Suspense>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                <Link href="/admin/contests" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <span>View all contests</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
                <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                  <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={<Skeleton className="h-7 w-20" />}>
                  <RecentSignupsCard />
                </Suspense>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                <Link href="/admin/users" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                  >
                    <span>View all users</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                <CardTitle className="text-sm font-medium">Upcoming Contests</CardTitle>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2">
                  <CalendarClock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={<Skeleton className="h-7 w-20" />}>
                  <UpcomingContestsCard />
                </Suspense>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                <Link href="/admin/contests/create" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                  >
                    <span>Create new contest</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
                <CardDescription>Latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<TableSkeleton />}>
                  <div className="p-6">
                    <RecentUsersTable />
                  </div>
                </Suspense>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                <Link href="/admin/users" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    View all users
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="col-span-1 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
                <CardDescription>Latest problem submissions from users</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<TableSkeleton />}>
                  <div className="p-6">
                    <RecentSubmissionsTable />
                  </div>
                </Suspense>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
                <Link href="/admin/submissions" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                  >
                    View all submissions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-lg font-semibold">User Management</CardTitle>
              <CardDescription>View and manage all users on your platform</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Link href="/admin/users">
                  <Card className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                      <CardTitle className="text-sm">All Users</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/users/create">
                  <Card className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardTitle className="text-sm">Create User</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                          <UserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-green-500 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/performance">
                  <Card className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10">
                      <CardTitle className="text-sm">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                          <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contests" className="space-y-6">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-lg font-semibold">Contest Management</CardTitle>
              <CardDescription>Create and manage SQL coding contests</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Link href="/admin/contests">
                  <Card className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                      <CardTitle className="text-sm">All Contests</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                          <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/contests/create">
                  <Card className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardTitle className="text-sm">Create Contest</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                          <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-green-500 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/standings">
                  <Card className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10">
                      <CardTitle className="text-sm">Standings</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                          <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-lg font-semibold">Submission Management</CardTitle>
              <CardDescription>View and analyze user submissions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <Suspense fallback={<TableSkeleton />}>
                  <RecentSubmissionsTable limit={10} />
                </Suspense>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3">
              <Link href="/admin/submissions" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                >
                  View all submissions
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function ActiveContestsCard() {
  const contestsResult = await getContests()
  const now = new Date()

  if (!contestsResult.success) {
    return <div className="text-destructive">Error loading contests</div>
  }

  const activeContests =
    contestsResult.data?.filter((contest) => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now) ||
    []

  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {activeContests.length}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-1 h-4 w-4 text-blue-500" />
        <span>Currently running</span>
      </div>
    </div>
  )
}

async function RecentSignupsCard() {
  const stats = await getUserStats()

  if (!stats.success) {
    return <div className="text-destructive">Error loading stats</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        {stats.data?.recentUsers || 0}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
        <span>Last 7 days</span>
      </div>
    </div>
  )
}

async function UpcomingContestsCard() {
  const contestsResult = await getContests()
  const now = new Date()

  if (!contestsResult.success) {
    return <div className="text-destructive">Error loading contests</div>
  }

  const upcomingContests = contestsResult.data?.filter((contest) => new Date(contest.startTime) > now) || []

  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
        {upcomingContests.length}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarClock className="mr-1 h-4 w-4 text-purple-500" />
        <span>Scheduled contests</span>
      </div>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card
            key={i}
            className="border border-gray-200 dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800/50">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-7 w-20 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-8 w-full" />
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
    </div>
  )
}
