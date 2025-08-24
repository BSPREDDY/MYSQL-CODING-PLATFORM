import { Button } from "@/components/ui/button";

import Link from "next/link";

import { Contests } from "@/components/Contests";
import { JSX } from "react";
export default function Page(): JSX.Element {
	return (
		<main>
			<Link href="/admin/contests/create">
				<Button>Create Contest</Button>
			</Link>
			<Contests />
		</main>
	);
}

export const dynamic = "force-dynamic";
