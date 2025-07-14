// import { type NextRequest, NextResponse } from "next/server";
// import { decrypt } from "@/app/actions/session";
// import { cookies } from "next/headers";

// export default async function middleware(req: NextRequest) {
// 	console.log("Middleware running");
// 	const path = req.nextUrl.pathname;

// 	// Public paths that should always be accessible without redirects
// 	const publicPaths = [
// 		"/api/login",
// 		"/_next/static",
// 		"/_next/image",
// 		"/favicon.ico",
// 		"/api/login",
// 		"/api/signup",
// 	];

// 	// Check if path is public and should be allowed without redirects
// 	if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
// 		return NextResponse.next();
// 	}

// 	try {
// 		const cookieStore = await cookies();
// 		const cookieValue = cookieStore.get("session")?.value;

// 		// If no session cookie exists, redirect to login except for specified paths
// 		if (!cookieValue) {
// 			// If already on login page or other public path, don't redirect
// 			if (path === "/" || path === "/login" || path === "/signup") {
// 				return NextResponse.next();
// 			}
// 			return NextResponse.redirect(new URL("/api/login", req.url));
// 		}

// 		const session = await decrypt(cookieValue);

// 		// If session is invalid or expired, redirect to login
// 		if (!session?.userId) {
// 			return NextResponse.redirect(new URL("/api/login", req.url));
// 		}

// 		// Handle password change requirements
// 		const needsPasswordChange = session.passwordChanged === false;

// 		// Only redirect to onboarding if user needs password change and isn't already there
// 		if (needsPasswordChange) {
// 			if (path !== "/onboarding") {
// 				return NextResponse.redirect(new URL("/onboarding", req.url));
// 			}
// 			// If they're already on the onboarding page, let them proceed
// 			return NextResponse.next();
// 		}

// 		// If user has changed password but is on onboarding page, redirect to appropriate page
// 		if (!needsPasswordChange && path === "/onboarding") {
// 			if (session.role === "admin") {
// 				return NextResponse.redirect(new URL("/admin", req.url));
// 			} else {
// 				return NextResponse.redirect(new URL("/problems", req.url));
// 			}
// 		}

// 		// Check role-specific routes
// 		const isAdminRoute = path.startsWith("/admin");
// 		const isUserRoute = path.startsWith("/user");
// 		const commonRoutePrefixes = ["/contest", "/problems"];
// 		const isCommonRoute = commonRoutePrefixes.some((prefix) =>
// 			path.startsWith(prefix)
// 		);

// 		// If admin is trying to access non-admin/non-common routes, redirect to admin
// 		if (session.role === "admin" && !isAdminRoute && !isCommonRoute) {
// 			return NextResponse.redirect(new URL("/admin", req.url));
// 		}

// 		// If regular user tries to access admin routes, redirect to problems
// 		if (session.role !== "admin" && isAdminRoute) {
// 			return NextResponse.redirect(new URL("/problems", req.url));
// 		}

// 		// If we reach here, the user is authenticated and authorized for this route
// 		return NextResponse.next();
// 	} catch (error) {
// 		console.error("Middleware error:", error);
// 		// In case of any error processing the session, redirect to login
// 		return NextResponse.redirect(new URL("/api/login", req.url));
// 	}
// }

// export const config = {
// 	matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
// };

import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/actions/session";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
	console.log("Middleware running for:", req.nextUrl.pathname);
	const path = req.nextUrl.pathname;

	const publicApiRoutes = ["/api/login", "/api/signup", "/api/contests/"];

	// Skip middleware for public API routes
	if (
		path.startsWith("/api/") &&
		publicApiRoutes.some((route) => path.startsWith(route))
	) {
		console.log("Skipping middleware for public API route:", path);
		return NextResponse.next();
	}

	// Public paths that should always be accessible without redirects
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

		// If we reach here, the user is authenticated and authorized for this route
		console.log("User authorized for route:", path);
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		// In case of any error processing the session, redirect to login
		return NextResponse.redirect(new URL("/api/login", req.url));
	}
}

export const config = {
	// Include API routes but we'll handle them selectively in the middleware
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
	],
};
// // import { NextRequest, NextResponse } from "next/server";
// // import { decrypt } from "@/app/actions/session";
// // import { cookies } from "next/headers";

// // export default async function middleware(req: NextRequest) {
// // 	console.log("Middleware running");
// // 	const path = req.nextUrl.pathname;
// // 	const cookieValue = (await cookies()).get("session")?.value;
// // 	const session = await decrypt(cookieValue);

// // 	// Check if the route is protected by verifying if it starts with "/admin" or "/user"
// // 	const isAdminRoute = path.startsWith("/admin");
// // 	const isUserRoute = path.startsWith("/user");
// // 	const isProtectedRoute = isAdminRoute || isUserRoute;

// // 	// Define common routes that both admin and regular users can access
// // 	const commonRoutePrefixes = ["/contest", "/problems"];
// // 	const isCommonRoute = commonRoutePrefixes.some((prefix) =>
// // 		path.startsWith(prefix)
// // 	);

// // 	// If the user isn't authenticated, redirect to the login page
// // 	if (isProtectedRoute && !session?.userId) {
// // 		return NextResponse.redirect(new URL("/api/login", req.nextUrl));
// // 	}

// // 	// Enforce role-specific routes:
// // 	// If an authenticated admin is accessing a non-admin and non-common route, redirect them to admin.
// // 	if (
// // 		session?.userId &&
// // 		session?.role === "admin" &&
// // 		!isAdminRoute &&
// // 		!isCommonRoute
// // 	) {
// // 		return NextResponse.redirect(new URL("/admin", req.nextUrl));
// // 	}

// // 	// Uncommenting below if you want to enforce user role restrictions similarly
// // 	// if (session?.userId && session?.role === "user" && !isUserRoute && !isCommonRoute) {
// // 	// 	return NextResponse.redirect(new URL("/user", req.nextUrl));
// // 	// }

// // 	return NextResponse.next();
// // }

// // export const config = {
// // 	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// // };
