import type { Game } from "@/app/providers/games";
import type { JobsSerialized } from "@/app/providers/jobs";
import SearchProvider, { NoResult, useSearch } from "@/app/providers/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, dataTableFeatures } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	createColumnHelper,
	type OnChangeFn,
	type Row,
	type RowSelectionState,
} from "@tanstack/react-table";
import {
	BombIcon,
	ClipboardIcon,
	EllipsisIcon,
	ExternalLinkIcon,
	GavelIcon,
	UserIcon,
	UsersIcon,
	XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

interface PlayerRow {
	userid: string;
	name: string;
	to: string;
}

interface PlayersProps {
	game: Game;
	job: JobsSerialized;
}

const columnHelper = createColumnHelper<typeof dataTableFeatures, PlayerRow>();

const columns = columnHelper.columns([
	columnHelper.display({
		id: "select",
		meta: { className: "w-0" },
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllRowsSelected() ||
					(table.getIsSomeRowsSelected() && "indeterminate")
				}
				onCheckedChange={(checked) =>
					table.toggleAllRowsSelected(checked === true)
				}
				aria-label="Select all players"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onClick={toggle_row(row)}
				aria-label={`Select ${row.original.name}`}
			/>
		),
	}),
	columnHelper.accessor("name", {
		header: "Player",
		cell: ({ row }) => <PlayerName player={row.original} />,
	}),
	columnHelper.display({
		id: "actions",
		meta: { className: "w-0" },
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row }) => <PlayerMenu player={row.original} />,
	}),
]);

function player_rows(game: Game, job: JobsSerialized): PlayerRow[] {
	return Object.entries(job.Job.Players)
		.map(([userid, name]) => ({
			userid,
			name,
			to: `/${game.Properties.PlaceId}/${job.Id}/${name}`,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

function player_matches(player: PlayerRow, searchTerm: string): boolean {
	return (
		player.name.toLowerCase().includes(searchTerm) ||
		player.userid.includes(searchTerm)
	);
}

function copy_userid(userid: string) {
	navigator.clipboard
		.writeText(userid)
		.then(() => toast.success("Copied UserID to clipboard"))
		.catch(() => toast.error("Failed to copy UserID"));
}

function toggle_row(r: Row<typeof dataTableFeatures, PlayerRow>) {
	const toggle = r.getToggleSelectedHandler();

	return (e: React.MouseEvent) =>
		toggle({
			shiftKey: e.shiftKey,
			target: { checked: !r.getIsSelected() },
		});
}

function PlayerName({ player }: { player: PlayerRow }) {
	return (
		<Link to={player.to} className="flex items-center gap-3 w-fit">
			<div className="bg-secondary p-2 rounded-full [&>svg]:size-4">
				<UserIcon />
			</div>
			<div className="flex flex-col">
				<span className="font-medium hover:underline">
					{player.name}
				</span>
				<span className="text-xs opacity-60">{player.userid}</span>
			</div>
		</Link>
	);
}

function PlayerMenu({ player }: { player: PlayerRow }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label={`Actions for ${player.name}`}
				>
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							to={`https://www.roblox.com/users/${player.userid}/profile`}
							rel="noopener noreferrer"
							target="_blank"
						>
							Roblox Profile
							<DropdownMenuShortcut>
								<ExternalLinkIcon />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => copy_userid(player.userid)}
					>
						Copy UserID
						<DropdownMenuShortcut>
							<ClipboardIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Kick
						<DropdownMenuShortcut>
							<BombIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive">
						Ban
						<DropdownMenuShortcut>
							<GavelIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function PlayersTable({
	players,
	rowSelection,
	onRowSelectionChange,
}: {
	players: PlayerRow[];
	rowSelection: RowSelectionState;
	onRowSelectionChange: OnChangeFn<RowSelectionState>;
}) {
	const search = useSearch();
	const filtered = players.filter((p) =>
		player_matches(p, search.searchTerm),
	);

	if (players.length === 0)
		return <NoResult>No players in this server</NoResult>;
	if (filtered.length === 0)
		return (
			<NoResult>{`No player with name nor id "${search.searchTerm}"`}</NoResult>
		);
	return (
		<div className="rounded-lg border overflow-hidden">
			<DataTable
				columns={columns}
				data={filtered}
				getRowId={(row) => row.userid}
				rowSelection={rowSelection}
				onRowSelectionChange={onRowSelectionChange}
			/>
		</div>
	);
}

function Toolbar({
	total,
	selected,
	onClear,
}: {
	total: number;
	selected: number;
	onClear: () => void;
}) {
	return (
		<div className="flex items-center gap-2 min-h-7">
			{selected > 0 && (
				<>
					<Button
						variant="outline"
						size="sm"
						title="Clear selection"
						onClick={onClear}
					>
						{selected} selected
						<XIcon />
					</Button>
				</>
			)}
			<Badge variant="secondary">
				<UsersIcon />
				{total} {total === 1 ? "player" : "players"}
			</Badge>
		</div>
	);
}

function PlayersCard({ game, job }: PlayersProps) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const players = player_rows(game, job);
	const selected = players.filter((p) => rowSelection[p.userid]).length;

	return (
		<Card className="p-5">
			<SearchProvider
				title="Players"
				description="Click on a player to manage"
				icon={<UsersIcon />}
				filters={
					<Toolbar
						total={players.length}
						selected={selected}
						onClear={() => setRowSelection({})}
					/>
				}
				queryKey={[`${game.Properties.PlaceId}/jobs`]}
				placeholder="Search by player name or id..."
			>
				<PlayersTable
					players={players}
					rowSelection={rowSelection}
					onRowSelectionChange={setRowSelection}
				/>
			</SearchProvider>
		</Card>
	);
}

export default function Players({ game, job }: PlayersProps) {
	return <PlayersCard key={job.Id} game={game} job={job} />;
}
