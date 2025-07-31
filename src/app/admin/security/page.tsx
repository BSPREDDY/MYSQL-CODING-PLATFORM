import { getAllLockedOutUsers } from "@/app/actions/contestSecurity";
import { verifySession } from "@/app/actions/session";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AllLockedOutUsersTable } from "@/components/AllLockedOutUsersTable";
import { redirect } from "next/navigation";
import { appDb } from "@/db/postgres";
import { contestAccess } from "@/db/postgres/schema";
import { eq } from "drizzle-orm";

export default async function AdminSecurityPage() {
	// Verify admin access
	const session = await verifySession();
	if (!session.isAuth || session.role !== "admin") {
		redirect("/api/login?callbackUrl=" + encodeURIComponent(`/admin/security`));
	}

	// Get all locked out users across all contests
	const lockedOutUsersResult = await getAllLockedOutUsers();
	const lockedOutUsers = lockedOutUsersResult.success
		? lockedOutUsersResult.data
		: [];

	// Get raw count from database for debugging
	const rawCount = await appDb
		.select({ count: contestAccess.userId })
		.from(contestAccess)
		.where(eq(contestAccess.isLockedOut, true));
	const totalLockedOutCount = rawCount.length;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Security Dashboard
				</h1>
				<p className="text-muted-foreground">
					Manage locked out users across all contests
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Locked Out Users</CardTitle>
					<CardDescription>
						Users who have been locked out of contests due to security
						violations
						{totalLockedOutCount > 0 && (
							<span className="ml-2 text-sm text-blue-500">
								(Raw database count: {totalLockedOutCount})
							</span>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{lockedOutUsers.length > 0 ? (
						<AllLockedOutUsersTable users={lockedOutUsers} />
					) : (
						<div className="text-center py-8 text-muted-foreground">
							No users are currently locked out of any contests
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
