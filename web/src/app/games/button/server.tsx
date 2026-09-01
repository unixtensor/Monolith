import { Button } from "@/components/ui/button";
import { Link, type To } from "react-router";
import type { JobsSerialized } from "@/app/dashboard/providers/jobs";
import { ClockIcon, HammerIcon, UsersIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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

function Metadata({ job }: { job: JobsSerialized }) {
	const job_uptime = new Date(job.Job.UpTime);

	return (
		<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:gap-1 [&>div]:items-center">
			<Data icon={<UsersIcon />}>
				{Object.entries(job.Job.Players).length}
			</Data>
			<Data icon={<ClockIcon />}>
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

function Name({ job }: { job: JobsSerialized }) {
	const is_studio = job.Id.startsWith("studio");
	const id = <h1 className="text-lg">{job.Id}</h1>;

	if (is_studio)
		return (
			<div className="flex items-center gap-2">
				<div className="bg-[#031f33] p-1.5 size-fit rounded-full">
					<HammerIcon className="text-[#0c86d9] size-5" />
				</div>
				{id}
			</div>
		);
	return id;
}

export function ServerButton({ to, job }: { to: To; job: JobsSerialized }) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button
					variant="outline"
					className="flex flex-col justify-between items-baseline h-fit w-full p-5 [&>a]:min-w-full"
				>
					<Name job={job} />
					<Metadata job={job} />
				</Button>
			</Link>
		</div>
	);
}
