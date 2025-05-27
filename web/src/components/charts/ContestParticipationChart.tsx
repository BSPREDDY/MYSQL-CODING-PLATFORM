"use client";
import { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { getContestParticipationData } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

type ChartData = {
	name: string;
	participants: number;
};

export function ContestParticipationChart({
	detailed = false,
}: {
	detailed?: boolean;
}) {
	const [data, setData] = useState<ChartData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const result = await getContestParticipationData();

				if (result.success && result.data) {
					setData(result.data);
				} else {
					setError(result.error || "Failed to load data");
				}
			} catch (err) {
				setError("An unexpected error occurred");
				console.error("Error fetching contest participation data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

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
				<p>No data available</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={data}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 10,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="participants" name="Participants" fill="#8884d8" />
			</BarChart>
		</ResponsiveContainer>
	);
}
