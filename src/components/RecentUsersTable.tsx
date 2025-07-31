"use server";

import { getRecentUsers } from "@/app/actions/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export async function RecentUsersTable() {
	const usersResult = await getRecentUsers(5);

	if (!usersResult.success) {
		return <div className="text-destructive">Error loading users</div>;
	}

	const users = usersResult.data;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>User</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Joined</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="text-xs">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">{user.name}</div>
									<div className="text-xs text-muted-foreground">
										{user.email}
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<Badge variant={user.role === "admin" ? "default" : "outline"}>
								{user.role}
							</Badge>
						</TableCell>
						<TableCell>
							<div className="text-sm text-muted-foreground">
								{formatDistanceToNow(new Date(user.createdAt), {
									addSuffix: true,
								})}
							</div>
						</TableCell>
					</TableRow>
				))}

				{users.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center py-6 text-muted-foreground"
						>
							No users found
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
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
