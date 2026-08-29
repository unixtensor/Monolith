import { ServerIcon } from "lucide-react";
import { Navigate, useParams } from "react-router";
import { ServerButton } from "./button/server";
import { Header, Loading } from "./init";
import { toast } from "sonner";
import SearchProvider from "./search";
import JobsProvider, { useJobs } from "../dashboard/providers/jobs";

function ServersList({ placeid }: { placeid: string }) {
	const jobs = useJobs();

	if (jobs.isLoading) return <Loading />;
	if (jobs.data.length === 0) {
		toast.error("No servers to display for this game");
		return <Navigate to="/games" replace />;
	}

	return (
		<div className="flex flex-col gap-5 mt-3">
			<SearchProvider
				queryKey={[`${placeid}/jobs`]}
				placeholder="Search by server id, player id, or player name..."
			>
				{jobs.data.map((job) => (
					<ServerButton
						key={job.Id}
						job={job}
						to={`/${placeid}/${job.Id}`}
					/>
				))}
			</SearchProvider>
		</div>
	);
}

export default function Servers() {
	const { placeId } = useParams();
	return (
		<JobsProvider placeid={placeId as string}>
			<Header icon={<ServerIcon />}>Active servers</Header>
			<p className="text-sm">Click on a server instance to manage</p>
			<ServersList placeid={placeId as string} />
		</JobsProvider>
	);
}
