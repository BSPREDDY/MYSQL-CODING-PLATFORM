"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { grantContestReEntry } from "@/app/actions/contestSecurity";

interface LockedOutUser {
	userId: string;
	userName: string;
	userEmail: string;
	userRegNo?: string;
	userSection?: string;
	contestId: string;
	contestName: string;
	lockedOutAt: Date;
	lockedOutReason: string;
}

interface AllLockedOutUsersTableProps {
	users: LockedOutUser[];
}

export function AllLockedOutUsersTable({
	users: initialUsers,
}: AllLockedOutUsersTableProps) {
	const [users, setUsers] = useState<LockedOutUser[]>(initialUsers);
	const [processingUsers, setProcessingUsers] = useState<Set<string>>(
		new Set()
	);
	const { toast } = useToast();

	useEffect(() => {
		setUsers(initialUsers);
	}, [initialUsers]);

	const handleGrantReEntry = async (userId: string, contestId: string) => {
		// Create a unique key for this user+contest combination
		const processingKey = `${userId}-${contestId}`;
		setProcessingUsers((prev) => new Set(prev).add(processingKey));

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

				// Remove this user-contest combination from the list
				setUsers((currentUsers) =>
					currentUsers.filter(
						(user) => !(user.userId === userId && user.contestId === contestId)
					)
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
				newSet.delete(processingKey);
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
						<TableHead>Registration/Section</TableHead>
						<TableHead>Contest</TableHead>
						<TableHead>Locked Out</TableHead>
						<TableHead>Reason</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.length > 0 ? (
						users.map((user) => {
							const processingKey = `${user.userId}-${user.contestId}`;
							return (
								<TableRow
									key={`${user.userId}-${user.contestId}`}
									id={`user-row-${user.userId}-${user.contestId}`}
								>
									<TableCell>
										<div>
											<div className="font-medium">{user.userName}</div>
											<div className="text-sm text-muted-foreground">
												{user.userEmail}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>
											{user.userRegNo && <div>Reg: {user.userRegNo}</div>}
											{user.userSection && (
												<div>Section: {user.userSection}</div>
											)}
											{!user.userRegNo && !user.userSection && "N/A"}
										</div>
									</TableCell>
									<TableCell>{user.contestName}</TableCell>
									<TableCell>
										{formatDistanceToNow(new Date(user.lockedOutAt), {
											addSuffix: true,
										})}
									</TableCell>
									<TableCell>{user.lockedOutReason}</TableCell>
									<TableCell className="text-right">
										<Button
											size="sm"
											onClick={() =>
												handleGrantReEntry(user.userId, user.contestId)
											}
											disabled={processingUsers.has(processingKey)}
										>
											{processingUsers.has(processingKey)
												? "Processing..."
												: "Grant Re-entry"}
										</Button>
									</TableCell>
								</TableRow>
							);
						})
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
