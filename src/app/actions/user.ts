"use server";

import { verifySession } from "./session";

export type UserData = {
	name: string;
	email: string;
	role: string;
	userId: string;
};

export async function getCurrentUser(): Promise<{
	success: boolean;
	user?: UserData;
	error?: string;
}> {
	try {
		const session = await verifySession();

		if (!session.isAuth) {
			return {
				success: false,
				error: "Not authenticated",
			};
		}

		return {
			success: true,
			user: {
				name: session.name || " User",
				email: session.email || "User@example.com",
				role: session.role || "admin",
				userId: String(session.userId || ""),
			},
		};
	} catch (error) {
		console.error("Error fetching user data:", error);
		return {
			success: false,
			error: "Failed to fetch user data",
		};
	}
}
