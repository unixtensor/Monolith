import { Button } from "@/components/ui/button";
import { Link, type To } from "react-router";
import type { Job } from "@/app/dashboard/jobs";

export function ServerButton({ to, job }: { to: To; job: Job }) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button
					variant="outline"
					className="flex justify-between h-fit w-full p-5 text-primary rounded-r-none [&>a]:min-w-full"
				>
					<h1 className="font-bold text-lg">{job.JobId}</h1>
				</Button>
			</Link>
		</div>
	);
}
