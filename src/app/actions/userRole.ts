"use server";

import { verifySession } from "./session";

export async function checkIsAdmin() {
	try {
		const session = await verifySession();
		return {
			success: true,
			isAdmin: session.role === "admin",
		};
	} catch (error) {
		console.error("Error checking admin status:", error);
		return {
			success: false,
			isAdmin: false,
			error: "Failed to verify user role",
		};
	}
}
