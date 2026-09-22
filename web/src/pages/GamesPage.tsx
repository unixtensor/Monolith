import GameButton from "@/components/games/GameButton";
import { Loading } from "@/components/Loading";
import NoResult from "@/components/NoResult";
import { Card } from "@/components/ui/card";
import { useTitle } from "@/hooks/useTitle";
import {
	useGames,
	type Game,
	type GamesContext,
} from "@/providers/GamesProvider";
import SearchProvider, {
	useSearch,
	type SearchContext,
} from "@/providers/SearchProvider";
import { useQueryClient } from "@tanstack/react-query";
import { ServerIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

function useRefreshParam() {
	const queryClient = useQueryClient();
	const [searchParams, _] = useSearchParams();

	useEffect(() => {
		if (searchParams.has("refresh")) {
			queryClient.refetchQueries({ queryKey: ["games"] });
		}
	}, [searchParams]);
}

function useGamesSearch(games: GamesContext): [Game[], SearchContext] {
	const search = useSearch();

	const filtered = games.data.filter(
		(game) =>
			game.Properties.Name.includes(search.searchTerm) ||
			game.Properties.PlaceId.includes(search.searchTerm),
	);
	return [filtered, search];
}

function GamesList() {
	useRefreshParam();

	const games = useGames();
	const [filtered, search] = useGamesSearch(games);

	if (games.isLoading) return <Loading />;
	if (games.data.length === 0)
		return <NoResult>No games are connected</NoResult>;

	if (filtered.length === 0)
		return (
			<NoResult>{`No game with name nor id "${search.searchTerm}" found`}</NoResult>
		);
	return filtered.map((game) => (
		<GameButton
			key={game.Properties.PlaceId}
			to={`/${game.Properties.PlaceId}`}
			game={game}
		/>
	));
}

export default function GamesPage() {
	useTitle("Games");

	return (
		<Card className="flex flex-col w-full gap-3 p-5 justify-center">
			<SearchProvider
				title="Games"
				description="Click on a game to manage"
				icon={<ServerIcon />}
				queryKey={["games"]}
				placeholder="Search by name or id..."
			>
				<GamesList />
			</SearchProvider>
		</Card>
	);
}
