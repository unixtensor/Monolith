import NodeCard from "@/components/graph/NodeCard";
import type { ServerNodeData } from "@/lib/graph";
import type { Node, NodeProps } from "@xyflow/react";
import { HammerIcon, ServerIcon } from "lucide-react";

export default function ServerNode({
	data,
}: NodeProps<Node<ServerNodeData, "server">>) {
	return (
		<NodeCard
			to={`/${data.placeId}/${data.jobId}`}
			title={data.jobId}
			handle="target"
			className="w-fit"
		>
			{data.studio ? (
				<HammerIcon className="size-4 text-studio" />
			) : (
				<ServerIcon className="size-4 text-muted-foreground" />
			)}
			<p className="flex-1 font-mono text-xs">{data.jobId}</p>
		</NodeCard>
	);
}
