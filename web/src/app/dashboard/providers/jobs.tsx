import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

export interface Job {
	JobId: string;
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
	} = useQuery<Job[]>({
		queryKey: [`${placeid}/jobs`],
		queryFn: () => api.get<Job[]>(`${placeid}/jobs`).then((r) => r.data),
	});
	return (
		<JobsContext.Provider value={{ data, isLoading, error }}>
			{children}
		</JobsContext.Provider>
	);
}
