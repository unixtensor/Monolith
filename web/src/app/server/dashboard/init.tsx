import { useCurrentGame, useCurrentJob } from "../../providers/current";
import type { JobsSerialized } from "../../providers/jobs";
import type { Game } from "../../providers/games";
import { Navigate } from "react-router";
import ServerDashboardHeader from "./header";

export default function Dashboard() {
	const game = useCurrentGame();
	const job = useCurrentJob();

	if (game.isLoading || job.isLoading) {
		return <span>omg loading</span>;
	}
	if (game.error || job.error) {
		return <Navigate to="/games" replace />;
	}
	return (
		<ServerDashboardHeader
			job={job.current as JobsSerialized}
			game={game.current as Game}
		/>
	);
}
