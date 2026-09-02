import { Navigate, useParams } from "react-router";
import { ServerButton } from "./button/server";
import { Loading } from "./init";
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
} from "../providers/jobs";
import { useTitle } from "../hooks/useTitle";

function job_has_player(job: JobsSerialized, searchTerm: string): boolean {
	return (
		Object.entries(job.Job.Players).filter(
			([id, name]) =>
				searchTerm === id || name.toLowerCase().includes(searchTerm),
		).length !== 0
	);
}

function useJobsSearch(jobs: JobsContext): [JobsSerialized[], SearchContext] {
	const search = useSearch();

	const filtered = jobs.data.filter(
		(job) =>
			job.Id.toLowerCase().includes(search.searchTerm) ||
			job_has_player(job, search.searchTerm),
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
			<NoResult>{`No servers with name nor player "${search.searchTerm}"`}</NoResult>
		);
	return filtered.map((job) => (
		<ServerButton key={job.Id} job={job} to={`/${placeid}/${job.Id}`} />
	));
}

export default function Servers() {
	const { placeId } = useParams();
	useTitle("Servers");

	return (
		<JobsProvider placeid={placeId as string}>
			<SearchProvider
				title="Active servers"
				description="Click on a server instance to manage"
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
