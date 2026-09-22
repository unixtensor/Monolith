import { useCurrentGame, useCurrentJob } from "@/providers/CurrentProvider";
import type { JobsSerialized } from "@/providers/JobsProvider";
import type { Game } from "@/providers/GamesProvider";
import { Navigate } from "react-router";
import ServerHeader from "@/components/servers/ServerHeader";
import { toast } from "sonner";
import PlayersCard from "@/components/servers/PlayersCard";

export default function ServerPage() {
	const game = useCurrentGame();
	const job = useCurrentJob();

	if (game.isLoading || job.isLoading) {
		return <span>omg loading</span>;
	}
	if (game.error || job.error) {
		return <Navigate to="/games" replace />;
	}
	if (!game.current) {
		toast.error("This game no longer exists");
		return <Navigate to="/games" replace />;
	}
	if (!job.current) {
		toast.error("This server has closed or doesnt exist");
		return <Navigate to={`/${game.current.Properties.PlaceId}`} replace />;
	}

	return (
		<div className="flex flex-col gap-5">
			<ServerHeader
				job={job.current as JobsSerialized}
				game={game.current as Game}
			/>
			<PlayersCard
				key={job.current.Id}
				game={game.current as Game}
				job={job.current as JobsSerialized}
			/>
		</div>
	);
}
