import { AccessForm } from "./acess-form";

export default async function ContestAccessPage({
	params,
}: {
	params: Promise<{ contestId: string }>;
}) {
	const { contestId } = await params;

	return <AccessForm contestId={contestId} />;
}
