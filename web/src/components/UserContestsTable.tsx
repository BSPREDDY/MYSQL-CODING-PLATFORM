"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface Contest {
	contestId: string;
	pointsEarned: number;
	updatedAt: string;
	contestTitle: string;
	startTime: string;
	endTime: string;
}

export function UserContestsTable({
	contests,
	isLoading = false,
}: {
	contests: Contest[];
	isLoading?: boolean;
}) {
	if (isLoading) {
		return <div>Loading contests...</div>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Contest</TableHead>
					<TableHead>Points</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{contests.map((contest) => {
					const now = new Date();
					const startTime = new Date(contest.startTime);
					const endTime = new Date(contest.endTime);

					let status = "Upcoming";
					let statusClass = "bg-blue-500";

					if (now > endTime) {
						status = "Finished";
						statusClass = "bg-gray-500";
					} else if (now >= startTime && now <= endTime) {
						status = "Active";
						statusClass = "bg-green-500";
					}

					return (
						<TableRow key={contest.contestId}>
							<TableCell>
								<Link
									href={`/admin/contests/${contest.contestId}`}
									className="font-medium hover:underline"
								>
									{contest.contestTitle}
								</Link>
								<div className="text-xs text-muted-foreground mt-1">
									{formatDistanceToNow(new Date(contest.updatedAt), {
										addSuffix: true,
									})}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center">
									<Trophy className="mr-1 h-4 w-4 text-amber-500" />
									<span className="font-medium">{contest.pointsEarned}</span>
								</div>
							</TableCell>
							<TableCell>
								<Badge className={statusClass}>{status}</Badge>
							</TableCell>
						</TableRow>
					);
				})}

				{contests.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center py-6 text-muted-foreground"
						>
							No contest participation found
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
