
import Problems from "@/app/problems/page";
import { JSX } from "react";
export default function Page(): JSX.Element {
  return (
    <main>
      <Problems/>
    </main>
  );
}

export const dynamic = "force-dynamic";
