import GameNode from "@/components/graph/GameNode";
import ServerNode from "@/components/graph/ServerNode";
import { Loading } from "@/components/Loading";
import NoResult from "@/components/NoResult";
import { Card } from "@/components/ui/card";
import { useTitle } from "@/hooks/useTitle";
import { buildGraph } from "@/lib/graph";
import { useGames } from "@/providers/GamesProvider";
import { useTheme } from "@/providers/ThemeProvider";
import {
	Background,
	BackgroundVariant,
	Controls,
	ReactFlow,
	type NodeTypes,
} from "@xyflow/react";
import { useMemo } from "react";
import "@xyflow/react/dist/style.css";

const node_types: NodeTypes = { game: GameNode, server: ServerNode };

const edge_options = {
	type: "smoothstep",
	style: { stroke: "var(--border)", strokeWidth: 2 },
};

function Placeholder({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-1 items-center justify-center">
			{children}
		</div>
	);
}

function Topology() {
	const games = useGames();
	const { theme } = useTheme();
	const { nodes, edges } = useMemo(
		() => buildGraph(games.data),
		[games.data],
	);

	if (games.isLoading)
		return (
			<Placeholder>
				<Loading />
			</Placeholder>
		);
	if (games.error)
		return (
			<Placeholder>
				<NoResult>Could not load games</NoResult>
			</Placeholder>
		);
	if (games.data.length === 0)
		return (
			<Placeholder>
				<NoResult>No games are connected</NoResult>
			</Placeholder>
		);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={node_types}
			defaultEdgeOptions={edge_options}
			colorMode={theme}
			fitView
			fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
			minZoom={0.2}
			nodesConnectable={false}
			className="min-h-0 flex-1"
		>
			<Background variant={BackgroundVariant.Dots} gap={20} size={1} />
			<Controls showInteractive={false} />
		</ReactFlow>
	);
}

export default function GraphPage() {
	useTitle("Graph");

	return (
		<Card className="h-full w-full py-0 rounded-br-none">
			<Topology />
		</Card>
	);
}
