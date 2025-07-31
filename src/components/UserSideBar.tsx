"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	FileCode,
	Trophy,
	User,
	Settings,
} from "lucide-react";
import LogoutForm from "./LogoutForm";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSidebar({ className }: SidebarNavProps) {
	const pathname = usePathname();

	const routes = [
		{
			label: "Problems",
			icon: FileCode,
			href: "/problems",
			active: pathname === "/problems" || pathname.startsWith("/problems/"),
		},
		{
			label: "Contests",
			icon: Trophy,
			href: "/user/contests",
			active: pathname === "/user/contests" || pathname.startsWith("/contest/"),
		},
		{
			label: "Profile",
			icon: User,
			href: "/user/profile",
			active: pathname === "/user/profile",
		},
	];

	return (
		<div className={cn("pb-12 h-full flex flex-col", className)}>
			<div className="space-y-4 py-4 flex-1">
				<div className="px-4 py-2">
					<h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
						SQL Coding Platform
					</h2>
					<div className="space-y-1">
						{routes.map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
									route.active
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground"
								)}
							>
								<route.icon className="h-4 w-4" />
								{route.label}
							</Link>
						))}
					</div>
				</div>
			</div>
			<div className="px-4 py-2 border-t">
				<LogoutForm />
			</div>
		</div>
	);
}
