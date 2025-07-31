
"use client";

import type React from "react";
import { ContestFullScreenWrapper } from "./ContestFullScreenWrapper";
import { useSession } from "@/lib/auth";
import 

interface ContestPageWrapperProps {
	contestId: string;
	isActive: boolean;
	children: React.ReactNode;
}

export function ContestPageWrapper({
	contestId,
	isActive,
	children,
}: ContestPageWrapperProps) {
	const { session } = useSession();
	const isAdmin = session?.role === "admin";

	return (
		<ContestFullScreenWrapper
			contestId={contestId}
			isActive={isActive}
			isAdmin={isAdmin}
		>
			{children}
		</ContestFullScreenWrapper>
	);
}
