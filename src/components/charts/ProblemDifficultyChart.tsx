"use client";
import { useEffect, useState } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { getProblemDifficultyData } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

type ChartData = {
	name: string;
	value: number;
};

const COLORS = ["#4ade80", "#facc15", "#f87171"];

export function ProblemDifficultyChart() {
	const [data, setData] = useState<ChartData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const result = await getProblemDifficultyData();

				if (result.success && result.data) {
					setData(result.data);
				} else {
					setError(result.error || "Failed to load data");
				}
			} catch (err) {
				setError("An unexpected error occurred");
				console.error("Error fetching problem difficulty data:", err);
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
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					labelLine={false}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
					label={({ name, percent }) =>
						`${name} ${(percent * 100).toFixed(0)}%`
					}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip formatter={(value) => [`${value} problems`, "Count"]} />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
