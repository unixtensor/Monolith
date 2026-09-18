import { UsersIcon, ServerIcon } from "lucide-react";
import Widget from "../dashboard/widget";
import type { JobsSerialized } from "../providers/jobs";

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

export default function Widgets({ jobs }: { jobs: JobsSerialized[] }) {
	return (
		<div className="flex flex-col gap-4 size-fit">
			<TotalServers jobs={jobs} />
			<TotalPlayers jobs={jobs} />
		</div>
	);
}
