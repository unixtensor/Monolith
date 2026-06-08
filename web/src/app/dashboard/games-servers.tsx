import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface GamesSerialized {
	[placeId: string]: {
		[jobId: string]: JobInfo;
	};
}
interface JobInfo {
	Name: string;
	MaxPlayers: number;
	Players: number;
	UpTime: number;
}
export interface Game extends JobInfo {
	PlaceId: string;
	JobId: string;
}
export interface GamesContext {
	data: Game[];
	isLoading: boolean;
	error: Error | null;
}

const GamesContext = createContext<GamesContext>({
	data: [],
	isLoading: true,
	error: null,
});

export const useGames = () => {
	const context = useContext(GamesContext);
	if (context === undefined)
		throw new Error("useAuth must be used within a GamesProvider");
	return context;
};

function to_array(o: GamesSerialized): Game[] {
	return Object.entries(o).flatMap(([PlaceId, jobs]) =>
		Object.entries(jobs).map(([JobId, job]) => ({
			PlaceId,
			JobId,
			...job,
		})),
	);
}

export default function GamesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		data = [],
		isLoading,
		error,
	} = useQuery<Game[]>({
		queryKey: ["games-servers"],
		queryFn: () =>
			api
				.get<GamesSerialized>("/games-servers")
				.then((r) => to_array(r.data)),
	});
	return (
		<GamesContext.Provider value={{ data, isLoading, error }}>
			{children}
		</GamesContext.Provider>
	);
}
