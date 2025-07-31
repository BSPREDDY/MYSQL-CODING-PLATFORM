import { getContestById } from "@/app/actions/contest-actions";
import { getLockedOutUsers } from "@/app/actions/contestSecurity";
import { verifySession } from "@/app/actions/session";
import { ContestSecuritySettings } from "@/components/ContestSecuritySettings";
import { LockedOutUsersTable } from "@/components/LockedOutUsersTable";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ContestSecurityPage({
	params,
}: {
	params: { contestId: string };
}) {
	const { contestId } = params;

	// Verify admin access
	const session = await verifySession();
	if (!session.isAuth || session.role !== "admin") {
		redirect(
			"/api/login?callbackUrl=" +
				encodeURIComponent(`/admin/contests/${contestId}/security`)
		);
	}

	// Get contest details
	const contestResult = await getContestById(contestId);
	if (!contestResult.success) {
		notFound();
	}

	const contest = contestResult.data;

	// Get locked out users
	const lockedOutUsersResult = await getLockedOutUsers(contestId);
	const lockedOutUsers = lockedOutUsersResult.success
		? lockedOutUsersResult.data
		: [];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Contest Security
					</h1>
					<p className="text-muted-foreground">
						Manage security settings and locked out users for {contest.title}
					</p>
				</div>
				<Link href={`/admin/contests`}>
					<Button variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Contests
					</Button>
				</Link>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Security Settings</CardTitle>
						<CardDescription>
							Configure security settings for this contest
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ContestSecuritySettings
							contestId={contestId}
							initialFullScreenRequired={contest.fullScreenRequired}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Locked Out Users</CardTitle>
						<CardDescription>
							Users who have been locked out of the contest due to security
							violations
						</CardDescription>
					</CardHeader>
					<CardContent>
						{lockedOutUsers.length > 0 ? (
							<LockedOutUsersTable
								users={lockedOutUsers}
								contestId={contestId}
							/>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								No users are currently locked out of this contest
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
