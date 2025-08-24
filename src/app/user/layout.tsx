import type React from "react";
import { UserSidebar } from "@/components/UserSideBar";
import { verifySession } from "@/app/actions/session";
import { redirect } from "next/navigation";

export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Verify user is authenticated
	const session = await verifySession();
	if (!session?.isAuth) {
		redirect("/api/login");
	}

	return (
		<div className="flex min-h-screen">
			<div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
				<UserSidebar />
			</div>
			<div className="md:pl-64 flex-1">
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
