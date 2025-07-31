"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	updateContestSecuritySettings,
	getLockedOutUsers,
} from "@/app/actions/contestSecurity";
import { useToast } from "@/hooks/use-toast";
import { LockedOutUsersTable } from "./LockedOutUsersTable";
import { Loader2 } from "lucide-react";

interface ContestSecuritySettingsProps {
	contestId: string;
	initialFullScreenRequired: boolean;
}

export function ContestSecuritySettings({
	contestId,
	initialFullScreenRequired,
}: ContestSecuritySettingsProps) {
	const [fullScreenRequired, setFullScreenRequired] = useState(
		initialFullScreenRequired
	);
	const [isSaving, setIsSaving] = useState(false);
	const [lockedOutUsers, setLockedOutUsers] = useState<any[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(true);
	const { toast } = useToast();

	// Load locked out users
	const loadLockedOutUsers = async () => {
		setIsLoadingUsers(true);
		try {
			const result = await getLockedOutUsers(contestId);
			if (result.success) {
				setLockedOutUsers(result.data || []);
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to load locked out users",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error loading locked out users:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoadingUsers(false);
		}
	};

	// Load locked out users on mount and set up polling
	useEffect(() => {
		loadLockedOutUsers();

		// Poll for locked out users every 5 seconds
		const intervalId = setInterval(() => {
			loadLockedOutUsers();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [contestId]);

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			const result = await updateContestSecuritySettings(
				contestId,
				fullScreenRequired
			);
			if (result.success) {
				toast({
					title: "Settings Saved",
					description: "Contest security settings have been updated.",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to save settings",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Contest Security Settings</CardTitle>
					<CardDescription>
						Configure security settings for this contest
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="fullscreen-required">
									Require Full Screen Mode
								</Label>
								<p className="text-sm text-muted-foreground">
									When enabled, participants must use full screen mode during
									the contest
								</p>
							</div>
							<Switch
								id="fullscreen-required"
								checked={fullScreenRequired}
								onCheckedChange={setFullScreenRequired}
							/>
						</div>

						<Button onClick={handleSaveSettings} disabled={isSaving}>
							{isSaving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Settings"
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Locked Out Users</CardTitle>
					<CardDescription>
						Users who have been locked out of this contest due to security
						violations
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingUsers ? (
						<div className="flex justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : (
						<LockedOutUsersTable users={lockedOutUsers} contestId={contestId} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
