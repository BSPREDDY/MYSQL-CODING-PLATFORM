"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Loader2,
	Upload,
	FileSpreadsheet,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";
import * as XLSX from "xlsx";

type UserData = {
	name: string;
	email: string;
	regNo: string;
	section: string;
};

type Props = {
	onUpload: (
		formData: FormData
	) => Promise<{ success: boolean; message: string }>;
};

export function BulkUserUpload({ onUpload }: Props) {
	const [users, setUsers] = useState<UserData[]>([]);
	const [defaultPassword, setDefaultPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setError(null);
		setSuccess(null);

		const uploadedFile = acceptedFiles[0];
		if (!uploadedFile) return;

		setFileName(uploadedFile.name);
		setFile(uploadedFile);

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });

				// Get first sheet
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				// Convert to JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet);

				// Validate data structure
				const validatedUsers: UserData[] = [];
				let hasErrors = false;

				jsonData.forEach((row: any, index) => {
					const name = row.name || row.Name;
					const email = row.email || row.Email;
					const regNo = row.regno || row.regNo || row.RegNo || row["Reg No"];
					const section = row.section || row.Section || row.sec || row.Sec;

					if (!name || !email) {
						setError(
							`Row ${index + 1} is missing required fields (name, email)`
						);
						hasErrors = true;
						return;
					}

					validatedUsers.push({
						name,
						email,
						regNo: regNo?.toString() || "",
						section: section?.toString() || "",
					});
				});

				if (!hasErrors) {
					setUsers(validatedUsers);
				}
			} catch (err) {
				console.error("Error parsing Excel file:", err);
				setError(
					"Failed to parse Excel file. Please make sure it's a valid Excel file."
				);
			}
		};

		reader.readAsArrayBuffer(uploadedFile);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
			"application/vnd.ms-excel": [".xls"],
		},
		maxFiles: 1,
	});

	const handleSubmit = async () => {
		if (!file) {
			setError("Please upload a file first");
			return;
		}

		if (!defaultPassword || defaultPassword.length < 6) {
			setError("Please enter a default password (minimum 6 characters)");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			// Create FormData to send the file and password to the server
			const formData = new FormData();
			formData.append("file", file);
			formData.append("defaultPassword", defaultPassword);

			const result = await onUpload(formData);

			if (result.success) {
				setSuccess(result.message);
				// Reset form
				setUsers([]);
				setDefaultPassword("");
				setFileName(null);
				setFile(null);
			} else {
				setError(result.message);
			}
		} catch (err) {
			console.error("Error uploading users:", err);
			setError("An unexpected error occurred while creating users");
		} finally {
			setLoading(false);
		}
	};

	// Generate a sample Excel file for download
	const generateSampleFile = () => {
		const worksheet = XLSX.utils.aoa_to_sheet([
			["name", "email", "regNo", "section"],
			["John Doe", "john@example.com", "12345", "A"],
			["Jane Smith", "jane@example.com", "67890", "B"],
		]);

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");

		XLSX.writeFile(workbook, "sample_users.xlsx");
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Bulk User Upload</CardTitle>
					<CardDescription>
						Upload an Excel file containing user details to create multiple
						users at once.
						<Button
							variant="link"
							onClick={generateSampleFile}
							className="p-0 h-auto font-normal"
						>
							Download sample file
						</Button>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div
						{...getRootProps()}
						className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
							isDragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25"
						}`}
					>
						<input {...getInputProps()} />
						<FileSpreadsheet className="mx-auto h-10 w-10 text-muted-foreground" />
						{fileName ? (
							<p className="mt-2 font-medium">{fileName}</p>
						) : (
							<div className="mt-2">
								<p className="font-medium">
									Drag & drop an Excel file here, or click to select
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Supports .xlsx and .xls files with columns: name, email,
									regNo, section
								</p>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="defaultPassword">Default Password</Label>
						<Input
							id="defaultPassword"
							type="password"
							value={defaultPassword}
							onChange={(e) => setDefaultPassword(e.target.value)}
							placeholder="Enter default password for all users"
						/>
						<p className="text-sm text-muted-foreground">
							Users will be required to change this password on their first
							login.
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						onClick={handleSubmit}
						disabled={users.length === 0 || loading || !defaultPassword}
						className="ml-auto"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Users...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Create {users.length} Users
							</>
						)}
					</Button>
				</CardFooter>
			</Card>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert
					variant="default"
					className="border-green-500 bg-green-50 text-green-700"
				>
					<CheckCircle2 className="h-4 w-4" />
					<AlertTitle>Success</AlertTitle>
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			)}

			{users.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Preview ({users.length} users)</CardTitle>
						<CardDescription>
							Review the users that will be created
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Reg No</TableHead>
										<TableHead>Section</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.slice(0, 5).map((user, index) => (
										<TableRow key={index}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.regNo || "N/A"}</TableCell>
											<TableCell>{user.section || "N/A"}</TableCell>
										</TableRow>
									))}
									{users.length > 5 && (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-center text-muted-foreground"
											>
												... and {users.length - 5} more users
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
