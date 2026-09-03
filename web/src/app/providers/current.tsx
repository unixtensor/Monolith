import { createContext } from "react";
import { useGames, type Game } from "./games";
import { useJobs, type JobsSerialized } from "./jobs";
import context from "@/lib/context";

export interface CurrentContext<T> {
	current?: T;
	isLoading: boolean;
	error: Error | null;
}
const CurrentGameContext = createContext<CurrentContext<Game>>({
	current: undefined,
	isLoading: true,
	error: null,
});
const CurrentJobContext = createContext<CurrentContext<JobsSerialized>>({
	current: undefined,
	isLoading: true,
	error: null,
});

export const useCurrentGame = () => {
	return context(
		CurrentGameContext,
		"useCurrentGame must be used within a CurrentGameProvider",
	);
};
export const useCurrentJob = () => {
	return context(
		CurrentJobContext,
		"useCurrentJob must be used within a CurrentJobProvider",
	);
};

export function CurrentGameProvider({
	placeid,
	children,
}: {
	placeid: string;
	children: React.ReactNode;
}) {
	const games = useGames();
	const current = games.data.find((g) => g.Properties.PlaceId === placeid);

	return (
		<CurrentGameContext.Provider value={{ current, ...games }}>
			{children}
		</CurrentGameContext.Provider>
	);
}

export function CurrentJobProvider({
	jobid,
	children,
}: {
	jobid: string;
	children: React.ReactNode;
}) {
	const jobs = useJobs();
	const current = jobs.data.find((j) => j.Id === jobid);

	return (
		<CurrentJobContext.Provider value={{ current, ...jobs }}>
			{children}
		</CurrentJobContext.Provider>
	);
}
