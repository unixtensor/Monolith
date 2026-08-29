import { ServerIcon } from "lucide-react";
import { useParams } from "react-router";
import { ServerButton } from "./button/server";
import { Header, Loading, NoResult } from "./init";
import SearchProvider from "./search";
import JobsProvider, { useJobs } from "../dashboard/providers/jobs";

function ServersList({ placeid }: { placeid: string }) {
	const jobs = useJobs();

	if (jobs.isLoading) return <Loading />;
	if (jobs.data.length === 0)
		return <NoResult>This game has no running servers.</NoResult>;

	return (
		<JobsProvider placeid={placeid}>
			<Header icon={<ServerIcon />}>Active servers</Header>
			<p className="text-sm">Click on a server instance to manage</p>
			<div className="flex flex-col gap-5 mt-3">
				<SearchProvider
					queryKey={[`${placeid}/jobs`]}
					placeholder="Search by server id, player id, or player name..."
				>
					{jobs.data.map((job) => (
						<ServerButton
							key={job.JobId}
							job={job}
							to={`/${placeid}/${job.JobId}`}
						/>
					))}
				</SearchProvider>
			</div>
		</JobsProvider>
	);
}

export default function Servers() {
	const { placeId } = useParams();
	return <ServersList placeid={placeId as string} />;
}
