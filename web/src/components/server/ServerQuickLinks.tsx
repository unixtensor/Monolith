import { Button } from "@/components/ui/button";
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import format_players, { type PlayerRow } from "@/lib/players";
import type { Game } from "@/providers/GamesProvider";
import { HeaderBarActions } from "@/providers/HeaderBarProvider";
import type { Job } from "@/providers/JobsProvider";
import { ChevronDownIcon } from "lucide-react";
import { Link } from "react-router";

function QuickPlayersList({ players }: { players: PlayerRow[] }) {
	return (
		<>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuLabel>Players</DropdownMenuLabel>
				{players.map((player) => (
					<DropdownMenuItem key={player.userid}>
						<Link to={player.to}>{player.name}</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuGroup>
		</>
	);
}

export default function ServerQuickLinks({
	game,
	job,
}: {
	game: Game;
	job: Job;
}) {
	const players = format_players(game, job);

	return (
		<HeaderBarActions>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>
						Quick Links <ChevronDownIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link
							to={`/${game.Properties.PlaceId}/${job.Id}/sandbox`}
							className="w-full"
						>
							Sandbox
						</Link>
					</DropdownMenuItem>
					{players.length !== 0 && (
						<QuickPlayersList players={players} />
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</HeaderBarActions>
	);
}
