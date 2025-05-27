import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getContests } from "@/app/actions/contest";
import { PerformanceAnalytics } from "@/components/PerformanceAnalytics";

export default async function PerformancePage() {
	const contestsResult = await getContests();
	const contests = contestsResult.success ? contestsResult.data || [] : [];

	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Student Performance
				</h1>
				<p className="text-muted-foreground">
					Analyze student performance across contests. Filter by section, view
					charts, and export reports in CSV or Excel format.
				</p>
			</div>

			<Suspense fallback={<AnalyticsSkeleton />}>
				<PerformanceAnalytics contests={contests} />
			</Suspense>
		</div>
	);
}

function AnalyticsSkeleton() {
	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-4 w-60" />
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-40" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-40" />
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{Array(5)
							.fill(0)
							.map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
