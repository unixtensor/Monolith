import { ServerCrashIcon } from "lucide-react";
import { Navigate, useParams } from "react-router";
import { useGames } from "../dashboard/games-servers";
import { ServerButton } from "./button";
import { Header, Loading, NoResult } from "./init";
import SearchProvider from "./search";

export default function Servers() {
	const { placeId } = useParams();
	const games = useGames();

	if (games.isLoading) return <Loading />;
	if (games.data.length === 0) return <Navigate to="/games" replace />;

	const game_servers = games.data.filter((g) => g.PlaceId === placeId);
	if (game_servers.length === 0)
		return <NoResult>This game has no servers (likely a bug)</NoResult>;

	return (
		<>
			<Header icon={<ServerCrashIcon />}>Active servers</Header>
			<p className="text-sm">Click on a server instance to manage</p>
			<div className="flex flex-col gap-5 mt-3">
				<SearchProvider queryKey={["games-servers"]}>
					{game_servers.map((g) => (
						<ServerButton
							key={g.JobId}
							to={`/${placeId}/${g.JobId}`}
							game={g}
						/>
					))}
				</SearchProvider>
			</div>
		</>
	);
}
