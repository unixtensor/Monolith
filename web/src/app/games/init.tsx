import { CircleXIcon, HardDriveIcon, LoaderCircleIcon } from "lucide-react";
import { useGames } from "../dashboard/games-servers";
import { GameButton } from "./button";
import SearchProvider, { useSearch } from "./search";

export function NoResult({ children }: { children: string }) {
	return (
		<div className="flex flex-col gap-5 justify-center items-center h-100">
			<CircleXIcon className="size-10" />
			<h1>{children}</h1>
		</div>
	);
}

export function Loading() {
	return (
		<div className="flex justify-center items-center h-100">
			<LoaderCircleIcon className="animate-spin size-10" />
		</div>
	);
}

function DisplayGames() {
	const games = useGames();
	const search = useSearch();

	if (games.isLoading) return <Loading />;
	if (games.data.length === 0)
		return <NoResult>No games are running</NoResult>;

	const filtered = games.data.filter(
		(game) =>
			game.Name.toLowerCase().includes(search.searchTerm.toLowerCase()) ||
			String(game.PlaceId).includes(search.searchTerm),
	);
	if (filtered.length === 0)
		return (
			<NoResult>{`No game with name nor id "${search.searchTerm}" found`}</NoResult>
		);
	return filtered.map((g) => (
		<GameButton
			to={`/${g.PlaceId}`}
			game={g}
			games={games.data}
			key={g.JobId}
			image={
				g.JobId !== "studio"
					? "https://upload.wikimedia.org/wikipedia/commons/2/29/Roblox_Icon_Transparent.png"
					: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Roblox_Studio_icon_2025.svg"
			}
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
	return (
		<>
			<Header icon={<HardDriveIcon />}>Active games</Header>
			<p className="text-sm">Click on a game to manage</p>
			<div className="flex flex-col gap-5 mt-3">
				<SearchProvider queryKey={["games-servers"]}>
					<DisplayGames />
				</SearchProvider>
			</div>
		</>
	);
}
