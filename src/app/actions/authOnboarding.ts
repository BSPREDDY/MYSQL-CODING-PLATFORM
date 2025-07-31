"use server";

import { appDb } from "@/db/postgres";
import { users } from "../../db/postgres/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { decrypt, createSession } from "./session";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for password change
const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type PasswordChangeResponse = {
	success: boolean;
	message: string;
	errors?: Record<string, string[]>;
};

export async function changePassword(
	prevState: PasswordChangeResponse | null,
	formData: FormData
): Promise<PasswordChangeResponse> {
	// Validate form data
	const validatedFields = passwordChangeSchema.safeParse({
		currentPassword: formData.get("currentPassword"),
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid form data",
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { currentPassword, newPassword } = validatedFields.data;

	// Get current user from session
	const cookieStore = await cookies();
	const cookieValue = cookieStore.get("session")?.value;

	if (!cookieValue) {
		return {
			success: false,
			message: "You must be logged in to change your password",
		};
	}

	const session = await decrypt(cookieValue).catch(() => null);

	if (!session || !session.userId) {
		return {
			success: false,
			message: "Invalid session. Please log in again.",
		};
	}

	try {
		// Get user from database
		const user = await appDb.query.users.findFirst({
			where: eq(users.id, session.userId),
		});

		if (!user) {
			return {
				success: false,
				message: "User not found",
			};
		}

		// Verify current password
		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!isPasswordValid) {
			return {
				success: false,
				message: "Current password is incorrect",
			};
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update user password
		await appDb
			.update(users)
			.set({
				password: hashedPassword,
				passwordChanged: true,
			})
			.where(eq(users.id, session.userId));

		// Clear session to log the user out
		cookieStore.delete("session");

		return {
			success: true,
			message: "Password changed successfully",
		};
	} catch (error) {
		console.error("Error in changePassword:", error);
		return {
			success: false,
			message: "An unexpected error occurred while changing password",
		};
	}
}

export async function checkPasswordChanged() {
	const cookieStore = await cookies();
	const cookieValue = cookieStore.get("session")?.value;

	if (!cookieValue) {
		return { passwordChanged: true }; // Default to true if no cookie
	}

	const session = await decrypt(cookieValue).catch(() => null);

	if (!session || !session.userId) {
		return { passwordChanged: true }; // Default to true if no valid session
	}

	try {
		// Get user from database to get the latest passwordChanged value
		const user = await appDb.query.users.findFirst({
			where: eq(users.id, session.userId),
		});

		return { passwordChanged: user?.passwordChanged ?? true };
	} catch (error) {
		console.error("Error in checkPasswordChanged:", error);
		return { passwordChanged: true }; // Default to true on error
	}
}

export async function redirectAfterPasswordChange() {
	const cookieStore = await cookies();
	const cookieValue = cookieStore.get("session")?.value;

	if (!cookieValue) {
		return redirect("/api/login");
	}

	const session = await decrypt(cookieValue).catch(() => null);

	if (!session) {
		return redirect("/api/login");
	}

	if (session.role === "admin") {
		return redirect("/admin");
	} else {
		return redirect("/problems");
	}
}
