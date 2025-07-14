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
import { getUserGrowthData } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

type ChartData = {
	month: string;
	users: number;
};

export function UserGrowthChart({ detailed = false }: { detailed?: boolean }) {
	const [data, setData] = useState<ChartData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const result = await getUserGrowthData();

				if (result.success && result.data) {
					setData(result.data);
				} else {
					setError(result.error || "Failed to load data");
				}
			} catch (err) {
				setError("An unexpected error occurred");
				console.error("Error fetching user growth data:", err);
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
					dataKey="users"
					name="New Users"
					stroke="#8884d8"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
