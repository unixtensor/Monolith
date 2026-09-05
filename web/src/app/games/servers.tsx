import { Navigate } from "react-router";
import { ServerButton } from "./button/server";
import { Loading } from "./init";
import { toast } from "sonner";
import SearchProvider, {
	NoResult,
	useSearch,
	type SearchContext,
} from "./search";
import {
	useJobs,
	type JobsContext,
	type JobsSerialized,
} from "../providers/jobs";
import { useCurrentGame } from "../providers/current";
import GameInfoCard from "./info";
import { ServerIcon, UsersIcon } from "lucide-react";
import Widget from "../dashboard/widget";
import { Card } from "@/components/ui/card";

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

function ServersList({
	jobs,
	placeid,
}: {
	jobs: JobsContext;
	placeid: string;
}) {
	const [filtered, search] = useJobsSearch(jobs);

	if (filtered.length === 0)
		return (
			<NoResult>{`No servers with name nor player "${search.searchTerm}"`}</NoResult>
		);
	return filtered.map((job) => (
		<ServerButton key={job.Id} job={job} to={`/${placeid}/${job.Id}`} />
	));
}

function TotalPlayers({ jobs }: { jobs: JobsSerialized[] }) {
	const players = new Set();

	jobs.forEach(({ Job }) =>
		Object.keys(Job.Players).forEach((userid) => players.add(userid)),
	);
	return (
		<Widget title="Active Players" icon={<UsersIcon />}>
			<strong className="text-xl">{players.size.toLocaleString()}</strong>
		</Widget>
	);
}

function TotalServers({ jobs }: { jobs: JobsSerialized[] }) {
	const servers = Object.entries(jobs).length;

	return (
		<Widget title="Active Servers" icon={<ServerIcon />}>
			<strong className="text-xl">{servers.toLocaleString()}</strong>
		</Widget>
	);
}

function Widgets({ jobs }: { jobs: JobsSerialized[] }) {
	return (
		<div className="flex flex-col gap-4 size-fit">
			<TotalServers jobs={jobs} />
			<TotalPlayers jobs={jobs} />
		</div>
	);
}

export default function Servers() {
	const game = useCurrentGame();
	const jobs = useJobs();

	if (game.isLoading || jobs.isLoading) return <Loading />;
	if (jobs.error || game.error || !game.current)
		return <Navigate to="/games" replace />;

	if (jobs.data.length === 0) {
		toast.error("No servers to display for this game");
		return <Navigate to="/games?refresh=1" replace />;
	}

	const placeid = game.current.Properties.PlaceId;

	return (
		<>
			<GameInfoCard game={game.current} />
			<div className="flex gap-5 mt-5">
				<Card className="flex flex-col w-full gap-3 p-5 justify-center">
					<SearchProvider
						title="Servers"
						description="Click on a server to manage"
						icon={<ServerIcon />}
						queryKey={[`${placeid}/jobs`]}
						placeholder="Search by server name, player id, or player name..."
					>
						<div className="flex flex-col gap-2 w-full">
							<ServersList placeid={placeid} jobs={jobs} />
						</div>
					</SearchProvider>
				</Card>
				<Widgets jobs={jobs.data} />
			</div>
		</>
	);
}
