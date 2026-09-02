import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

export interface JobsSerialized {
	Id: string;
	Job: Job;
}
export interface Job {
	Players: { [userid: string]: string };
	UpTime: number;
}
export interface Jobs {
	[jobid: string]: Job;
}

export interface JobsContext {
	data: JobsSerialized[];
	isLoading: boolean;
	error: Error | null;
}
const JobsContext = createContext<JobsContext>({
	data: [],
	isLoading: true,
	error: null,
});

export const useJobs = () => {
	const context = useContext(JobsContext);
	if (context === undefined)
		throw new Error("useJobs must be used within a JobsProvider");
	return context;
};

export default function JobsProvider({
	placeid,
	children,
}: {
	placeid: string;
	children: React.ReactNode;
}) {
	const {
		data = [],
		isLoading,
		error,
	} = useQuery<JobsSerialized[]>({
		queryKey: [`${placeid}/jobs`],
		queryFn: () =>
			api
				.get<Jobs>(`${placeid}/jobs`)
				.then((r) =>
					Object.entries(r.data).map(([Id, Job]) => ({ Id, Job })),
				),
	});

	return (
		<JobsContext.Provider value={{ data, isLoading, error }}>
			{children}
		</JobsContext.Provider>
	);
}
