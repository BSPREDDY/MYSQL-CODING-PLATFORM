"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteAllUsers } from "@/app/actions/adminUsers";
import { useToast } from "@/hooks/use-toast";

export function DeleteAllUsersButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const result = await deleteAllUsers();

			if (result.success) {
				toast({
					title: "Success",
					description: result.message,
					variant: "default",
				});
			} else {
				toast({
					title: "Error",
					description: result.message || "Failed to delete users",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setIsOpen(false);
		}
	};

	return (
		<>
			<Button
				variant="destructive"
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-2"
			>
				<Trash2 className="h-4 w-4" />
				Delete All Users
			</Button>

			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will permanently delete ALL non-admin users and their
							data from the system. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDelete();
							}}
							disabled={isLoading}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isLoading ? "Deleting..." : "Delete All Users"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
