"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";
import { checkIsAdmin } from "@/app/actions/userRole";

interface AdminContestActionsProps {
	contestId: string;
}

export function AdminContestActions({ contestId }: AdminContestActionsProps) {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAdminStatus() {
			try {
				const result = await checkIsAdmin();
				setIsAdmin(result.isAdmin);
			} catch (error) {
				console.error("Error checking admin status:", error);
			} finally {
				setLoading(false);
			}
		}

		checkAdminStatus();
	}, []);

	if (loading || !isAdmin) {
		return null;
	}

	return (
		<div className="absolute top-2 right-2 flex gap-2">
			<Link href={`/admin/contests/${contestId}/edit`}>
				<Button size="icon" variant="ghost">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Edit</span>
				</Button>
			</Link>
			<Link href={`/admin/contests/${contestId}/security`}>
				<Button size="icon" variant="ghost">
					<Shield className="h-4 w-4" />
					<span className="sr-only">Security</span>
				</Button>
			</Link>
		</div>
	);
}
