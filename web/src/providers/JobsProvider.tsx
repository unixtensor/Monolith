import api from "@/lib/axios";
import context from "@/lib/context";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export interface Job {
	Id: string;
	isStudio: boolean;
	Job: JobProperties;
}
export interface JobProperties {
	Players: { [userid: string]: string };
	UpTime: string;
}
export interface JobsList {
	[jobid: string]: JobProperties;
}

export interface JobsContext {
	data: Job[];
	isLoading: boolean;
	error: Error | null;
}
const JobsContext = createContext<JobsContext>({
	data: [],
	isLoading: true,
	error: null,
});

export const useJobs = () => {
	return context(JobsContext, "useJobs must be used within a JobsProvider");
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
	} = useQuery<Job[]>({
		queryKey: [`${placeid}/jobs`],
		queryFn: () =>
			api.get<JobsList>(`${placeid}/jobs`).then((r) =>
				Object.entries(r.data).map(([Id, Job]) => ({
					Id,
					Job,
					isStudio: Id.startsWith("studio"),
				})),
			),
	});

	return (
		<JobsContext.Provider value={{ data, isLoading, error }}>
			{children}
		</JobsContext.Provider>
	);
}
