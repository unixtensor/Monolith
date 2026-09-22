import { Button } from "@/components/ui/button";
import { Link, type To } from "react-router";
import type { Job } from "@/providers/JobsProvider";
import { ActivityIcon, HammerIcon, UsersIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import ServerDropdown from "./ServerDropdown";

function Data({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div>
			{icon}
			{children}
		</div>
	);
}

function Metadata({ job }: { job: Job }) {
	const job_uptime = new Date(job.Job.UpTime);

	return (
		<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:gap-1 [&>div]:items-center">
			<Data icon={<UsersIcon />}>
				{Object.entries(job.Job.Players).length}
			</Data>
			<Data icon={<ActivityIcon />}>
				{format(job_uptime, "yyyy-MM-dd HH:mm")}
				<span className="opacity-70">
					(
					{formatDistanceToNow(job_uptime, {
						addSuffix: true,
					})}
					)
				</span>
			</Data>
		</div>
	);
}

function Name({ job }: { job: Job }) {
	const id = <h1 className="text-lg">{job.Id}</h1>;

	if (job.isStudio)
		return (
			<div className="flex items-center gap-2">
				<div className="bg-studio-background p-1.5 size-fit rounded-full">
					<HammerIcon className="text-studio size-5" />
				</div>
				{id}
			</div>
		);
	return id;
}

export default function ServerButton({ to, job }: { to: To; job: Job }) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button
					variant="outline"
					className="flex flex-col gap-2 justify-between items-baseline h-fit w-full p-5 rounded-r-none [&>a]:min-w-full"
				>
					<Name job={job} />
					<Metadata job={job} />
				</Button>
			</Link>
			<div>
				<ServerDropdown job={job} />
			</div>
		</div>
	);
}
