<<<<<<< HEAD
// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import {
// 	BarChart3,
// 	Users,
// 	Trophy,
// 	Database,
// 	Home,
// 	ChevronDown,
// } from "lucide-react";
// import {
// 	SidebarProvider,
// 	Sidebar,
// 	SidebarContent,
// 	SidebarHeader,
// 	SidebarFooter,
// 	SidebarMenu,
// 	SidebarMenuItem,
// 	SidebarMenuButton,
// 	SidebarMenuSub,
// 	SidebarMenuSubItem,
// 	SidebarMenuSubButton,
// } from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { getCurrentUser } from "@/app/actions/user";

// export default function AdminLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	const pathname = usePathname();
// 	const [mounted, setMounted] = useState(false);
// 	const [user, setUser] = useState({ name: "", email: "", initials: "" });

// 	// Fetch user data
// 	useEffect(() => {
// 		async function getUserData() {
// 			try {
// 				const result = await getCurrentUser();
// 				if (result.success && result.user) {
// 					const initials = result.user.name
// 						? result.user.name
// 								.split(" ")
// 								.map((n) => n[0])
// 								.join("")
// 								.toUpperCase()
// 								.substring(0, 2)
// 						: "AD";

// 					setUser({
// 						name: result.user.name,
// 						email: result.user.email,
// 						initials,
// 					});
// 				}
// 			} catch (error) {
// 				console.error("Error fetching user data:", error);
// 			}
// 		}

// 		getUserData();
// 	}, []);

// 	// Prevent hydration mismatch
// 	useEffect(() => {
// 		setMounted(true);
// 	}, []);

// 	if (!mounted) {
// 		return null;
// 	}

// 	return (
// 		<SidebarProvider defaultOpen={true}>
// 			<div className="flex min-h-screen">
// 				<AdminSidebar pathname={pathname} user={user} />
// 				<main className="flex-1 overflow-auto">{children}</main>
// 			</div>
// 		</SidebarProvider>
// 	);
// }

// function AdminSidebar({
// 	pathname,
// 	user,
// }: {
// 	pathname: string;
// 	user: { name: string; email: string; initials: string };
// }) {
// 	return (
// 		<Sidebar>
// 			<SidebarHeader>
// 				<div className="flex items-center gap-2 px-4 py-3">
// 					<Database className="h-6 w-6 text-primary" />
// 					<div className="font-semibold text-xl">SQL Admin</div>
// 				</div>
// 			</SidebarHeader>
// 			<SidebarContent>
// 				<SidebarMenu>
// 					<SidebarMenuItem>
// 						<SidebarMenuButton asChild isActive={pathname === "/admin"}>
// 							<Link href="/admin">
// 								<Home className="h-5 w-5" />
// 								<span>Dashboard</span>
// 							</Link>
// 						</SidebarMenuButton>
// 					</SidebarMenuItem>

// 					<SidebarMenuItem>
// 						<Collapsible className="w-full">
// 							<CollapsibleTrigger className="w-full" asChild>
// 								<SidebarMenuButton>
// 									<Users className="h-5 w-5" />
// 									<span>Users</span>
// 									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
// 								</SidebarMenuButton>
// 							</CollapsibleTrigger>
// 							<CollapsibleContent>
// 								<SidebarMenuSub>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/users"}
// 										>
// 											<Link href="/admin/users">All Users</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/users/create"}
// 										>
// 											<Link href="/admin/users/create">Create User</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 								</SidebarMenuSub>
// 							</CollapsibleContent>
// 						</Collapsible>
// 					</SidebarMenuItem>

// 					<SidebarMenuItem>
// 						<Collapsible className="w-full">
// 							<CollapsibleTrigger className="w-full" asChild>
// 								<SidebarMenuButton>
// 									<Trophy className="h-5 w-5" />
// 									<span>Contests</span>
// 									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
// 								</SidebarMenuButton>
// 							</CollapsibleTrigger>
// 							<CollapsibleContent>
// 								<SidebarMenuSub>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/contests"}
// 										>
// 											<Link href="/admin/contests">All Contests</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/contests/create"}
// 										>
// 											<Link href="/admin/contests/create">Create Contest</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/security"}
// 										>
// 											<Link href="/admin/security">Contest Security</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/standings"}
// 										>
// 											<Link href="/admin/standings">Standings</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 								</SidebarMenuSub>
// 							</CollapsibleContent>
// 						</Collapsible>
// 					</SidebarMenuItem>

// 					<SidebarMenuItem>
// 						<Collapsible className="w-full">
// 							<CollapsibleTrigger className="w-full" asChild>
// 								<SidebarMenuButton>
// 									<Database className="h-5 w-5" />
// 									<span>Problems</span>
// 									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
// 								</SidebarMenuButton>
// 							</CollapsibleTrigger>
// 							<CollapsibleContent>
// 								<SidebarMenuSub>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/problems"}
// 										>
// 											<Link href="/admin/problems">All Problems</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 									<SidebarMenuSubItem>
// 										<SidebarMenuSubButton
// 											asChild
// 											isActive={pathname === "/admin/create_problem"}
// 										>
// 											<Link href="/admin/create_problem">Create Problem</Link>
// 										</SidebarMenuSubButton>
// 									</SidebarMenuSubItem>
// 								</SidebarMenuSub>
// 							</CollapsibleContent>
// 						</Collapsible>
// 					</SidebarMenuItem>

// 					<SidebarMenuItem>
// 						<SidebarMenuButton
// 							asChild
// 							isActive={pathname === "/admin/analytics"}
// 						>
// 							<Link href="/admin/analytics">
// 								<BarChart3 className="h-5 w-5" />
// 								<span>Analytics</span>
// 							</Link>
// 						</SidebarMenuButton>
// 					</SidebarMenuItem>
// 				</SidebarMenu>
// 			</SidebarContent>
// 			<SidebarFooter>
// 				<div className="px-3 py-2">
// 					<Separator />
// 					<div className="mt-3 flex items-center justify-between">
// 						<div className="flex items-center gap-3">
// 							<Avatar className="h-8 w-8">
// 								<AvatarFallback className="bg-primary/10 text-primary">
// 									{user.initials}
// 								</AvatarFallback>
// 							</Avatar>
// 							<div className="text-sm">
// 								<div className="font-medium">{user.name}</div>
// 								<div className="text-xs text-muted-foreground">
// 									{user.email}
// 								</div>
// 							</div>
// 						</div>
// 						<Link
// 							href="/api/logout"
// 							className="text-xs text-muted-foreground hover:text-foreground"
// 						>
// 							Logout
// 						</Link>
// 					</div>
// 				</div>
// 			</SidebarFooter>
// 		</Sidebar>
// 	);
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Users, Trophy, Database, Home, ChevronDown, Crown } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getCurrentUser } from "@/app/actions/user"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState({ name: "", email: "", initials: "" })

  // Fetch user data
  useEffect(() => {
    async function getUserData() {
      try {
        const result = await getCurrentUser()
        if (result.success && result.user) {
          const initials = result.user.name
            ? result.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "AD"

          setUser({
            name: result.user.name,
            email: result.user.email,
            initials,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    getUserData()
  }, [])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AdminSidebar pathname={pathname} user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}

function AdminSidebar({
  pathname,
  user,
}: {
  pathname: string
  user: { name: string; email: string; initials: string }
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <Database className="h-6 w-6 text-primary" />
          <div className="font-semibold text-xl">SQL Admin</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin"}>
              <Link href="/admin">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full" asChild>
                <SidebarMenuButton>
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/users"}>
                      <Link href="/admin/users">All Users</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/users/create"}>
                      <Link href="/admin/users/create">Create User</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full" asChild>
                <SidebarMenuButton>
                  <Trophy className="h-5 w-5" />
                  <span>Contests</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/contests"}>
                      <Link href="/admin/contests">All Contests</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/contests/create"}>
                      <Link href="/admin/contests/create">Create Contest</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/security"}>
                      <Link href="/admin/security">Contest Security</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/standings"}>
                      <Link href="/admin/standings">Standings</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full" asChild>
                <SidebarMenuButton>
                  <Database className="h-5 w-5" />
                  <span>Problems</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/problems"}>
                      <Link href="/admin/problems">All Problems</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/create_problem"}>
                      <Link href="/admin/create_problem">Create Problem</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/analytics"}>
              <Link href="/admin/analytics">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full" asChild>
                <SidebarMenuButton>
                  <Crown className="h-5 w-5" />
                  <span>Premium</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/premium/plans"}>
                      <Link href="/admin/premium/plans">Subscription Plans</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/premium/subscriptions"}>
                      <Link href="/admin/premium/subscriptions">User Subscriptions</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/premium/payments"}>
                      <Link href="/admin/premium/payments">Payment History</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/admin/premium/analytics"}>
                      <Link href="/admin/premium/analytics">Premium Analytics</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <Separator />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <Link href="/api/logout" className="text-xs text-muted-foreground hover:text-foreground">
              Logout
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
=======
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	BarChart3,
	Users,
	Trophy,
	Database,
	Home,
	ChevronDown,
} from "lucide-react";
import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getCurrentUser } from "@/app/actions/user";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);
	const [user, setUser] = useState({ name: "", email: "", initials: "" });

	// Fetch user data
	useEffect(() => {
		async function getUserData() {
			try {
				const result = await getCurrentUser();
				if (result.success && result.user) {
					const initials = result.user.name
						? result.user.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()
								.substring(0, 2)
						: "AD";

					setUser({
						name: result.user.name,
						email: result.user.email,
						initials,
					});
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}

		getUserData();
	}, []);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="flex min-h-screen">
				<AdminSidebar pathname={pathname} user={user} />
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</SidebarProvider>
	);
}

function AdminSidebar({
	pathname,
	user,
}: {
	pathname: string;
	user: { name: string; email: string; initials: string };
}) {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-3">
					<Database className="h-6 w-6 text-primary" />
					<div className="font-semibold text-xl">SQL Admin</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive={pathname === "/admin"}>
							<Link href="/admin">
								<Home className="h-5 w-5" />
								<span>Dashboard</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<Collapsible className="w-full">
							<CollapsibleTrigger className="w-full" asChild>
								<SidebarMenuButton>
									<Users className="h-5 w-5" />
									<span>Users</span>
									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/users"}
										>
											<Link href="/admin/users">All Users</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/users/create"}
										>
											<Link href="/admin/users/create">Create User</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</Collapsible>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<Collapsible className="w-full">
							<CollapsibleTrigger className="w-full" asChild>
								<SidebarMenuButton>
									<Trophy className="h-5 w-5" />
									<span>Contests</span>
									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/contests"}
										>
											<Link href="/admin/contests">All Contests</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/contests/create"}
										>
											<Link href="/admin/contests/create">Create Contest</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/security"}
										>
											<Link href="/admin/security">Contest Security</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/standings"}
										>
											<Link href="/admin/standings">Standings</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</Collapsible>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<Collapsible className="w-full">
							<CollapsibleTrigger className="w-full" asChild>
								<SidebarMenuButton>
									<Database className="h-5 w-5" />
									<span>Problems</span>
									<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/problems"}
										>
											<Link href="/admin/problems">All Problems</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton
											asChild
											isActive={pathname === "/admin/create_problem"}
										>
											<Link href="/admin/create_problem">Create Problem</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</Collapsible>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={pathname === "/admin/analytics"}
						>
							<Link href="/admin/analytics">
								<BarChart3 className="h-5 w-5" />
								<span>Analytics</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<div className="px-3 py-2">
					<Separator />
					<div className="mt-3 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Avatar className="h-8 w-8">
								<AvatarFallback className="bg-primary/10 text-primary">
									{user.initials}
								</AvatarFallback>
							</Avatar>
							<div className="text-sm">
								<div className="font-medium">{user.name}</div>
								<div className="text-xs text-muted-foreground">
									{user.email}
								</div>
							</div>
						</div>
						<Link
							href="/api/logout"
							className="text-xs text-muted-foreground hover:text-foreground"
						>
							Logout
						</Link>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
>>>>>>> 566240bfafa1c422230e3fc1a6e51217f6e7c72a
}
