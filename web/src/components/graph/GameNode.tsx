import NodeCard from "@/components/graph/NodeCard";
import { Badge } from "@/components/ui/badge";
import type { GameNodeData } from "@/lib/graph";
import type { Node, NodeProps } from "@xyflow/react";
import { Gamepad2Icon } from "lucide-react";

export default function GameNode({
	data,
}: NodeProps<Node<GameNodeData, "game">>) {
	return (
		<NodeCard
			to={`/${data.placeId}`}
			title={`${data.name} (${data.placeId})`}
			handle="source"
			className="w-64"
		>
			<Gamepad2Icon className="size-4 shrink-0 text-muted-foreground" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{data.name}</p>
				<p className="truncate text-xs text-muted-foreground tabular-nums">
					{data.placeId}
				</p>
			</div>
			<Badge variant="secondary" className="shrink-0 tabular-nums">
				{data.servers}
			</Badge>
		</NodeCard>
	);
}
