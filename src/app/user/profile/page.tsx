"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/app/actions/user";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { Loader2 } from "lucide-react";

export default function UserProfilePage() {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUserData() {
			try {
				setIsLoading(true);
				const userResult = await getCurrentUser();
				if (userResult.success && userResult.user) {
					setUser(userResult.user);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container mx-auto py-10">
				<Card>
					<CardHeader>
						<CardTitle>User Profile</CardTitle>
						<CardDescription>User information not available</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
				</TabsList>
				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
							<CardDescription>
								View and manage your account details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
								<Avatar className="h-24 w-24">
									<AvatarFallback className="text-2xl">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="space-y-1 text-center sm:text-left">
									<h3 className="text-2xl font-bold">{user.name}</h3>
									<p className="text-sm text-muted-foreground">{user.role}</p>
								</div>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input id="name" value={user.name} readOnly />
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input id="email" value={user.email} readOnly />
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="regNo">Registration Number</Label>
										<Input
											id="regNo"
											value={user.regNo || "Not provided"}
											readOnly
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="section">Section</Label>
										<Input
											id="section"
											value={user.section || "Not provided"}
											readOnly
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="password">
					<Card>
						<CardHeader>
							<CardTitle>Password</CardTitle>
							<CardDescription>Change your password</CardDescription>
						</CardHeader>
						<CardContent>
							<PasswordChangeForm userId={user.id} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}
