import { Suspense } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BarChart3,
	Users,
	Trophy,
	Database,
	Calendar,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import { getAnalyticsData } from "@/app/actions/admin";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
import { SubmissionChart } from "@/components/charts/SubmissionChart";
import { ProblemDifficultyChart } from "@/components/charts/ProblemDifficultyChart";
import { ContestParticipationChart } from "@/components/charts/ContestParticipationChart";

export default function AnalyticsPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Analytics Dashboard
				</h1>
				<p className="text-muted-foreground">
					Comprehensive analytics and insights for your SQL Contest platform.
				</p>
			</div>

			<Suspense fallback={<StatCardsSkeleton />}>
				<AnalyticsSummary />
			</Suspense>

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="submissions">Submissions</TabsTrigger>
					<TabsTrigger value="contests">Contests</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>User Growth</CardTitle>
								<CardDescription>
									New user registrations over time
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<Suspense fallback={<Skeleton className="h-full w-full" />}>
									<UserGrowthChart />
								</Suspense>
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Submission Activity</CardTitle>
								<CardDescription>Problem submissions over time</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<Suspense fallback={<Skeleton className="h-full w-full" />}>
									<SubmissionChart />
								</Suspense>
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Problem Distribution</CardTitle>
								<CardDescription>Problems by difficulty level</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<Suspense fallback={<Skeleton className="h-full w-full" />}>
									<ProblemDifficultyChart />
								</Suspense>
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Contest Participation</CardTitle>
								<CardDescription>
									User participation in contests
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<Suspense fallback={<Skeleton className="h-full w-full" />}>
									<ContestParticipationChart />
								</Suspense>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="users" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>User Analytics</CardTitle>
							<CardDescription>
								Detailed user growth and engagement metrics
							</CardDescription>
						</CardHeader>
						<CardContent className="h-96">
							<Suspense fallback={<Skeleton className="h-full w-full" />}>
								<UserGrowthChart detailed />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="submissions" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Submission Analytics</CardTitle>
							<CardDescription>
								Detailed submission metrics and trends
							</CardDescription>
						</CardHeader>
						<CardContent className="h-96">
							<Suspense fallback={<Skeleton className="h-full w-full" />}>
								<SubmissionChart detailed />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="contests" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Contest Analytics</CardTitle>
							<CardDescription>
								Detailed contest participation and performance metrics
							</CardDescription>
						</CardHeader>
						<CardContent className="h-96">
							<Suspense fallback={<Skeleton className="h-full w-full" />}>
								<ContestParticipationChart detailed />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

async function AnalyticsSummary() {
	const analyticsData = await getAnalyticsData();

	if (!analyticsData.success) {
		return <div className="text-destructive">Error loading analytics data</div>;
	}

	const data = analyticsData.data;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{data.totalUsers}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						{data.userGrowth > 0 ? (
							<>
								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
								<span className="text-emerald-500">{data.userGrowth}%</span>
							</>
						) : (
							<>
								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
								<span className="text-red-500">
									{Math.abs(data.userGrowth)}%
								</span>
							</>
						)}
						<span className="ml-1">from last month</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Submissions
					</CardTitle>
					<Database className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{data.totalSubmissions}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						{data.submissionGrowth > 0 ? (
							<>
								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
								<span className="text-emerald-500">
									{data.submissionGrowth}%
								</span>
							</>
						) : (
							<>
								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
								<span className="text-red-500">
									{Math.abs(data.submissionGrowth)}%
								</span>
							</>
						)}
						<span className="ml-1">from last month</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Contests</CardTitle>
					<Trophy className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{data.totalContests}</div>
					<div className="flex items-center text-xs text-muted-foreground">
						<Calendar className="mr-1 h-4 w-4" />
						<span>{data.activeContests} active now</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Success Rate</CardTitle>
					<BarChart3 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{data.successRate}%</div>
					<div className="flex items-center text-xs text-muted-foreground">
						{data.successRateChange > 0 ? (
							<>
								<ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
								<span className="text-emerald-500">
									{data.successRateChange}%
								</span>
							</>
						) : (
							<>
								<ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
								<span className="text-red-500">
									{Math.abs(data.successRateChange)}%
								</span>
							</>
						)}
						<span className="ml-1">from last month</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StatCardsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array(4)
				.fill(0)
				.map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-7 w-20 mb-2" />
							<Skeleton className="h-4 w-28" />
						</CardContent>
					</Card>
				))}
		</div>
	);
}
