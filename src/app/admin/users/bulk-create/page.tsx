import { BulkUserUpload } from "@/components/BulkUserUpload";
import { bulkCreateUsers } from "@/app/actions/bulkUser";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function BulkCreateUsersPage() {
	return (
		<div className="container mx-auto py-6">
			<h1 className="text-3xl font-bold mb-6">Bulk Create Users</h1>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Instructions</CardTitle>
						<CardDescription>
							Upload an Excel file with user details to create multiple users at
							once.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-5 space-y-2">
							<li>
								The Excel file should have the following columns: name, email,
								regNo (optional), section (optional)
							</li>
							<li>All users will be created with the same default password</li>
							<li>
								Users will be required to change their password on first login
							</li>
							<li>Duplicate emails will be rejected</li>
						</ul>
					</CardContent>
				</Card>

				<BulkUserUpload onUpload={bulkCreateUsers} />
			</div>
		</div>
	);
}
