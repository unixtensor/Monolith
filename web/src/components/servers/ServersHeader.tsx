import GameInfoCard from "@/components/games/GameInfoCard";
import type { Game } from "@/providers/GamesProvider";
import type { Job } from "@/providers/JobsProvider";

export default function ServerHeader({ job, game }: { job: Job; game: Game }) {
	return (
		<GameInfoCard job={job} game={game}>
			<div className="flex items-center gap-2 bg-secondary p-3 rounded">
				<div className="bg-green-500 rounded-full size-3"></div>
				<p className="opacity-80">{job.Id}</p>
			</div>
		</GameInfoCard>
	);
}
