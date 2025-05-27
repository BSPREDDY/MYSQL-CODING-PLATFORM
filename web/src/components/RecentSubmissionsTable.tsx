// "use server";

// import { getRecentSubmissions } from "@/app/actions/admin";
// import { Badge } from "@/components/ui/badge";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";
// import { formatDistanceToNow } from "date-fns";
// import { CheckCircle2, XCircle } from "lucide-react";
// import Link from "next/link";

// export async function RecentSubmissionsTable({
// 	limit = 5,
// }: {
// 	limit?: number;
// }) {
// 	const submissionsResult = await getRecentSubmissions(limit);

// 	if (!submissionsResult.success) {
// 		return <div className="text-destructive">Error loading submissions</div>;
// 	}

// 	const submissions = submissionsResult.data;

// 	return (
// 		<Table>
// 			<TableHeader>
// 				<TableRow>
// 					<TableHead>Problem</TableHead>
// 					<TableHead>User</TableHead>
// 					<TableHead>Status</TableHead>
// 					<TableHead>Submitted</TableHead>
// 				</TableRow>
// 			</TableHeader>
// 			<TableBody>
// 				{submissions.map((submission) => (
// 					<TableRow key={submission.id}>
// 						<TableCell>
// 							<div className="flex flex-col">
// 								<div className="font-medium">{submission.problemTitle}</div>
// 								<div className="flex items-center mt-1">
// 									<Badge
// 										className={
// 											submission.problemDifficulty === "easy"
// 												? "bg-green-500"
// 												: submission.problemDifficulty === "medium"
// 												? "bg-yellow-500"
// 												: "bg-red-500"
// 										}
// 									>
// 										{submission.problemDifficulty}
// 									</Badge>
// 								</div>
// 							</div>
// 						</TableCell>
// 						<TableCell>
// 							<Link
// 								href={`/admin/users/${submission.userId}`}
// 								className="hover:underline"
// 							>
// 								{submission.userName}
// 							</Link>
// 						</TableCell>
// 						<TableCell>
// 							<div className="flex items-center">
// 								{submission.status === "AC" ? (
// 									<>
// 										<CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
// 										<span className="text-green-500">Accepted</span>
// 									</>
// 								) : (
// 									<>
// 										<XCircle className="mr-1 h-4 w-4 text-red-500" />
// 										<span className="text-red-500">Failed</span>
// 									</>
// 								)}
// 							</div>
// 						</TableCell>
// 						<TableCell>
// 							<div className="text-sm text-muted-foreground">
// 								{formatDistanceToNow(new Date(submission.createdAt), {
// 									addSuffix: true,
// 								})}
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				))}

// 				{submissions.length === 0 && (
// 					<TableRow>
// 						<TableCell
// 							colSpan={4}
// 							className="text-center py-6 text-muted-foreground"
// 						>
// 							No submissions found
// 						</TableCell>
// 					</TableRow>
// 				)}
// 			</TableBody>
// 		</Table>
// 	);
// }


"use server"

import { getRecentSubmissions } from "@/app/actions/admin"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export async function RecentSubmissionsTable({
  limit = 5,
}: {
  limit?: number
}) {
  const submissionsResult = await getRecentSubmissions(limit)

  if (!submissionsResult.success) {
    return <div className="text-destructive">Error loading submissions</div>
  }

  const submissions = submissionsResult.data

  return (
    <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-medium">Problem</TableHead>
            <TableHead className="font-medium">User</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <div className="font-medium">{submission.problemTitle}</div>
                  <div className="flex items-center mt-1">
                    <Badge
                      className={
                        submission.problemDifficulty === "easy"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 text-white"
                          : submission.problemDifficulty === "medium"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white"
                            : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 text-white"
                      }
                    >
                      {submission.problemDifficulty}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/users/${submission.userId}`}
                  className="hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {submission.userName}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {submission.status === "AC" ? (
                    <div className="flex items-center px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      <span>Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      <XCircle className="mr-1 h-4 w-4" />
                      <span>Failed</span>
                    </div>
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
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No submissions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
