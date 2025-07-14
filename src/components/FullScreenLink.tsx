"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

interface FullScreenLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	children: React.ReactNode;
}

export const FullScreenLink = forwardRef<
	HTMLAnchorElement,
	FullScreenLinkProps
>(({ href, children, ...props }, ref) => {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		router.push(href);
	};

	return (
		<a href={href} onClick={handleClick} ref={ref} {...props}>
			{children}
		</a>
	);
});

FullScreenLink.displayName = "FullScreenLink";
