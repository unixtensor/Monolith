import { Button } from "@/components/ui/button";
import { Link, type To } from "react-router";
import type { JobsSerialized } from "@/app/dashboard/providers/jobs";

export function ServerButton({ to, job }: { to: To; job: JobsSerialized }) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button
					variant="outline"
					className="flex justify-between h-fit w-full p-5 text-primary rounded-r-none [&>a]:min-w-full"
				>
					<h1 className="font-bold text-lg">{job.Id}</h1>
					<div></div>
				</Button>
			</Link>
		</div>
	);
}
