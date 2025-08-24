import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/actions/session";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
	console.log("Middleware running for:", req.nextUrl.pathname);
	const path = req.nextUrl.pathname;

	const publicApiRoutes = ["/api/login", "/api/signup", "/api/contests/"];

	if (
		path.startsWith("/api/") &&
		publicApiRoutes.some((route) => path.startsWith(route))
	) {
		console.log("Skipping middleware for public API route:", path);
		return NextResponse.next();
	}

	const publicPaths = ["/_next/static", "/_next/image", "/favicon.ico"];

	// Check if path is public and should be allowed without redirects
	if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
		return NextResponse.next();
	}

	// For protected API routes, you can add authentication logic here
	if (path.startsWith("/api/")) {
		// Add logic for protected API routes if needed
		console.log("Processing protected API route:", path);
		// For now, let them through - you can add auth logic later
		return NextResponse.next();
	}

	try {
		const cookieStore = await cookies();
		const cookieValue = cookieStore.get("session")?.value;

		// If no session cookie exists, redirect to login except for specified paths
		if (!cookieValue) {
			// If already on login page or other public path, don't redirect
			if (path === "/" || path === "/login" || path === "/signup") {
				return NextResponse.next();
			}
			console.log("No session, redirecting to login from:", path);
			return NextResponse.redirect(new URL("/api/login", req.url));
		}

		const session = await decrypt(cookieValue);

		// If session is invalid or expired, redirect to login
		if (!session?.userId) {
			console.log("Invalid session, redirecting to login from:", path);
			return NextResponse.redirect(new URL("/api/login", req.url));
		}

		// Handle password change requirements
		const needsPasswordChange = session.passwordChanged === false;

		// Only redirect to onboarding if user needs password change and isn't already there
		if (needsPasswordChange) {
			if (path !== "/onboarding") {
				console.log(
					"Password change needed, redirecting to onboarding from:",
					path
				);
				return NextResponse.redirect(new URL("/onboarding", req.url));
			}
			// If they're already on the onboarding page, let them proceed
			return NextResponse.next();
		}

		// If user has changed password but is on onboarding page, redirect to appropriate page
		if (!needsPasswordChange && path === "/onboarding") {
			if (session.role === "admin") {
				return NextResponse.redirect(new URL("/admin", req.url));
			} else {
				return NextResponse.redirect(new URL("/problems", req.url));
			}
		}

		// Check role-specific routes
		const isAdminRoute = path.startsWith("/admin");
		const isUserRoute = path.startsWith("/user");
		const commonRoutePrefixes = ["/contest", "/problems"];
		const isCommonRoute = commonRoutePrefixes.some((prefix) =>
			path.startsWith(prefix)
		);

		// If admin is trying to access non-admin/non-common routes, redirect to admin
		if (session.role === "admin" && !isAdminRoute && !isCommonRoute) {
			console.log(
				"Admin accessing non-admin route, redirecting to admin from:",
				path
			);
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		// If regular user tries to access admin routes, redirect to problems
		if (session.role !== "admin" && isAdminRoute) {
			console.log(
				"Non-admin trying to access admin route, redirecting to problems from:",
				path
			);
			return NextResponse.redirect(new URL("/problems", req.url));
		}

		console.log("User authorized for route:", path);
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/api/login", req.url));
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
	],
};
