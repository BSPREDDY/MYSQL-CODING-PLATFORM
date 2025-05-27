import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/actions/session";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
	console.log("Middleware running");
	const path = req.nextUrl.pathname;

	// Public paths that should always be accessible without redirects
	const publicPaths = [
		"/api/login",
		"/_next/static",
		"/_next/image",
		"/favicon.ico",
		"/api/login",
		"/api/signup",
	];

	// Check if path is public and should be allowed without redirects
	if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
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
			return NextResponse.redirect(new URL("/api/login", req.url));
		}

		const session = await decrypt(cookieValue);

		// If session is invalid or expired, redirect to login
		if (!session?.userId) {
			return NextResponse.redirect(new URL("/api/login", req.url));
		}

		// Handle password change requirements
		const needsPasswordChange = session.passwordChanged === false;

		// Only redirect to onboarding if user needs password change and isn't already there
		if (needsPasswordChange) {
			if (path !== "/onboarding") {
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
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		// If regular user tries to access admin routes, redirect to problems
		if (session.role !== "admin" && isAdminRoute) {
			return NextResponse.redirect(new URL("/problems", req.url));
		}

		// If we reach here, the user is authenticated and authorized for this route
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		// In case of any error processing the session, redirect to login
		return NextResponse.redirect(new URL("/api/login", req.url));
	}
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|.\\.png$).)"],
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
