"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { changePassword } from "@/app/actions/authOnboarding";
import { useRouter } from "next/navigation";

export function PasswordChangeForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<
		string,
		string[]
	> | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setFieldErrors(null);

		try {
			const formData = new FormData(e.currentTarget);
			// Pass null as the prevState parameter since it's required by the server action
			const result = await changePassword(null, formData);

			if (result.success) {
				// Redirect to login page after successful password change
				router.push("/api/login");
			} else {
				setError(result.message);
				if (result.errors) {
					setFieldErrors(result.errors);
				}
			}
		} catch (err) {
			console.error("Error changing password:", err);
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	const getFieldError = (fieldName: string): string | undefined => {
		return fieldErrors?.[fieldName]?.[0];
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="currentPassword">Current Password</Label>
				<Input
					id="currentPassword"
					name="currentPassword"
					type="password"
					required
					placeholder="Enter your current password"
				/>
				{getFieldError("currentPassword") && (
					<p className="text-sm text-destructive">
						{getFieldError("currentPassword")}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="newPassword">New Password</Label>
				<Input
					id="newPassword"
					name="newPassword"
					type="password"
					required
					placeholder="Enter your new password"
				/>
				<p className="text-sm text-muted-foreground">
					Password must be at least 6 characters
				</p>
				{getFieldError("newPassword") && (
					<p className="text-sm text-destructive">
						{getFieldError("newPassword")}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm New Password</Label>
				<Input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					required
					placeholder="Confirm your new password"
				/>
				{getFieldError("confirmPassword") && (
					<p className="text-sm text-destructive">
						{getFieldError("confirmPassword")}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Changing Password...
					</>
				) : (
					"Change Password"
				)}
			</Button>
		</form>
	);
}
