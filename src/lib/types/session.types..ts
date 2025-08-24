// import { userRole } from "@/db-drizzle/schema";

// export type SessionPayload = {
// 	userId: string | number;
// 	email: string;
// 	role: string;
// 	expiresAt?: Date;
// 	name?: string;
// };
export interface SessionPayload {
	userId: string;
	role: string;
	email: string;
	name?: string;
	passwordChanged?: boolean;
	expiresAt?: Date;
}
