import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface GameProperties {
	PlaceId: string;
	Name: string;
	Created: string;
	Updated: string;
	MaxPlayers: number;
	Description: string;
}
interface GameCreator {
	Id: number;
	Name: string;
}
export interface Game {
	Properties: GameProperties;
	Creator: GameCreator;
	Jobs: string[];
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
		throw new Error("useGames must be used within a GamesProvider");
	return context;
};

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
		queryKey: ["games"],
		queryFn: () => api.get<Game[]>("/games").then((r) => r.data),
	});
	return (
		<GamesContext.Provider value={{ data, isLoading, error }}>
			{children}
		</GamesContext.Provider>
	);
}
