"use server";

import { getAllUsers } from "@/app/actions/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Shield, User } from "lucide-react";
import Link from "next/link";

export async function UserTable({ filter = "all" }: { filter?: string }) {
	const usersResult = await getAllUsers(filter);

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
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>
							<div className="flex items-center gap-3">
								<Avatar className="h-9 w-9">
									<AvatarFallback className="bg-primary/10 text-primary">
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
							<Badge
								variant={user.role === "admin" ? "default" : "outline"}
								className="flex w-fit items-center gap-1"
							>
								{user.role === "admin" ? (
									<Shield className="h-3 w-3" />
								) : (
									<User className="h-3 w-3" />
								)}
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
						<TableCell className="text-right">
							<Link href={`/admin/users/${user.id}`}>
								<Button variant="ghost" size="icon">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">More options</span>
								</Button>
							</Link>
						</TableCell>
					</TableRow>
				))}

				{users.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={4}
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
