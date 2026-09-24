import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { Link } from "react-router";

export default function NodeCard({
	to,
	title,
	handle,
	className,
	children,
}: {
	to: string;
	title: string;
	handle: "source" | "target";
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<Link
				to={to}
				title={title}
				className={cn(
					"flex items-center gap-3 rounded-xl bg-card px-4 py-3 border transition-colors hover:bg-accent hover:text-accent-foreground",
					className,
				)}
			>
				{children}
			</Link>
			<Handle
				type={handle}
				position={handle === "source" ? Position.Right : Position.Left}
				isConnectable={false}
				className="opacity-0!"
			/>
		</>
	);
}
