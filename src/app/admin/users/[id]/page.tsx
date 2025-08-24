import Link from "next/link";
import { notFound } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	Calendar,
	Mail,
	Trophy,
	CheckCircle2,
	XCircle,
	BarChart3,
	Clock,
	User,
	Shield,
	Pencil,
} from "lucide-react";
import {
	getUserById,
	getUserSubmissions,
	getUserContestParticipation,
} from "@/app/actions/admin";
import { UserSubmissionsTable } from "@/components/UserSubmissionsTable";
import { UserContestsTable } from "@/components/UserContestsTable";
import { UserStatsChart } from "@/components/UserStatsChart";
import { DeleteUserButton } from "@/components/DeleteUserButton";

export default async function UserDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const userId = params.id;

	const userResult = await getUserById(userId);

	if (!userResult.success || !userResult.data) {
		return notFound();
	}

	const user = userResult.data;

	// Fetch user submissions
	const submissionsResult = await getUserSubmissions(userId);
	const submissions = submissionsResult.success
		? submissionsResult.data || []
		: [];

	// Fetch user contest participation
	const contestsResult = await getUserContestParticipation(userId);
	const contests = contestsResult.success ? contestsResult.data || [] : [];

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link
					href="/admin/users"
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Users
				</Link>
			</div>

			<div className="flex flex-col md:flex-row gap-6 items-start">
				<Card className="w-full md:w-80">
					<CardHeader>
						<div className="flex flex-col items-center text-center">
							<Avatar className="h-24 w-24 mb-4">
								<AvatarFallback className="text-2xl bg-primary/10 text-primary">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<CardTitle className="text-xl">{user.name}</CardTitle>
							<div className="flex items-center mt-2">
								<Mail className="h-4 w-4 mr-1 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">
									{user.email}
								</span>
							</div>
							<div className="mt-2">
								<Badge variant={user.role === "admin" ? "default" : "outline"}>
									{user.role === "admin" ? (
										<Shield className="h-3 w-3 mr-1" />
									) : (
										<User className="h-3 w-3 mr-1" />
									)}
									{user.role}
								</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-medium text-muted-foreground mb-1">
									Joined
								</h3>
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
									<span>{formatDate(user.createdAt)}</span>
								</div>
							</div>

							<Separator />

							<UserStats
								totalSubmissions={submissions.length}
								acceptedSubmissions={
									submissions.filter((sub) => sub.status === "AC").length
								}
								totalContests={contests.length}
							/>

							<Separator />

							<div className="flex flex-col gap-2">
								<Link href={`/admin/users/${userId}/edit`}>
									<Button variant="outline" className="w-full">
										<Pencil className="mr-2 h-4 w-4" />
										Edit User
									</Button>
								</Link>
								<DeleteUserButton userId={userId} userName={user.name} />
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex-1">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="submissions">Submissions</TabsTrigger>
							<TabsTrigger value="contests">Contests</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-4 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Performance Overview</CardTitle>
									<CardDescription>
										User's performance statistics and trends
									</CardDescription>
								</CardHeader>
								<CardContent className="h-80">
									<UserStatsChart userId={userId} />
								</CardContent>
							</Card>

							<div className="grid gap-4 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Recent Submissions</CardTitle>
										<CardDescription>
											Latest problem submissions
										</CardDescription>
									</CardHeader>
									<CardContent>
										<UserSubmissionsTable
											submissions={submissions.slice(0, 5)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Contest Participation</CardTitle>
										<CardDescription>
											Recent contests and performance
										</CardDescription>
									</CardHeader>
									<CardContent>
										<UserContestsTable contests={contests.slice(0, 5)} />
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="submissions" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>All Submissions</CardTitle>
									<CardDescription>
										Complete submission history for this user
									</CardDescription>
								</CardHeader>
								<CardContent>
									<UserSubmissionsTable submissions={submissions} />
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="contests" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Contest History</CardTitle>
									<CardDescription>
										All contests this user has participated in
									</CardDescription>
								</CardHeader>
								<CardContent>
									<UserContestsTable contests={contests} />
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

function UserStats({
	totalSubmissions,
	acceptedSubmissions,
	totalContests,
}: {
	totalSubmissions: number;
	acceptedSubmissions: number;
	totalContests: number;
}) {
	const acceptanceRate =
		totalSubmissions > 0
			? Math.round((acceptedSubmissions / totalSubmissions) * 100)
			: 0;

	return (
		<div className="space-y-3">
			<div>
				<h3 className="text-sm font-medium text-muted-foreground mb-1">
					Submissions
				</h3>
				<div className="flex justify-between items-center">
					<span className="text-2xl font-bold">{totalSubmissions}</span>
					<div className="flex items-center">
						<span className="text-sm">{acceptanceRate}%</span>
						{acceptanceRate > 50 ? (
							<CheckCircle2 className="h-4 w-4 ml-1 text-green-500" />
						) : (
							<XCircle className="h-4 w-4 ml-1 text-red-500" />
						)}
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium text-muted-foreground mb-1">
					Contests
				</h3>
				<div className="flex justify-between items-center">
					<span className="text-2xl font-bold">{totalContests}</span>
					<Trophy className="h-5 w-5 text-amber-500" />
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium text-muted-foreground mb-1">
					Solved Problems
				</h3>
				<div className="flex justify-between items-center">
					<span className="text-2xl font-bold">{acceptedSubmissions}</span>
					<BarChart3 className="h-5 w-5 text-blue-500" />
				</div>
			</div>
		</div>
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
