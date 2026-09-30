import type { Game } from "@/providers/GamesProvider";
import type { Job } from "@/providers/JobsProvider";

export interface PlayerRow {
	userid: string;
	name: string;
	to: string;
}

export default function format_players(game: Game, job: Job): PlayerRow[] {
	return Object.entries(job.Job.Players)
		.map(([userid, name]) => ({
			userid,
			name,
			to: `/${game.Properties.PlaceId}/${job.Id}/${name}`,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}
