
// import {UserNavbar} from "@/components/UserNavbar";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <UserNavbar />
//         {children}
//       </body>
//     </html>
//   );
// }

import type React from "react"
import type { Metadata } from "next"
import { UserNavbar } from "@/components/UserNavbar"

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User dashboard for SQL Coding platform",
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <UserNavbar />
      <main>{children}</main>
    </div>
  )
}
