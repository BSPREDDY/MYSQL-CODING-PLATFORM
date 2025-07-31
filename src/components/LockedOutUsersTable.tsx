"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { grantContestReEntry } from "@/app/actions/contestSecurity";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface LockedOutUser {
	userId: string;
	userName: string;
	userEmail: string;
	userRegNo?: string;
	userSection?: string;
	lockedOutAt: Date;
	lockedOutReason: string;
}

interface LockedOutUsersTableProps {
	users: LockedOutUser[];
}

export function LockedOutUsersTable({
	users: initialUsers,
}: LockedOutUsersTableProps) {
	const [users, setUsers] = useState<LockedOutUser[]>(initialUsers);
	const [processingUsers, setProcessingUsers] = useState<Set<string>>(
		new Set()
	);
	const { toast } = useToast();
	const params = useParams();

	const contestId = params.contestId as string;

	useEffect(() => {
		setUsers(initialUsers);
	}, [initialUsers]);

	const handleGrantReEntry = async (userId: string) => {
		setProcessingUsers((prev) => new Set(prev).add(userId));
		try {
			console.log(
				`Granting re-entry to user ${userId} for contest ${contestId}`
			);
			const result = await grantContestReEntry(userId, contestId);

			if (result.success) {
				toast({
					title: "Re-entry Granted",
					description: "The user can now re-enter the contest.",
				});

				setUsers((currentUsers) =>
					currentUsers.filter((user) => user.userId !== userId)
				);
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to grant re-entry",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error granting re-entry:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setProcessingUsers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(userId);
				return newSet;
			});
		}
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead>Reg No</TableHead>
						<TableHead>Section</TableHead>
						<TableHead>Locked Out</TableHead>
						<TableHead>Reason</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.length > 0 ? (
						users.map((user) => (
							<TableRow key={user.userId} id={`user-row-${user.userId}`}>
								<TableCell>
									<div>
										<div className="font-medium">{user.userName}</div>
										<div className="text-sm text-muted-foreground">
											{user.userEmail}
										</div>
									</div>
								</TableCell>
								<TableCell>{user.userRegNo || "N/A"}</TableCell>
								<TableCell>{user.userSection || "N/A"}</TableCell>
								<TableCell>
									{formatDistanceToNow(new Date(user.lockedOutAt), {
										addSuffix: true,
									})}
								</TableCell>
								<TableCell>{user.lockedOutReason}</TableCell>
								<TableCell className="text-right">
									<Button
										size="sm"
										onClick={() => handleGrantReEntry(user.userId)}
										disabled={processingUsers.has(user.userId)}
									>
										{processingUsers.has(user.userId)
											? "Processing..."
											: "Grant Re-entry"}
									</Button>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={6}
								className="text-center py-6 text-muted-foreground"
							>
								No users are currently locked out
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
