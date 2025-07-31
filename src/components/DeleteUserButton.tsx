"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { deleteUser } from "@/app/actions/admin";

interface DeleteUserButtonProps {
	userId: string;
	userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const result = await deleteUser(userId);

			if (result.success) {
				toast.success("User deleted", {
					description: `${userName} has been permanently deleted.`,
				});
				router.push("/admin/users");
			} else {
				toast.error("Failed to delete user", {
					description: result.error || "An unknown error occurred.",
				});
				setIsOpen(false);
			}
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred.",
			});
			setIsOpen(false);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<Button
				variant="destructive"
				className="w-full"
				onClick={() => setIsOpen(true)}
			>
				<Trash2 className="mr-2 h-4 w-4" />
				Delete User
			</Button>

			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user account for <span className="font-semibold">{userName}</span>{" "}
							and remove all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDelete();
							}}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete User"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
