// "use server";

// import { getRecentUsers } from "@/app/actions/admin";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

// export async function RecentUsersTable() {
// 	const usersResult = await getRecentUsers(5);

// 	if (!usersResult.success) {
// 		return <div className="text-destructive">Error loading users</div>;
// 	}

// 	const users = usersResult.data;

// 	return (
// 		<Table>
// 			<TableHeader>
// 				<TableRow>
// 					<TableHead>User</TableHead>
// 					<TableHead>Role</TableHead>
// 					<TableHead>Joined</TableHead>
// 				</TableRow>
// 			</TableHeader>
// 			<TableBody>
// 				{users.map((user) => (
// 					<TableRow key={user.id}>
// 						<TableCell>
// 							<div className="flex items-center gap-3">
// 								<Avatar className="h-8 w-8">
// 									<AvatarFallback className="text-xs">
// 										{getInitials(user.name)}
// 									</AvatarFallback>
// 								</Avatar>
// 								<div>
// 									<div className="font-medium">{user.name}</div>
// 									<div className="text-xs text-muted-foreground">
// 										{user.email}
// 									</div>
// 								</div>
// 							</div>
// 						</TableCell>
// 						<TableCell>
// 							<Badge variant={user.role === "admin" ? "default" : "outline"}>
// 								{user.role}
// 							</Badge>
// 						</TableCell>
// 						<TableCell>
// 							<div className="text-sm text-muted-foreground">
// 								{formatDistanceToNow(new Date(user.createdAt), {
// 									addSuffix: true,
// 								})}
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				))}

// 				{users.length === 0 && (
// 					<TableRow>
// 						<TableCell
// 							colSpan={3}
// 							className="text-center py-6 text-muted-foreground"
// 						>
// 							No users found
// 						</TableCell>
// 					</TableRow>
// 				)}
// 			</TableBody>
// 		</Table>
// 	);
// }

// function getInitials(name: string): string {
// 	return name
// 		.split(" ")
// 		.map((part) => part[0])
// 		.join("")
// 		.toUpperCase()
// 		.substring(0, 2);
// }


"use server"

import { getRecentUsers } from "@/app/actions/admin"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { Shield, User } from "lucide-react"
import Link from "next/link"

export async function RecentUsersTable() {
  const usersResult = await getRecentUsers(5)

  if (!usersResult.success) {
    return <div className="text-destructive">Error loading users</div>
  }

  const users = usersResult.data

  return (
    <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-medium">User</TableHead>
            <TableHead className="font-medium">Role</TableHead>
            <TableHead className="font-medium">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <TableCell>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                {user.role === "admin" ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0">
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <User className="mr-1 h-3 w-3" />
                    {user.role}
                  </Badge>
                )}
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
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
