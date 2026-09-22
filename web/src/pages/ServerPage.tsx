import { useCurrentGame, useCurrentJob } from "@/providers/CurrentProvider";
import { Navigate } from "react-router";
import ServerHeader from "@/components/servers/ServersHeader";
import { toast } from "sonner";
import PlayersCard from "@/components/servers/PlayersCard";
import ServerSkeleton from "@/components/layout/ServerSkeleton";
import ServerWidgets from "@/components/server/ServerWidgets";

export default function ServerPage() {
	const game = useCurrentGame();
	const job = useCurrentJob();

	if (game.isLoading || job.isLoading) {
		return <ServerSkeleton />;
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
			<ServerHeader job={job.current} game={game.current} />
			<div className="flex gap-5">
				<PlayersCard
					key={job.current.Id}
					game={game.current}
					job={job.current}
				/>
				<ServerWidgets game={game.current} job={job.current} />
			</div>
		</div>
	);
}
