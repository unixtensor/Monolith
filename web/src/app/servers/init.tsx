import { useState } from "react";
import { Navigate } from "react-router";
import { ServerButton } from "../games/button/server";
import { Loading } from "../games/init";
import { toast } from "sonner";
import SearchProvider, {
	NoResult,
	useSearch,
	type SearchContext,
} from "../providers/search";
import {
	useJobs,
	type JobsContext,
	type JobsSerialized,
} from "../providers/jobs";
import { useCurrentGame } from "../providers/current";
import GameInfoCard from "../games/info";
import { ArrowUpDownIcon, FilterIcon, ServerIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Widgets from "./widgets";

interface Filters {
	studioOnly: boolean;
	privateOnly: boolean;
	sortNewestFirst: boolean;
}
const defaultFilters: Filters = {
	studioOnly: false,
	privateOnly: false,
	sortNewestFirst: true,
};

function job_has_player(job: JobsSerialized, searchTerm: string): boolean {
	return (
		Object.entries(job.Job.Players).filter(
			([id, name]) =>
				searchTerm === id || name.toLowerCase().includes(searchTerm),
		).length !== 0
	);
}

function useJobsSearch(
	jobs: JobsContext,
	filters: Filters,
): [JobsSerialized[], SearchContext] {
	const search = useSearch();

	const filtered = jobs.data
		.filter(
			(job) =>
				job.Id.toLowerCase().includes(search.searchTerm) ||
				job_has_player(job, search.searchTerm),
		)
		.filter((job) => !filters.studioOnly || job.Id.startsWith("studio"))
		.sort((a, b) => {
			const delta =
				new Date(b.Job.UpTime).getTime() -
				new Date(a.Job.UpTime).getTime();
			return filters.sortNewestFirst ? delta : -delta;
		});
	return [filtered, search];
}

function ServersList({
	jobs,
	filters,
	placeid,
}: {
	jobs: JobsContext;
	filters: Filters;
	placeid: string;
}) {
	const [filtered, search] = useJobsSearch(jobs, filters);

	if (filtered.length === 0)
		return (
			<NoResult>{`No servers with name nor player "${search.searchTerm}"`}</NoResult>
		);
	return filtered.map((job) => (
		<ServerButton key={job.Id} job={job} to={`/${placeid}/${job.Id}`} />
	));
}

function SearchFilters({
	filters,
	setFilters,
}: {
	filters: Filters;
	setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
	return (
		<div className="flex gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						<FilterIcon />
						Filters
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem
						checked={filters.studioOnly}
						onCheckedChange={(checked) =>
							setFilters((f) => ({
								...f,
								studioOnly: checked,
							}))
						}
					>
						Studio Only
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={false} disabled>
						Private Only
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button
				variant="outline"
				size="icon"
				title={`Sort by ${filters.sortNewestFirst ? "oldest" : "newest"}`}
				onClick={() =>
					setFilters((f) => ({
						...f,
						sortNewestFirst: !f.sortNewestFirst,
					}))
				}
			>
				<ArrowUpDownIcon />
			</Button>
		</div>
	);
}

export default function Servers() {
	const game = useCurrentGame();
	const jobs = useJobs();
	const [filters, setFilters] = useState<Filters>(defaultFilters);

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
						filters={
							<SearchFilters
								filters={filters}
								setFilters={setFilters}
							/>
						}
						queryKey={[`${placeid}/jobs`]}
						placeholder="Search by server name, player id, or player name..."
					>
						<div className="flex flex-col gap-2 w-full">
							<ServersList
								placeid={placeid}
								jobs={jobs}
								filters={filters}
							/>
						</div>
					</SearchProvider>
				</Card>
				<Widgets jobs={jobs.data} />
			</div>
		</>
	);
}
