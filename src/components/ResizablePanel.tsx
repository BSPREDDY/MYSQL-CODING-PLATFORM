"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, GripHorizontal } from "lucide-react";

interface ResizablePanelProps {
	direction: "horizontal" | "vertical";
	defaultSize?: number;
	minSize?: number;
	maxSize?: number;
	className?: string;
	handleClassName?: string;
	children: React.ReactNode;
	onResize?: (size: number) => void;
}

export function ResizablePanel({
	direction = "horizontal",
	defaultSize = 50,
	minSize = 20,
	maxSize = 80,
	className,
	handleClassName,
	children,
	onResize,
}: ResizablePanelProps) {
	const [size, setSize] = useState(defaultSize);
	const [isResizing, setIsResizing] = useState(false);
	const resizeHandleRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const startResizing = (
		e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		e.preventDefault();
		setIsResizing(true);
	};

	useEffect(() => {
		const handleResize = (e: MouseEvent | TouchEvent) => {
			if (!isResizing || !containerRef.current) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const clientPosition = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientPositionY = "touches" in e ? e.touches[0].clientY : e.clientY;

			let newSize;
			if (direction === "horizontal") {
				const containerWidth = containerRect.width;
				const position = clientPosition - containerRect.left;
				newSize = (position / containerWidth) * 100;
			} else {
				const containerHeight = containerRect.height;
				const position = clientPositionY - containerRect.top;
				newSize = (position / containerHeight) * 100;
			}

			// Clamp the size between min and max
			newSize = Math.max(minSize, Math.min(maxSize, newSize));

			setSize(newSize);
			onResize?.(newSize);
		};

		const stopResizing = () => {
			setIsResizing(false);
		};

		if (isResizing) {
			document.addEventListener("mousemove", handleResize);
			document.addEventListener("touchmove", handleResize);
			document.addEventListener("mouseup", stopResizing);
			document.addEventListener("touchend", stopResizing);

			// Add a cursor style to the document during resizing
			if (direction === "horizontal") {
				document.body.style.cursor = "col-resize";
			} else {
				document.body.style.cursor = "row-resize";
			}
		} else {
			// Reset cursor on stop resizing
			document.body.style.cursor = "";
		}

		return () => {
			document.removeEventListener("mousemove", handleResize);
			document.removeEventListener("touchmove", handleResize);
			document.removeEventListener("mouseup", stopResizing);
			document.removeEventListener("touchend", stopResizing);
			document.body.style.cursor = "";
		};
	}, [isResizing, minSize, maxSize, direction, onResize]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative flex",
				direction === "horizontal" ? "flex-row" : "flex-col",
				className
			)}
		>
			<div
				style={{
					[direction === "horizontal" ? "width" : "height"]: `${size}%`,
					transition: isResizing ? "none" : "all 50ms ease-out",
				}}
				className="overflow-auto"
			>
				{Array.isArray(children) ? children[0] : children}
			</div>
			<div
				ref={resizeHandleRef}
				onMouseDown={startResizing}
				onTouchStart={startResizing}
				className={cn(
					"flex items-center justify-center",
					direction === "horizontal"
						? "cursor-col-resize w-4 hover:bg-blue-100 active:bg-blue-200 transition-colors z-10"
						: "cursor-row-resize h-4 hover:bg-blue-100 active:bg-blue-200 transition-colors z-10",
					isResizing && "bg-blue-200",
					handleClassName
				)}
			>
				{direction === "horizontal" ? (
					<div className="flex items-center justify-center h-16 w-full">
						<GripVertical className="h-4 w-4 text-zinc-500" />
					</div>
				) : (
					<div className="flex items-center justify-center w-16 h-full">
						<GripHorizontal className="h-4 w-4 text-zinc-500" />
					</div>
				)}
			</div>
			<div
				style={{
					[direction === "horizontal" ? "width" : "height"]: `${100 - size}%`,
					transition: isResizing ? "none" : "all 50ms ease-out",
				}}
				className="overflow-auto"
			>
				{Array.isArray(children) ? children[1] : null}
			</div>
		</div>
	);
}
