import { redirect } from "next/navigation";
import { verifySession } from "@/app/actions/session";

export default async function Home() {
	// Check if user is authenticated
	let isAuthenticated = false;
	let userRole = null;

	try {
		const session = await verifySession();
		isAuthenticated = session?.isAuth || false;
		userRole = session.role || null;
	} catch (err) {
		console.error("Session verification error:", err);
	}

	// Redirect based on authentication status
	if (!isAuthenticated) {
		redirect("/api/login");
	} else if (userRole === "admin") {
		redirect("/admin");
	} else {
		redirect("/user/profile");
	}

	return null;
}
