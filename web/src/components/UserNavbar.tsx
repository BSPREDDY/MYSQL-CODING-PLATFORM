// "use client"

// import type React from "react"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Code, LogOut, Trophy, User } from "lucide-react"

// interface NavItem {
//   title: string
//   href: string
//   icon: React.ReactNode
// }

// export function UserNavbar() {
//   const pathname = usePathname()

//   const centerNavItems: NavItem[] = [
//     {
//       title: "Problems",
//       href: "/problems",
//       icon: <Code className="h-4 w-4 mr-2" />,
//     },
//     {
//       title: "Contests",
//       href: "/user/contests",
//       icon: <Trophy className="h-4 w-4 mr-2" />,
//     },
//     {
//       title: "Profile",
//       href: "/user/profile",
//       icon: <User className="h-4 w-4 mr-2" />,
//     },
//   ]

//   const logoutItem: NavItem = {
//     title: "Logout",
//     href: "/",
//     icon: <LogOut className="h-4 w-4 mr-2" />,
//   }

//   return (
//     <nav className="bg-[#0f1524] shadow-md border-b border-blue-800/40">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Empty left section for symmetry */}
//           <div className="flex-1" />

//           {/* Center nav items */}
//           <div className="flex space-x-2">
//             {centerNavItems.map((item) => (
//               <Link key={item.href} href={item.href}>
//                 <Button
//                   variant="ghost"
//                   className={cn(
//                     "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
//                     "text-gray-400 hover:text-white hover:bg-[#1a2235] hover:shadow-lg hover:border hover:border-blue-500/50",
//                     pathname === item.href && "text-blue-400 bg-[#1a2235] border border-blue-600/50 shadow-inner"
//                   )}
//                 >
//                   {item.icon}
//                   <span className="capitalize">{item.title}</span>
//                 </Button>
//               </Link>
//             ))}
//           </div>

//           {/* Logout button on the right */}
//           <div className="flex-1 flex justify-end">
//             <Link href={logoutItem.href}>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
//                   "text-gray-400 hover:text-white hover:bg-[#1a2235] hover:shadow-lg hover:border hover:border-red-500/50",
//                   pathname === logoutItem.href && "text-red-400 bg-[#1a2235] border border-red-600/50 shadow-inner"
//                 )}
//               >
//                 {logoutItem.icon}
//                 <span className="capitalize">{logoutItem.title}</span>
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }


// "use client"

// import type React from "react"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Code, LogOut, Trophy, User, Database } from "lucide-react"

// interface NavItem {
//   title: string
//   href: string
//   icon: React.ReactNode
// }

// export function UserNavbar() {
//   const pathname = usePathname()

//   const centerNavItems: NavItem[] = [
//     {
//       title: "Problems",
//       href: "/user/problems",
//       icon: <Code className="h-4 w-4 mr-2" />,
//     },
//     {
//       title: "Contests",
//       href: "/user/contests",
//       icon: <Trophy className="h-4 w-4 mr-2" />,
//     },
//     {
//       title: "Profile",
//       href: "/user/profile",
//       icon: <User className="h-4 w-4 mr-2" />,
//     },
//   ]

//   const logoutItem: NavItem = {
//     title: "Logout",
//     href: "/",
//     icon: <LogOut className="h-4 w-4 mr-2" />,
//   }

//   return (
//     <nav className="bg-[#0f1524] shadow-md border-b border-blue-800/40">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Left section: SQL icon */}
//           <div className="flex-1 flex items-center">
//             <Link href="/user/problems" className="flex items-center hover:text-blue-400 transition-colors">
//               <Database className="h-5 w-5 text-blue-500" />
//               <span className="ml-2 text-white text-lg font-semibold hidden sm:inline">SQLPlay</span>
//             </Link>
//           </div>

//           {/* Center nav items */}
//           <div className="flex space-x-2">
//             {centerNavItems.map((item) => (
//               <Link key={item.href} href={item.href}>
//                 <Button
//                   variant="ghost"
//                   className={cn(
//                     "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
//                     "text-gray-400 hover:text-white hover:bg-[#1a2235] hover:shadow-lg hover:border hover:border-blue-500/50",
//                     pathname === item.href && "text-blue-400 bg-[#1a2235] border border-blue-600/50 shadow-inner"
//                   )}
//                 >
//                   {item.icon}
//                   <span className="capitalize">{item.title}</span>
//                 </Button>
//               </Link>
//             ))}
//           </div>

//           {/* Logout button on the right */}
//           <div className="flex-1 flex justify-end">
//             <Link href={logoutItem.href}>
//               <Button
//                 variant="ghost"
//                 className={cn(
//                   "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
//                   "text-gray-400 hover:text-white hover:bg-[#1a2235] hover:shadow-lg hover:border hover:border-red-500/50",
//                   pathname === logoutItem.href && "text-red-400 bg-[#1a2235] border border-red-600/50 shadow-inner"
//                 )}
//               >
//                 {logoutItem.icon}
//                 <span className="capitalize">{logoutItem.title}</span>
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, Trophy, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser } from "@/app/actions/user"
import type { UserData } from "@/app/actions/user"

export function UserNavbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await getCurrentUser()
        if (result.success && result.user) {
          setUser(result.user)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/user/problems" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-black" />
              <span className="text-xl font-bold text-black">SQL Coding</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/user/problems" active={pathname === "/problems"}>
              <Code className="h-4 w-4 mr-2" />
              Problems
            </NavLink>
            <NavLink href="/user/contests" active={pathname === "/user/contests"}>
              <Trophy className="h-4 w-4 mr-2" />
              Contests
            </NavLink>

            <NavLink href="/user/profile" active={pathname === "/user/profile"}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoading && user ? (
              <>
                <div className="flex items-center space-x-3">
                  <Link href="/user/profile">
                    <Avatar className="h-8 w-8 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors">
                      <AvatarFallback className="bg-black text-white text-xs">
                        {user.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <form action="/api/logout" method="post">
                  <input type="hidden" name="redirectUrl" value="/api/login" />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 bg-white text-black border-black hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/api/login">
                  <Button variant="outline" size="sm" className="bg-white text-black border-black hover:bg-gray-100">
                    Login
                  </Button>
                </Link>
                <Link href="/api/signup">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <MobileNavLink href="/problems" active={pathname === "/problems"}>
            <Code className="h-5 w-5" />
            <span className="text-xs">Problems</span>
          </MobileNavLink>
          <MobileNavLink href="/user/contests" active={pathname === "/user/contests"}>
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Contests</span>
          </MobileNavLink>
          <MobileNavLink href="/user/profile" active={pathname === "/user/profile"}>
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </MobileNavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center py-2 ${
        active ? "bg-gray-100 text-black" : "text-gray-700"
      }`}
    >
      {children}
    </Link>
  )
}
