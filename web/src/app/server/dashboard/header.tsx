import GameInfoCard from "@/app/games/info";
import type { Game } from "@/app/providers/games";
import type { JobsSerialized } from "@/app/providers/jobs";

export default function ServerDashboardHeader({
	job,
	game,
}: {
	job: JobsSerialized;
	game: Game;
}) {
	return (
		<GameInfoCard job={job} game={game}>
			<div className="flex items-center gap-2 bg-secondary p-3 rounded">
				<div className="bg-green-500 rounded-full size-3"></div>
				<p className="opacity-80">{job.Id}</p>
			</div>
		</GameInfoCard>
	);
}
