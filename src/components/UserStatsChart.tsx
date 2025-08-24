"use client";
import { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { getUserSubmissionHistory } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

type ChartData = {
	month: string;
	submissions: number;
	accepted: number;
};

export function UserStatsChart({ userId }: { userId: string }) {
	const [data, setData] = useState<ChartData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				// Check if userId is valid before making the request
				if (!userId) {
					throw new Error("Invalid user ID");
				}

				const result = await getUserSubmissionHistory(userId);

				if (result.success && result.data) {
					setData(result.data);
				} else {
					setError(result.error || "Failed to load data");
				}
			} catch (err) {
				setError("An unexpected error occurred");
				console.error("Error fetching user stats data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [userId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full text-destructive">
				<p>Error: {error}</p>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground">
				<p>No submission data available for this user</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				data={data}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 10,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="submissions"
					name="Total Submissions"
					stroke="#8884d8"
					activeDot={{ r: 8 }}
				/>
				<Line
					type="monotone"
					dataKey="accepted"
					name="Accepted Solutions"
					stroke="#82ca9d"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
