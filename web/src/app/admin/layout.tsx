"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Users, Trophy, Database, Home, ChevronDown, LogOut } from "lucide-react"
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
import { Button } from "@/components/ui/button"

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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <AdminSidebar pathname={pathname} user={user} />
        <main className="flex-1 overflow-auto p-6 transition-all duration-300 ease-in-out">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
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
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SQL Admin
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin"}
              className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              <Link href="/admin" className="group">
                <div
                  className={`p-1 rounded-full ${pathname === "/admin" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-gray-700"}`}
                >
                  <Home
                    className={`h-5 w-5 ${pathname === "/admin" ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
                  />
                </div>
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full" asChild>
                <SidebarMenuButton className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800">
                  <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-gray-700">
                    <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
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
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Link href="/admin/users">All Users</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/admin/users/create"}
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
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
                <SidebarMenuButton className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800">
                  <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-gray-700">
                    <Trophy className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
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
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Link href="/admin/contests">All Contests</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/admin/contests/create"}
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Link href="/admin/contests/create">Create Contest</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/admin/standings"}
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
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
                <SidebarMenuButton className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800">
                  <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-gray-700">
                    <Database className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
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
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <Link href="/admin/problems">All Problems</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === "/admin/create_problem"}
                      className="pl-10 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
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
              className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              <Link href="/admin/analytics" className="group">
                <div
                  className={`p-1 rounded-full ${pathname === "/admin/analytics" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-gray-700"}`}
                >
                  <BarChart3
                    className={`h-5 w-5 ${pathname === "/admin/analytics" ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
                  />
                </div>
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-4">
          <Separator className="my-2" />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</div>
              </div>
            </div>
            <Link href="/api/logout">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
