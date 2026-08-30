import { ServerIcon } from "lucide-react";
import { Navigate, useParams } from "react-router";
import { ServerButton } from "./button/server";
import { Header, Loading } from "./init";
import { toast } from "sonner";
import SearchProvider, {
	NoResult,
	useSearch,
	type SearchContext,
} from "./search";
import JobsProvider, {
	useJobs,
	type JobsContext,
	type JobsSerialized,
} from "../dashboard/providers/jobs";

function useJobsSearch(jobs: JobsContext): [JobsSerialized[], SearchContext] {
	const search = useSearch();

	const filtered = jobs.data.filter(
		(job) =>
			job.Id.toLowerCase().includes(search.searchTerm) ||
			Object.entries(job.Job.Players)
				.flatMap((plr) => plr)
				.filter((plr) => plr.includes(search.searchTerm)),
	);
	return [filtered, search];
}

function ServersList({ placeid }: { placeid: string }) {
	const jobs = useJobs();
	const [filtered, search] = useJobsSearch(jobs);

	if (jobs.isLoading) return <Loading />;
	if (jobs.data.length === 0) {
		toast.error("No servers to display for this game");
		return <Navigate to="/games?refresh=1" replace />;
	}

	if (filtered.length === 0)
		return (
			<NoResult>{`No servers with name nor player ${search.searchTerm}`}</NoResult>
		);
	return filtered.map((job) => (
		<ServerButton key={job.Id} job={job} to={`/${placeid}/${job.Id}`} />
	));
}

export default function Servers() {
	const { placeId } = useParams();

	return (
		<JobsProvider placeid={placeId as string}>
			<Header icon={<ServerIcon />}>Active servers</Header>
			<p className="text-sm">Click on a server instance to manage</p>
			<SearchProvider
				queryKey={[`${placeId}/jobs`]}
				placeholder="Search by server name, player id, or player name..."
			>
				<div className="flex flex-col gap-3">
					<ServersList placeid={placeId as string} />
				</div>
			</SearchProvider>
		</JobsProvider>
	);
}
