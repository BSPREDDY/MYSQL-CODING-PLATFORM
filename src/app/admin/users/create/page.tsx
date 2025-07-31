"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { createUser } from "@/app/actions/admin";

// Define the form schema
const formSchema = z.object({
	name: z.string().min(3, {
		message: "Name must be at least 3 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
	role: z.enum(["user", "admin"], {
		required_error: "Please select a role.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateUserPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize the form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "user",
		},
	});

	// Handle form submission
	async function onSubmit(values: FormValues) {
		try {
			setIsSubmitting(true);

			const result = await createUser(values);

			if (result.success) {
				toast.success("User created successfully", {
					description: `${values.name} has been added as a ${values.role}.`,
				});
				router.push("/admin/users");
			} else {
				toast.error("Failed to create user", {
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

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link
					href="/admin/users"
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Users
				</Link>
			</div>

			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
				<p className="text-muted-foreground">
					Add a new user to the platform with specific permissions.
				</p>
			</div>

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>User Information</CardTitle>
					<CardDescription>
						Enter the details for the new user account.
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
										<FormDescription>
											The user's full name as it will appear on their profile.
										</FormDescription>
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
										<FormDescription>
											The email address will be used for login and
											notifications.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Create a secure password with at least 6 characters. The
											user can change this later.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

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
									onClick={() => router.push("/admin/users")}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create User
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
