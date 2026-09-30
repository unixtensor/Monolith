import LiveServerWarning from "@/components/LiveServerWarning";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import Widget from "@/components/Widget";
import type { Game } from "@/providers/GamesProvider";
import type { Job } from "@/providers/JobsProvider";
import { format, parseISO } from "date-fns";
import { ArrowRightIcon, ClockIcon, WrenchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function format_uptime(ms: number): string {
	const total = Math.floor(ms / 1000);
	const days = Math.floor(total / 86400);
	const clock = [
		Math.floor((total % 86400) / 3600),
		Math.floor((total % 3600) / 60),
		total % 60,
	]
		.map((n) => `${n}`.padStart(2, "0"))
		.join(":");

	return days === 0 ? clock : `${days}d ${clock}`;
}

function useUptime(job_uptime: string): number {
	const started = parseISO(job_uptime).getTime();
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const tick = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(tick);
	}, []);

	return Math.max(0, now - started);
}

function UptimeWidget({ job }: { job: Job }) {
	const uptime = useUptime(job.Job.UpTime);

	return (
		<Widget title="Uptime" icon={<ClockIcon />} className="h-fit">
			<CardContent className="flex flex-col gap-1">
				<strong className="text-xl tabular-nums">
					{format_uptime(uptime)}
				</strong>
				<CardDescription>
					Since {format(parseISO(job.Job.UpTime), "MMM d, HH:mm:ss")}
				</CardDescription>
			</CardContent>
		</Widget>
	);
}

function SandboxWidget({ game, job }: { game: Game; job: Job }) {
	return (
		<Widget title="Sandbox" icon={<WrenchIcon />} className="size-fit">
			<CardDescription className="pl-4 pr-4">
				Modify the server in real-time from the dashboard
			</CardDescription>
			<CardFooter className="gap-2">
				<Link to={`/${game.Properties.PlaceId}/${job.Id}/sandbox`}>
					<Button aria-label="Launch sandbox mode">
						Launch <ArrowRightIcon />
					</Button>
				</Link>
				{!job.isStudio && <LiveServerWarning />}
			</CardFooter>
		</Widget>
	);
}

export default function ServerWidgets({ game, job }: { game: Game; job: Job }) {
	return (
		<div className="flex flex-col gap-4 size-fit">
			<UptimeWidget job={job} />
			<SandboxWidget game={game} job={job} />
		</div>
	);
}
