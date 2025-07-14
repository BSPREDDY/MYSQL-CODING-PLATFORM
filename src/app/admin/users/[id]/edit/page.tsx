"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getUserById, updateUser } from "@/app/actions/admin";

// Define the form schema
const formSchema = z.object({
	name: z.string().min(3, {
		message: "Name must be at least 3 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().optional(),
	role: z.enum(["user", "admin"], {
		required_error: "Please select a role.",
	}),
	updatePassword: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUserPage({ params }: { params: { id: string } }) {
	const userId = use(params).id;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [updatePassword, setUpdatePassword] = useState(false);

	// Initialize the form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "user",
			updatePassword: false,
		},
	});

	// Load user data
	useEffect(() => {
		async function loadUser() {
			try {
				setIsLoading(true);
				const result = await getUserById(userId);

				if (result.success && result.data) {
					form.reset({
						name: result.data.name,
						email: result.data.email,
						role: result.data.role as "user" | "admin",
						password: "",
						updatePassword: false,
					});
				} else {
					toast.error("Error", {
						description: "Failed to load user data.",
					});
					router.push("/admin/users");
				}
			} catch (error) {
				toast.error("Error", {
					description: "An unexpected error occurred while loading user data.",
				});
				router.push("/admin/users");
			} finally {
				setIsLoading(false);
			}
		}

		loadUser();
	}, [userId, router, form]);

	// Handle form submission
	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true);

			// Only include password if updatePassword is true
			const userData = {
				...values,
				password: values.updatePassword ? values.password : undefined,
			};

			const result = await updateUser(userId, userData);

			if (result.success) {
				toast.success("User updated successfully", {
					description: `${values.name}'s information has been updated.`,
				});
				router.push(`/admin/users/${userId}`);
			} else {
				toast.error("Failed to update user", {
					description: result.error || "An unknown error occurred.",
				});
			}
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link
					href={`/admin/users/${userId}`}
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to User
				</Link>
			</div>

			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
				<p className="text-muted-foreground">
					Update user information and permissions.
				</p>
			</div>

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>User Information</CardTitle>
					<CardDescription>
						Edit the details for this user account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="user@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="updatePassword"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) => {
													field.onChange(checked);
													setUpdatePassword(checked as boolean);
												}}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Update Password</FormLabel>
											<FormDescription>
												Check this box to set a new password for the user.
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							{updatePassword && (
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Enter a new password with at least 6 characters.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>User Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="user">Regular User</SelectItem>
												<SelectItem value="admin">Administrator</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Administrators have full access to the admin dashboard and
											all management features.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end space-x-4">
								<Button
									variant="outline"
									type="button"
									onClick={() => router.push(`/admin/users/${userId}`)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Changes
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
