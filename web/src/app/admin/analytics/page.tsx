// import { Suspense } from "react";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
// 	BarChart3,
// 	Users,
// 	Trophy,
// 	Database,
// 	Calendar,
// 	ArrowUpRight,
// 	ArrowDownRight,
// } from "lucide-react";
// import { getAnalyticsData } from "@/app/actions/admin";
// import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
// import { SubmissionChart } from "@/components/charts/SubmissionChart";
// import { ProblemDifficultyChart } from "@/components/charts/ProblemDifficultyChart";
// import { ContestParticipationChart } from "@/components/charts/ContestParticipationChart";

// export default function AnalyticsPage() {
// 	return (
// 		<div className="space-y-6">
// 			<div className="flex flex-col space-y-2">
// 				<h1 className="text-3xl font-bold tracking-tight">
// 					Analytics Dashboard
// 				</h1>
// 				<p className="text-muted-foreground">
// 					Comprehensive analytics and insights for your SQL Contest platform.
// 				</p>
// 			</div>

// 			<Suspense fallback={<StatCardsSkeleton />}>
// 				<AnalyticsSummary />
// 			</Suspense>

// 			<Tabs defaultValue="overview" className="space-y-4">
// 				<TabsList>
// 					<TabsTrigger value="overview">Overview</TabsTrigger>
// 					<TabsTrigger value="users">Users</TabsTrigger>
// 					<TabsTrigger value="submissions">Submissions</TabsTrigger>
// 					<TabsTrigger value="contests">Contests</TabsTrigger>
// 				</TabsList>

// 				<TabsContent value="overview" className="space-y-4">
// 					<div className="grid gap-4 md:grid-cols-2">
// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>User Growth</CardTitle>
// 								<CardDescription>
// 									New user registrations over time
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent className="h-80">
// 								<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 									<UserGrowthChart />
// 								</Suspense>
// 							</CardContent>
// 						</Card>

// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>Submission Activity</CardTitle>
// 								<CardDescription>Problem submissions over time</CardDescription>
// 							</CardHeader>
// 							<CardContent className="h-80">
// 								<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 									<SubmissionChart />
// 								</Suspense>
// 							</CardContent>
// 						</Card>

// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>Problem Distribution</CardTitle>
// 								<CardDescription>Problems by difficulty level</CardDescription>
// 							</CardHeader>
// 							<CardContent className="h-80">
// 								<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 									<ProblemDifficultyChart />
// 								</Suspense>
// 							</CardContent>
// 						</Card>

// 						<Card className="col-span-1">
// 							<CardHeader>
// 								<CardTitle>Contest Participation</CardTitle>
// 								<CardDescription>
// 									User participation in contests
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent className="h-80">
// 								<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 									<ContestParticipationChart />
// 								</Suspense>
// 							</CardContent>
// 						</Card>
// 					</div>
// 				</TabsContent>

// 				<TabsContent value="users" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>User Analytics</CardTitle>
// 							<CardDescription>
// 								Detailed user growth and engagement metrics
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="h-96">
// 							<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 								<UserGrowthChart detailed />
// 							</Suspense>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>

// 				<TabsContent value="submissions" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Submission Analytics</CardTitle>
// 							<CardDescription>
// 								Detailed submission metrics and trends
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="h-96">
// 							<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 								<SubmissionChart detailed />
// 							</Suspense>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>

// 				<TabsContent value="contests" className="space-y-4">
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Contest Analytics</CardTitle>
// 							<CardDescription>
// 								Detailed contest participation and performance metrics
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="h-96">
// 							<Suspense fallback={<Skeleton className="h-full w-full" />}>
// 								<ContestParticipationChart detailed />
// 							</Suspense>
// 						</CardContent>
// 					</Card>
// 				</TabsContent>
// 			</Tabs>
// 		</div>
// 	);
// }

// async function AnalyticsSummary() {
// 	const analyticsData = await getAnalyticsData();

// 	if (!analyticsData.success) {
// 		return <div className="text-destructive">Error loading analytics data</div>;
// 	}

// 	const data = analyticsData.data;

// 	return (
// 		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Total Users</CardTitle>
// 					<Users className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{data.totalUsers}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						{data.userGrowth > 0 ? (
// 							<>
// 								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
// 								<span className="text-emerald-500">{data.userGrowth}%</span>
// 							</>
// 						) : (
// 							<>
// 								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
// 								<span className="text-red-500">
// 									{Math.abs(data.userGrowth)}%
// 								</span>
// 							</>
// 						)}
// 						<span className="ml-1">from last month</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">
// 						Total Submissions
// 					</CardTitle>
// 					<Database className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{data.totalSubmissions}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						{data.submissionGrowth > 0 ? (
// 							<>
// 								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
// 								<span className="text-emerald-500">
// 									{data.submissionGrowth}%
// 								</span>
// 							</>
// 						) : (
// 							<>
// 								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
// 								<span className="text-red-500">
// 									{Math.abs(data.submissionGrowth)}%
// 								</span>
// 							</>
// 						)}
// 						<span className="ml-1">from last month</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Total Contests</CardTitle>
// 					<Trophy className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{data.totalContests}</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						<Calendar className="mr-1 h-4 w-4" />
// 						<span>{data.activeContests} active now</span>
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// 					<CardTitle className="text-sm font-medium">Success Rate</CardTitle>
// 					<BarChart3 className="h-4 w-4 text-muted-foreground" />
// 				</CardHeader>
// 				<CardContent>
// 					<div className="text-2xl font-bold">{data.successRate}%</div>
// 					<div className="flex items-center text-xs text-muted-foreground">
// 						{data.successRateChange > 0 ? (
// 							<>
// 								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
// 								<span className="text-emerald-500">
// 									{data.successRateChange}%
// 								</span>
// 							</>
// 						) : (
// 							<>
// 								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
// 								<span className="text-red-500">
// 									{Math.abs(data.successRateChange)}%
// 								</span>
// 							</>
// 						)}
// 						<span className="ml-1">from last month</span>
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }

// function StatCardsSkeleton() {
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


import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Users, Trophy, Database, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getAnalyticsData } from "@/app/actions/admin"
import { UserGrowthChart } from "@/components/charts/UserGrowthChart"
import { SubmissionChart } from "@/components/charts/SubmissionChart"
import { ProblemDifficultyChart } from "@/components/charts/ProblemDifficultyChart"
import { ContestParticipationChart } from "@/components/charts/ContestParticipationChart"

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-full space-y-8 px-4 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights for your SQL Contest platform.</p>
      </div>

      <Suspense fallback={<StatCardsSkeleton />}>
        <AnalyticsSummary />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-8 w-full">
        <TabsList className="bg-white dark:bg-gray-800 p-1 shadow-lg rounded-xl w-full max-w-md mx-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="contests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Contests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 w-full">
          <div className="grid gap-6 md:grid-cols-2 w-full">
            <Card className="col-span-1 border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-6">
                <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                  <UserGrowthChart />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-1 border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Submission Activity
                </CardTitle>
                <CardDescription>Problem submissions over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-6">
                <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                  <SubmissionChart />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-1 border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Problem Distribution
                </CardTitle>
                <CardDescription>Problems by difficulty level</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-6">
                <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                  <ProblemDifficultyChart />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-1 border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Contest Participation
                </CardTitle>
                <CardDescription>User participation in contests</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-6">
                <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                  <ContestParticipationChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-8 w-full">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">User Analytics</CardTitle>
              <CardDescription>Detailed user growth and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] p-6">
              <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                <UserGrowthChart detailed />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-8 w-full">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Submission Analytics
              </CardTitle>
              <CardDescription>Detailed submission metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] p-6">
              <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                <SubmissionChart detailed />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contests" className="space-y-8 w-full">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Contest Analytics
              </CardTitle>
              <CardDescription>Detailed contest participation and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] p-6">
              <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
                <ContestParticipationChart detailed />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function AnalyticsSummary() {
  const analyticsData = await getAnalyticsData()

  if (!analyticsData.success) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
        Error loading analytics data. Please try again later.
      </div>
    )
  }

  const data = analyticsData.data

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">Total Users</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{data.totalUsers.toLocaleString()}</div>
          <div className="flex items-center text-xs mt-2">
            {data.userGrowth > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500 font-medium">{data.userGrowth}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">{Math.abs(data.userGrowth)}%</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">Total Submissions</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {data.totalSubmissions.toLocaleString()}
          </div>
          <div className="flex items-center text-xs mt-2">
            {data.submissionGrowth > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500 font-medium">{data.submissionGrowth}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">{Math.abs(data.submissionGrowth)}%</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">Total Contests</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {data.totalContests.toLocaleString()}
          </div>
          <div className="flex items-center text-xs mt-2">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-1">
              <Calendar className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-muted-foreground">
              <span className="font-medium text-purple-600 dark:text-purple-400">{data.activeContests}</span> active now
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">Success Rate</CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{data.successRate}%</div>
          <div className="flex items-center text-xs mt-2">
            {data.successRateChange > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500 font-medium">{data.successRateChange}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">{Math.abs(data.successRateChange)}%</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card
            key={i}
            className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-20 rounded-md mb-2" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
