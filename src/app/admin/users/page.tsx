import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/UserTable";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Upload, BarChart } from "lucide-react";
import { DeleteAllUsersButton } from "@/components/DeleteAllUsersButton";

export default function UsersPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">User Management</h1>
				<p className="text-muted-foreground">
					Manage users of your SQL Contest platform.
				</p>
			</div>

			<div className="flex flex-wrap gap-4 justify-between items-center">
				<div className="flex flex-wrap gap-4">
					<Link href="/admin/users/create">
						<Button className="flex items-center gap-2">
							<UserPlus className="h-4 w-4" />
							Create User
						</Button>
					</Link>
					<Link href="/admin/users/bulk-create">
						<Button variant="outline" className="flex items-center gap-2">
							<Upload className="h-4 w-4" />
							Bulk Create Users
						</Button>
					</Link>
					<Link href="/admin/performance">
						<Button variant="outline" className="flex items-center gap-2">
							<BarChart className="h-4 w-4" />
							Performance Analytics
						</Button>
					</Link>
				</div>
				<DeleteAllUsersButton />
			</div>

			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Users</TabsTrigger>
					<TabsTrigger value="admin">Admins</TabsTrigger>
					<TabsTrigger value="user">Students</TabsTrigger>
					<TabsTrigger value="recent">Recent</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>All Users</CardTitle>
							<CardDescription>
								View and manage all users on your platform.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<UserTableSkeleton />}>
								<UserTable filter="all" />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="admin" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Administrators</CardTitle>
							<CardDescription>View and manage admin users.</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<UserTableSkeleton />}>
								<UserTable filter="admin" />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="user" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Students</CardTitle>
							<CardDescription>View and manage student users.</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<UserTableSkeleton />}>
								<UserTable filter="user" />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="recent" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Users</CardTitle>
							<CardDescription>
								View and manage recently created users.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<UserTableSkeleton />}>
								<UserTable filter="recent" />
							</Suspense>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function UserTableSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-8 w-full" />
			{Array(5)
				.fill(0)
				.map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
		</div>
	);
}
