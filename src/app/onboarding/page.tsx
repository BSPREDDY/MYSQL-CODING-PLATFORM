"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
	changePassword,
	redirectAfterPasswordChange,
} from "@/app/actions/authOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
	const [state, formAction] = useActionState(changePassword, null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	// Use effect to handle redirect after successful response
	useEffect(() => {
		if (state?.success) {
			redirectAfterPasswordChange().catch((error) => {
				console.error("Failed to redirect:", error);
			});
		}
	}, [state?.success]);

	const handleSubmit = async (formData: FormData) => {
		setIsSubmitting(true);
		await formAction(formData);
		setIsSubmitting(false);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Welcome! Change Your Password</CardTitle>
					<CardDescription>
						For security reasons, you need to change your password before
						continuing.
					</CardDescription>
				</CardHeader>
				<form action={handleSubmit}>
					<CardContent className="space-y-4">
						{state?.message && (
							<Alert variant={state.success ? "default" : "destructive"}>
								<AlertDescription>{state.message}</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<Input
								id="currentPassword"
								name="currentPassword"
								type="password"
								required
								autoComplete="current-password"
							/>
							{state?.errors?.currentPassword && (
								<p className="text-sm text-red-500">
									{state.errors.currentPassword[0]}
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
								autoComplete="new-password"
							/>
							{state?.errors?.newPassword && (
								<p className="text-sm text-red-500">
									{state.errors.newPassword[0]}
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
								autoComplete="new-password"
							/>
							{state?.errors?.confirmPassword && (
								<p className="text-sm text-red-500">
									{state.errors.confirmPassword[0]}
								</p>
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Changing Password..." : "Change Password"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
