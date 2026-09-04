import { LoaderCircleIcon } from "lucide-react";
import { useGames, type Game, type GamesContext } from "../providers/games";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import GameButton from "./button/game";
import SearchProvider, {
	NoResult,
	useSearch,
	type SearchContext,
} from "./search";
import { useTitle } from "../../hooks/useTitle";

export function Loading() {
	return (
		<div className="flex justify-center items-center h-100">
			<LoaderCircleIcon className="animate-spin size-10" />
		</div>
	);
}

function useParams() {
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
	useParams();

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

export function Header({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: string;
}) {
	return (
		<header className="flex gap-3 mt-3 mb-5">
			{icon}
			<div>{children}</div>
		</header>
	);
}

export default function Games() {
	useTitle("Games");

	return (
		<SearchProvider
			queryKey={["games"]}
			placeholder="Search by name or id..."
		>
			<GamesList />
		</SearchProvider>
	);
}
