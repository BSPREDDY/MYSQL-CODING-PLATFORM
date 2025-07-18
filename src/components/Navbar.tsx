// import { verifySession } from "@/app/actions/session";
// import Link from "next/link";
// import {
// 	NavigationMenu,
// 	NavigationMenuItem,
// 	NavigationMenuLink,
// 	NavigationMenuList,
// 	navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import { Button } from "./ui/button";
// import LogoutForm from "./LogoutForm";

// export default async function Navbar() {
// 	let isAuthenticated = false;
// 	try {
// 		const session = await verifySession();
// 		// console.log("nav", session);
// 		isAuthenticated = session?.isAuth || false;
// 	} catch (err) {
// 		isAuthenticated = false;
// 		console.log(err);
// 	}

// 	return (
// 		<div className="w-full bg-gray-100 border-b shadow-sm">
// 			<div className="container mx-auto flex items-center justify-between py-4 px-6">
// 				<div>
// 					<NavigationMenu>
// 						<NavigationMenuList>
// 							<NavigationMenuItem>
// 								<Link href="/" legacyBehavior passHref>
// 									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
// 										Online Sql Editor
// 									</NavigationMenuLink>
// 								</Link>
// 							</NavigationMenuItem>
// 						</NavigationMenuList>
// 					</NavigationMenu>
// 				</div>

// 				<div className="flex space-x-4">
// 					{isAuthenticated ? (
// 						<LogoutForm />
// 					) : (
// 						<>
// 							<Link href="/api/login">
// 								<Button variant="outline">Login</Button>
// 							</Link>
// 							<Link href="/api/signup">
// 								<Button variant="outline">Signup</Button>
// 							</Link>
// 						</>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import { verifySession } from "@/app/actions/session";
import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import LogoutForm from "./LogoutForm";
import { Home, User, Database } from "lucide-react";

export default async function Navbar() {
	let isAuthenticated = false;
	let userRole = null;

	try {
		const session = await verifySession();
		isAuthenticated = session?.isAuth || false;
		userRole = session?.role || null;
	} catch (err) {
		isAuthenticated = false;
		console.log(err);
	}

	// Determine home link based on user role
	const homeLink = userRole === "admin" ? "/admin" : "/user/profile";

	return (
		<div className="w-full bg-gray-100 border-b shadow-sm z-20 relative">
			<div className="container mx-auto flex items-center justify-between py-4 px-6">
				<div className="flex items-center space-x-4">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href={homeLink} legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										<Database className="mr-2 h-4 w-4" />
										SQL Platform
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>

							{/* {isAuthenticated && (
								<NavigationMenuItem>
									<Link href={homeLink} legacyBehavior passHref>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											<Home className="mr-2 h-4 w-4" />
											Dashboard
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							)} */}

							{/* {isAuthenticated && (
								<NavigationMenuItem>
									<Link href="/user/profile" legacyBehavior passHref>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											<User className="mr-2 h-4 w-4" />
											Profile
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							)} */}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="flex space-x-4">
					{isAuthenticated ? (
						<LogoutForm />
					) : (
						<>
							<Link href="/api/login">
								<Button variant="outline">Login</Button>
							</Link>
							<Link href="/api/signup">
								<Button variant="outline">Signup</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
