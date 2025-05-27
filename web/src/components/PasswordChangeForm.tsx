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
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const formData = new FormData(e.currentTarget);
			const result = await changePassword(formData);

			if (result.success) {
				// Redirect to home page
				router.push("/");
			} else {
				setError(result.message);
			}
		} catch (err) {
			console.error("Error changing password:", err);
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
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

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
// import { changePassword } from "@/app/actions/authOnboarding"
// import { useRouter } from "next/navigation"

// export function PasswordChangeForm() {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setSuccess(null)

//     try {
// const formData = new FormData(e.currentTarget);

// const result = await changePassword(null, formData);


//       if (result.success) {
//         setSuccess("Your password has been successfully updated.")
//         setError(null)
//         // Clear the form
//         e.currentTarget.reset()
//       } else {
//         setError(result.message || "Failed to change password")
//         setSuccess(null)
//       }
//     } catch (err: any) {
//       console.error("Error changing password:", err)
//       setError(err?.message || "An unexpected error occurred")
//       setSuccess(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <Alert variant="destructive" className="border-red-200 bg-red-50">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert className="border-green-200 bg-green-50">
//           <CheckCircle className="h-4 w-4 text-green-600" />
//           <AlertTitle className="text-green-800">Success</AlertTitle>
//           <AlertDescription className="text-green-700">{success}</AlertDescription>
//         </Alert>
//       )}

//       <div className="space-y-2">
//         <Label htmlFor="currentPassword" className="text-sm font-medium">
//           Current Password
//         </Label>
//         <Input
//           id="currentPassword"
//           name="currentPassword"
//           type="password"
//           required
//           placeholder="Enter your current password"
//           className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="newPassword" className="text-sm font-medium">
//           New Password
//         </Label>
//         <Input
//           id="newPassword"
//           name="newPassword"
//           type="password"
//           required
//           placeholder="Enter your new password"
//           className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
//         />
//         <p className="text-sm text-muted-foreground">Password must be at least 8 characters</p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="confirmPassword" className="text-sm font-medium">
//           Confirm New Password
//         </Label>
//         <Input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           required
//           placeholder="Confirm your new password"
//           className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
//         />
//       </div>

//       <Button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
//         disabled={loading}
//       >
//         {loading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Updating Password...
//           </>
//         ) : (
//           "Update Password"
//         )}
//       </Button>
//     </form>
//   )
// }


