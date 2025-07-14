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

// // // import { Suspense } from "react";
// // // import {
// // // 	Card,
// // // 	CardContent,
// // // 	CardDescription,
// // // 	CardHeader,
// // // 	CardTitle,
// // // } from "@/components/ui/card";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { Input } from "@/components/ui/input";
// // // import { Button } from "@/components/ui/button";
// // // import { Skeleton } from "@/components/ui/skeleton";
// // // import { UserTable } from "@/components/UserTable";
// // // import { Search, UserPlus } from "lucide-react";
// // // import Link from "next/link";

// // // export default function UsersPage() {
// // // 	return (
// // // 		<div className="space-y-6">
// // // 			<div className="flex flex-col space-y-2">
// // // 				<h1 className="text-3xl font-bold tracking-tight">User Management</h1>
// // // 				<p className="text-muted-foreground">
// // // 					View and manage all users registered on your platform.
// // // 				</p>
// // // 			</div>

// // // 			<div className="flex items-center justify-between">
// // // 				<div className="relative w-full max-w-sm">
// // // 					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// // // 					<Input
// // // 						type="search"
// // // 						placeholder="Search users..."
// // // 						className="w-full bg-background pl-8 md:w-[300px]"
// // // 					/>
// // // 				</div>
// // // 				<Link href="/admin/users/create">
// // // 					<Button>
// // // 						<UserPlus className="mr-2 h-4 w-4" />
// // // 						Add User
// // // 					</Button>
// // // 				</Link>
// // // 			</div>

// // // 			<Tabs defaultValue="all" className="space-y-4">
// // // 				<TabsList>
// // // 					<TabsTrigger value="all">All Users</TabsTrigger>
// // // 					<TabsTrigger value="admin">Admins</TabsTrigger>
// // // 					<TabsTrigger value="user">Regular Users</TabsTrigger>
// // // 					<TabsTrigger value="recent">Recently Joined</TabsTrigger>
// // // 				</TabsList>

// // // 				<TabsContent value="all" className="space-y-4">
// // // 					<Card>
// // // 						<CardHeader>
// // // 							<CardTitle>All Users</CardTitle>
// // // 							<CardDescription>
// // // 								Manage all users registered on your platform
// // // 							</CardDescription>
// // // 						</CardHeader>
// // // 						<CardContent>
// // // 							<Suspense fallback={<UserTableSkeleton />}>
// // // 								<UserTable filter="all" />
// // // 							</Suspense>
// // // 						</CardContent>
// // // 					</Card>
// // // 				</TabsContent>

// // // 				<TabsContent value="admin" className="space-y-4">
// // // 					<Card>
// // // 						<CardHeader>
// // // 							<CardTitle>Admin Users</CardTitle>
// // // 							<CardDescription>
// // // 								Manage users with administrator privileges
// // // 							</CardDescription>
// // // 						</CardHeader>
// // // 						<CardContent>
// // // 							<Suspense fallback={<UserTableSkeleton />}>
// // // 								<UserTable filter="admin" />
// // // 							</Suspense>
// // // 						</CardContent>
// // // 					</Card>
// // // 				</TabsContent>

// // // 				<TabsContent value="user" className="space-y-4">
// // // 					<Card>
// // // 						<CardHeader>
// // // 							<CardTitle>Regular Users</CardTitle>
// // // 							<CardDescription>
// // // 								Manage regular users without administrator privileges
// // // 							</CardDescription>
// // // 						</CardHeader>
// // // 						<CardContent>
// // // 							<Suspense fallback={<UserTableSkeleton />}>
// // // 								<UserTable filter="user" />
// // // 							</Suspense>
// // // 						</CardContent>
// // // 					</Card>
// // // 				</TabsContent>

// // // 				<TabsContent value="recent" className="space-y-4">
// // // 					<Card>
// // // 						<CardHeader>
// // // 							<CardTitle>Recently Joined Users</CardTitle>
// // // 							<CardDescription>
// // // 								Users who joined in the last 30 days
// // // 							</CardDescription>
// // // 						</CardHeader>
// // // 						<CardContent>
// // // 							<Suspense fallback={<UserTableSkeleton />}>
// // // 								<UserTable filter="recent" />
// // // 							</Suspense>
// // // 						</CardContent>
// // // 					</Card>
// // // 				</TabsContent>
// // // 			</Tabs>
// // // 		</div>
// // // 	);
// // // }

// // // function UserTableSkeleton() {
// // // 	return (
// // // 		<div className="space-y-3">
// // // 			<Skeleton className="h-8 w-full" />
// // // 			{Array(5)
// // // 				.fill(0)
// // // 				.map((_, i) => (
// // // 					<Skeleton key={i} className="h-12 w-full" />
// // // 				))}
// // // 		</div>
// // // 	);
// // // }
// // "use client";

// // import type React from "react";

// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { getAllUsers } from "@/app/actions/admin";
// // import { Button } from "@/components/ui/button";
// // import { UserPlus, MoreHorizontal, User, Shield, Search } from "lucide-react";
// // import {
// // 	DropdownMenu,
// // 	DropdownMenuContent,
// // 	DropdownMenuItem,
// // 	DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { Badge } from "@/components/ui/badge";
// // import {
// // 	Table,
// // 	TableBody,
// // 	TableCell,
// // 	TableHead,
// // 	TableHeader,
// // 	TableRow,
// // } from "@/components/ui/table";
// // import { formatDistanceToNow } from "date-fns";
// // import { Input } from "@/components/ui/input";
// // import { useRouter, usePathname, useSearchParams } from "next/navigation";

// // export default function UsersPage() {
// // 	const router = useRouter();
// // 	const pathname = usePathname();
// // 	const searchParams = useSearchParams();

// // 	const [activeTab, setActiveTab] = useState("all");
// // 	const [searchQuery, setSearchQuery] = useState("");
// // 	const [users, setUsers] = useState([]);
// // 	const [filteredUsers, setFilteredUsers] = useState([]);
// // 	const [isLoading, setIsLoading] = useState(true);

// // 	// Initialize state from URL params
// // 	useEffect(() => {
// // 		const tab = searchParams.get("filter") || "all";
// // 		const query = searchParams.get("search") || "";

// // 		setActiveTab(tab);
// // 		setSearchQuery(query);

// // 		// Fetch users
// // 		fetchUsers(tab);
// // 	}, [searchParams]);

// // 	// Fetch users based on filter
// // 	const fetchUsers = async (filter: string) => {
// // 		setIsLoading(true);
// // 		try {
// // 			const result = await getAllUsers(filter);
// // 			if (result.success) {
// // 				setUsers(result.data || []);
// // 				filterUsers(result.data || [], searchQuery);
// // 			} else {
// // 				console.error("Failed to fetch users:", result.error);
// // 			}
// // 		} catch (error) {
// // 			console.error("Error fetching users:", error);
// // 		} finally {
// // 			setIsLoading(false);
// // 		}
// // 	};

// // 	// Filter users based on search query
// // 	const filterUsers = (userList: any[], query: string) => {
// // 		if (!query) {
// // 			setFilteredUsers(userList);
// // 			return;
// // 		}

// // 		const filtered = userList.filter(
// // 			(user) =>
// // 				user.name.toLowerCase().includes(query.toLowerCase()) ||
// // 				user.email.toLowerCase().includes(query.toLowerCase())
// // 		);
// // 		setFilteredUsers(filtered);
// // 	};

// // 	// Handle tab change
// // 	const handleTabChange = (value: string) => {
// // 		setActiveTab(value);

// // 		// Update URL without full page refresh
// // 		const params = new URLSearchParams(searchParams);
// // 		params.set("filter", value);
// // 		router.push(`${pathname}?${params.toString()}`, { scroll: false });
// // 	};

// // 	// Handle search
// // 	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
// // 		const query = e.target.value;
// // 		setSearchQuery(query);
// // 		filterUsers(users, query);

// // 		// Update URL without full page refresh
// // 		const params = new URLSearchParams(searchParams);
// // 		if (query) {
// // 			params.set("search", query);
// // 		} else {
// // 			params.delete("search");
// // 		}
// // 		router.push(`${pathname}?${params.toString()}`, { scroll: false });
// // 	};

// // 	// Display users based on current state
// // 	const displayUsers = searchQuery ? filteredUsers : users;

// // 	return (
// // 		<div className="space-y-6">
// // 			<div className="flex items-center justify-between">
// // 				<div>
// // 					<h1 className="text-2xl font-bold">Users</h1>
// // 					<p className="text-muted-foreground">
// // 						Manage users and access permissions
// // 					</p>
// // 				</div>
// // 				<Link href="/admin/users/create">
// // 					<Button>
// // 						<UserPlus className="mr-2 h-4 w-4" />
// // 						Add User
// // 					</Button>
// // 				</Link>
// // 			</div>

// // 			<div className="flex items-center justify-between">
// // 				<div className="relative w-full max-w-sm">
// // 					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// // 					<Input
// // 						type="search"
// // 						placeholder="Search users..."
// // 						className="w-full bg-background pl-8 md:w-[300px]"
// // 						value={searchQuery}
// // 						onChange={handleSearch}
// // 					/>
// // 				</div>
// // 			</div>

// // 			<Tabs
// // 				value={activeTab}
// // 				onValueChange={handleTabChange}
// // 				className="space-y-4"
// // 			>
// // 				<TabsList>
// // 					<TabsTrigger value="all">All Users</TabsTrigger>
// // 					<TabsTrigger value="admin">Admins</TabsTrigger>
// // 					<TabsTrigger value="user">Regular Users</TabsTrigger>
// // 					<TabsTrigger value="recent">Recently Joined</TabsTrigger>
// // 				</TabsList>

// // 				<TabsContent value={activeTab} className="space-y-4">
// // 					<div className="rounded-md border">
// // 						<Table>
// // 							<TableHeader>
// // 								<TableRow>
// // 									<TableHead>User</TableHead>
// // 									<TableHead>Role</TableHead>
// // 									<TableHead>Joined</TableHead>
// // 									<TableHead className="w-[100px]">Options</TableHead>
// // 								</TableRow>
// // 							</TableHeader>
// // 							<TableBody>
// // 								{isLoading ? (
// // 									Array(5)
// // 										.fill(0)
// // 										.map((_, i) => (
// // 											<TableRow key={i}>
// // 												<TableCell colSpan={4}>
// // 													<div className="h-12 w-full animate-pulse bg-muted rounded"></div>
// // 												</TableCell>
// // 											</TableRow>
// // 										))
// // 								) : displayUsers.length > 0 ? (
// // 									displayUsers.map((user: any) => (
// // 										<TableRow key={user.id}>
// // 											<TableCell>
// // 												<div className="flex items-center gap-3">
// // 													<Avatar className="h-9 w-9">
// // 														<AvatarFallback className="bg-primary/10 text-primary">
// // 															{getInitials(user.name)}
// // 														</AvatarFallback>
// // 													</Avatar>
// // 													<div>
// // 														<div className="font-semibold">{user.name}</div>
// // 														<div className="text-sm text-muted-foreground">
// // 															{user.email}
// // 														</div>
// // 													</div>
// // 												</div>
// // 											</TableCell>
// // 											<TableCell>
// // 												<Badge
// // 													variant={
// // 														user.role === "admin" ? "default" : "outline"
// // 													}
// // 												>
// // 													{user.role === "admin" ? (
// // 														<Shield className="mr-1 h-3 w-3" />
// // 													) : (
// // 														<User className="mr-1 h-3 w-3" />
// // 													)}
// // 													{user.role}
// // 												</Badge>
// // 											</TableCell>
// // 											<TableCell>
// // 												{formatDistanceToNow(new Date(user.createdAt), {
// // 													addSuffix: true,
// // 												})}
// // 											</TableCell>
// // 											<TableCell>
// // 												<DropdownMenu>
// // 													<DropdownMenuTrigger asChild>
// // 														<Button variant="ghost" className="h-8 w-8 p-0">
// // 															<span className="sr-only">Open menu</span>
// // 															<MoreHorizontal className="h-4 w-4" />
// // 														</Button>
// // 													</DropdownMenuTrigger>
// // 													<DropdownMenuContent align="end">
// // 														<Link href={`/admin/users/${user.id}`}>
// // 															<DropdownMenuItem>View details</DropdownMenuItem>
// // 														</Link>
// // 														<Link href={`/admin/users/${user.id}/edit`}>
// // 															<DropdownMenuItem>Edit user</DropdownMenuItem>
// // 														</Link>
// // 													</DropdownMenuContent>
// // 												</DropdownMenu>
// // 											</TableCell>
// // 										</TableRow>
// // 									))
// // 								) : (
// // 									<TableRow>
// // 										<TableCell colSpan={4} className="h-24 text-center">
// // 											No users found.
// // 										</TableCell>
// // 									</TableRow>
// // 								)}
// // 							</TableBody>
// // 						</Table>
// // 					</div>
// // 				</TabsContent>
// // 			</Tabs>
// // 		</div>
// // 	);
// // }

// // function getInitials(name: string): string {
// // 	return name
// // 		.split(" ")
// // 		.map((part) => part[0])
// // 		.join("")
// // 		.toUpperCase()
// // 		.substring(0, 2);
// // }
