import { useCurrentGame, useCurrentJob } from "../../providers/current";
import type { JobsSerialized } from "../../providers/jobs";
import type { Game } from "../../providers/games";
import { Navigate } from "react-router";
import ServerDashboardHeader from "./header";
import { toast } from "sonner";

export default function Dashboard() {
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
		<ServerDashboardHeader
			job={job.current as JobsSerialized}
			game={game.current as Game}
		/>
	);
}
