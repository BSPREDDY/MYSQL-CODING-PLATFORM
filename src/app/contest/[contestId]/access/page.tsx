import { AccessForm } from "./acess-form";

export default async function ContestAccessPage({
	params,
}: {
	params: Promise<{ contestId: string }>;
}) {
	// Await params before accessing its properties
	const { contestId } = await params;

	// Server component that passes contestId as a prop to the client component
	return <AccessForm contestId={contestId} />;
}
