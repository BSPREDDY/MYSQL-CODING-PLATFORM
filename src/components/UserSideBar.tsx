<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d762d5a (premium pages updated)
// "use client";

// import type React from "react";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
// 	LayoutDashboard,
// 	FileCode,
// 	Trophy,
// 	User,
// 	Settings,
// } from "lucide-react";
// import LogoutForm from "./LogoutForm";

// interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

// export function UserSidebar({ className }: SidebarNavProps) {
// 	const pathname = usePathname();

// 	const routes = [
// 		{
// 			label: "Problems",
// 			icon: FileCode,
// 			href: "/problems",
// 			active: pathname === "/problems" || pathname.startsWith("/problems/"),
// 		},
// 		{
// 			label: "Contests",
// 			icon: Trophy,
// 			href: "/user/contests",
// 			active: pathname === "/user/contests" || pathname.startsWith("/contest/"),
// 		},
// 		{
// 			label: "Profile",
// 			icon: User,
// 			href: "/user/profile",
// 			active: pathname === "/user/profile",
// 		},
// 	];

// 	return (
// 		<div className={cn("pb-12 h-full flex flex-col", className)}>
// 			<div className="space-y-4 py-4 flex-1">
// 				<div className="px-4 py-2">
// 					<h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
// 						SQL Coding Platform
// 					</h2>
// 					<div className="space-y-1">
// 						{routes.map((route) => (
// 							<Link
// 								key={route.href}
// 								href={route.href}
// 								className={cn(
// 									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
// 									route.active
// 										? "bg-accent text-accent-foreground"
// 										: "text-muted-foreground"
// 								)}
// 							>
// 								<route.icon className="h-4 w-4" />
// 								{route.label}
// 							</Link>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 			<div className="px-4 py-2 border-t">
// 				<LogoutForm />
// 			</div>
// 		</div>
// 	);
// }


"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileCode, Trophy, User, Crown } from "lucide-react"
import LogoutForm from "./LogoutForm"
<<<<<<< HEAD
import { PremiumBadge } from "@/components/PremiumBadge"
=======
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
>>>>>>> 566240bfafa1c422230e3fc1a6e51217f6e7c72a
=======
import { PremiumBadge } from "./PremiumBadge"
>>>>>>> d762d5a (premium pages updated)

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSidebar({ className }: SidebarNavProps) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d762d5a (premium pages updated)
  const pathname = usePathname()

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
    {
      label: "Premium",
      icon: Crown,
      href: "/user/premium",
      active: pathname === "/user/premium" || pathname.startsWith("/user/premium/"),
<<<<<<< HEAD
=======
      submenu: [
        {
          label: "Subscription",
          href: "/user/premium",
          active: pathname === "/user/premium",
        },
        {
          label: "Premium Problems",
          href: "/user/premium/problems",
          active: pathname === "/user/premium/problems" || pathname.startsWith("/user/premium/problems/"),
        },
      ],
>>>>>>> d762d5a (premium pages updated)
    },
  ]

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="px-2 text-lg font-semibold tracking-tight">SQL Coding Platform</h2>
            <PremiumBadge variant="icon-only" />
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
<<<<<<< HEAD
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
=======
              <div key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                    route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
                {route.submenu && route.active && (
                  <div className="ml-6 mt-1 space-y-1">
                    {route.submenu.map((subRoute) => (
                      <Link
                        key={subRoute.href}
                        href={subRoute.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-1 text-xs font-medium transition-all hover:bg-accent",
                          subRoute.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
>>>>>>> d762d5a (premium pages updated)
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-2 border-t">
        <LogoutForm />
      </div>
    </div>
  )
<<<<<<< HEAD
=======
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
>>>>>>> 566240bfafa1c422230e3fc1a6e51217f6e7c72a
=======
>>>>>>> d762d5a (premium pages updated)
}
