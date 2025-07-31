"use server";

import { appDb } from "@/db/postgres";
import { users } from "@/db/postgres/schema";
import { hash } from "bcrypt";
import { z } from "zod";
import { sql } from "drizzle-orm";
import * as XLSX from "xlsx";

// Define the schema for user data
const userSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	regNo: z.string().optional(),
	section: z.string().optional(),
});

type UserData = z.infer<typeof userSchema>;

export async function bulkCreateUsers(formData: FormData) {
	try {
		const file = formData.get("file") as File;
		const defaultPassword = formData.get("defaultPassword") as string;

		if (!file || !defaultPassword) {
			return {
				success: false,
				message: "File and default password are required",
			};
		}

		// Validate the default password
		if (!defaultPassword || defaultPassword.length < 6) {
			return {
				success: false,
				message: "Default password must be at least 6 characters",
			};
		}

		// Read the Excel file
		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer, { type: "array" });

		// Get the first worksheet
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];

		// Convert to JSON
		const data = XLSX.utils.sheet_to_json(worksheet);

		// Validate and process each row
		const validatedUsers: UserData[] = [];
		const errors: { row: number; message: string }[] = [];

		data.forEach((row: any, index) => {
			// Normalize field names (case insensitive)
			const normalizedRow = {
				name: row.name || row.Name || row.NAME,
				email: row.email || row.Email || row.EMAIL,
				regNo: row.regno || row.regNo || row.RegNo || row.REGNO || row.REG_NO,
				section: row.sec || row.section || row.Section || row.SECTION,
			};

			const result = userSchema.safeParse(normalizedRow);

			if (result.success) {
				validatedUsers.push(result.data);
			} else {
				errors.push({
					row: index + 2, // +2 because Excel is 1-indexed and we have a header row
					message: result.error.errors
						.map((e) => `${e.path}: ${e.message}`)
						.join(", "),
				});
			}
		});

		// If there are validation errors, return them
		if (errors.length > 0) {
			return {
				success: false,
				message: `Validation errors in ${errors.length} rows`,
				errors,
			};
		}

		// Check for duplicate emails
		const emails = validatedUsers.map((user) => user.email);
		const uniqueEmails = new Set(emails);

		if (uniqueEmails.size !== emails.length) {
			return {
				success: false,
				message: "Duplicate email addresses found in the upload",
			};
		}

		// Check if any of the emails already exist in the database
		const existingEmails = await appDb
			.select({ email: users.email })
			.from(users)
			.where(
				sql`${users.email} IN (${emails
					.map((email) => `'${email.trim()}'`)
					.join(",")})`
			);

		if (existingEmails.length > 0) {
			return {
				success: false,
				message: `The following emails already exist: ${existingEmails
					.map((u) => u.email)
					.join(", ")}`,
			};
		}

		// Hash the default password
		const hashedPassword = await hash(defaultPassword, 10);

		// Create the users in the database
		const result = await appDb.transaction(async (tx) => {
			const createdUsers = [];

			for (const user of validatedUsers) {
				const [createdUser] = await tx
					.insert(users)
					.values({
						name: user.name,
						email: user.email,
						password: hashedPassword,
						role: "user",
						regNo: user.regNo || null,
						section: user.section || null,
						passwordChanged: false, // Mark that the password needs to be changed
					})
					.returning({ id: users.id, email: users.email });

				createdUsers.push(createdUser);
			}

			return createdUsers;
		});

		return {
			success: true,
			message: `Successfully created ${result.length} users`,
			count: result.length,
		};
	} catch (error) {
		console.error("Error creating bulk users:", error);
		return {
			success: false,
			message: "An error occurred while creating users",
		};
	}
}
