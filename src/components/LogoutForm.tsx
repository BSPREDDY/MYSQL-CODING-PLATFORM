// "use server";

// import { Button } from "@/components/ui/button";
// import { logout } from "@/app/actions/auth";

// const LogoutForm = () => {
// 	return (
// 		<form action={logout}>
// 			<Button type="submit" variant="destructive">
// 				Logout
// 			</Button>
// 		</form>
// 	);
// };

// export default LogoutForm;
// "use client";

// import { Button } from "@/components/ui/button";
// import { logout } from "@/app/actions/auth";

// const LogoutForm = () => {
// 	return (
// 		<form action={logout}>
// 			<Button type="submit" variant="ghost" size="sm">
// 				Logout
// 			</Button>
// 		</form>
// 	);
// };

// export default LogoutForm;

//client side logout
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutForm() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const result = await logout();
			if (result.success) {
				router.push("/");
				router.refresh();
			}
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<Button
			variant="ghost"
			className="w-full justify-start text-muted-foreground hover:text-foreground"
			onClick={handleLogout}
		>
			<LogOut className="mr-2 h-4 w-4" />
			Logout
		</Button>
	);
}

export default LogoutForm;
