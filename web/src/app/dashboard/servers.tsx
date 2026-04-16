import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface Games {
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
export interface Server extends JobInfo {
	PlaceId: string;
	JobId: string;
}
export interface ServersContext {
	data: Server[];
	isLoading: boolean;
	error: Error | null;
}

const ServersContext = createContext<ServersContext>({
	data: [],
	isLoading: true,
	error: null,
});

export const useServers = () => {
	const context = useContext(ServersContext);
	if (context === undefined)
		throw new Error("useAuth must be used within a ServersProvider");
	return context;
};

function to_array(o: Games): Server[] {
	return Object.entries(o).flatMap(([PlaceId, jobs]) =>
		Object.entries(jobs).map(([JobId, job]) => ({
			PlaceId,
			JobId,
			...job,
		})),
	);
}

export default function ServersProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		data = [],
		isLoading,
		error,
	} = useQuery<Server[]>({
		queryKey: ["games-servers"],
		queryFn: () =>
			api.get<Games>("/games-servers").then((r) => to_array(r.data)),
	});
	return (
		<ServersContext.Provider value={{ data, isLoading, error }}>
			{children}
		</ServersContext.Provider>
	);
}
