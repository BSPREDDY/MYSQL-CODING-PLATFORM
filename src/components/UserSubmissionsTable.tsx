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
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface Submission {
	id: string;
	problemId: string;
	status: string;
	createdAt: string;
	problemTitle: string;
	problemDifficulty: string;
}

export function UserSubmissionsTable({
	submissions,
	isLoading = false,
}: {
	submissions: Submission[];
	isLoading?: boolean;
}) {
	if (isLoading) {
		return <div>Loading submissions...</div>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Problem</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Submitted</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{submissions.map((submission) => (
					<TableRow key={submission.id}>
						<TableCell>
							<div className="flex flex-col">
								<Link
									href={`/admin/problems/${submission.problemId}`}
									className="font-medium hover:underline"
								>
									{submission.problemTitle}
								</Link>
								<div className="flex items-center mt-1">
									<Badge
										className={
											submission.problemDifficulty === "easy"
												? "bg-green-500"
												: submission.problemDifficulty === "medium"
												? "bg-yellow-500"
												: "bg-red-500"
										}
									>
										{submission.problemDifficulty}
									</Badge>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<div className="flex items-center">
								{submission.status === "AC" ? (
									<>
										<CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
										<span className="text-green-500">Accepted</span>
									</>
								) : (
									<>
										<XCircle className="mr-1 h-4 w-4 text-red-500" />
										<span className="text-red-500">Failed</span>
									</>
								)}
							</div>
						</TableCell>
						<TableCell>
							<div className="text-sm text-muted-foreground">
								{formatDistanceToNow(new Date(submission.createdAt), {
									addSuffix: true,
								})}
							</div>
						</TableCell>
					</TableRow>
				))}

				{submissions.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center py-6 text-muted-foreground"
						>
							No submissions found
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
