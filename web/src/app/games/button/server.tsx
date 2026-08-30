import { Button } from "@/components/ui/button";
import { Link, type To } from "react-router";
import type { JobsSerialized } from "@/app/dashboard/providers/jobs";
import { ClockIcon, UsersIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
	const job_elapsed = new Date(Date.now() - job.Job.UpTime);

	return (
		<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:gap-1 [&>div]:items-center">
			<Data icon={<UsersIcon />}>
				{Object.entries(job.Job.Players).length}
			</Data>
			<Data icon={<ClockIcon />}>
				{formatDistanceToNow(job_elapsed, {
					addSuffix: true,
				})}
			</Data>
		</div>
	);
}

export function ServerButton({ to, job }: { to: To; job: JobsSerialized }) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button
					variant="outline"
					className="flex flex-col justify-between items-baseline h-fit w-full p-5 [&>a]:min-w-full"
				>
					<h1 className="font-bold text-lg">{job.Id}</h1>
					<Metadata job={job} />
				</Button>
			</Link>
		</div>
	);
}
