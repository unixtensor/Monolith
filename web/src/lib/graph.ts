import type { Game } from "@/providers/GamesProvider";
import type { Edge, Node } from "@xyflow/react";

const game_height = 76;
const server_height = 56;
const server_row = 55;
const group_gap = 32;
const column = 340;

export interface GameNodeData extends Record<string, unknown> {
	name: string;
	placeId: string;
	servers: number;
}

export interface ServerNodeData extends Record<string, unknown> {
	jobId: string;
	placeId: string;
	studio: boolean;
}

export type GraphNode =
	Node<GameNodeData, "game"> | Node<ServerNodeData, "server">;

export interface Graph {
	nodes: GraphNode[];
	edges: Edge[];
}

export function buildGraph(games: Game[]): Graph {
	const nodes: GraphNode[] = [];
	const edges: Edge[] = [];
	let top = 0;

	games.forEach((game) => {
		const { PlaceId, Name } = game.Properties;
		const jobs = game.Jobs;
		const span = jobs.length
			? (jobs.length - 1) * server_row + server_height
			: game_height;
		const height = Math.max(game_height, span);

		nodes.push({
			id: `game-${PlaceId}`,
			type: "game",
			position: { x: 0, y: top + (height - game_height) / 2 },
			data: { name: Name, placeId: PlaceId, servers: jobs.length },
		});

		jobs.forEach((jobId, row) => {
			const id = `server-${PlaceId}-${jobId}`;
			nodes.push({
				id,
				type: "server",
				position: {
					x: column,
					y: top + (height - span) / 2 + row * server_row,
				},
				data: {
					jobId,
					placeId: PlaceId,
					studio: jobId.startsWith("studio"),
				},
			});
			edges.push({
				id: `edge-${id}`,
				source: `game-${PlaceId}`,
				target: id,
			});
		});

		top += height + group_gap;
	});

	return { nodes, edges };
}
