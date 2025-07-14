"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { FullScreenContestWrapper } from "./FullScreenContestWrapper";

interface FullScreenWrapperProps {
	contestId: string;
	isActive: boolean;
	children: React.ReactNode;
}

export function FullScreenWrapper({
	contestId,
	isActive,
	children,
}: FullScreenWrapperProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <>{children}</>;
	}

	return isActive ? (
		<FullScreenContestWrapper contestId={contestId}>
			{children}
		</FullScreenContestWrapper>
	) : (
		<>{children}</>
	);
}
