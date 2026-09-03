import type { Game } from "@/app/providers/games";
import type { JobsSerialized } from "@/app/providers/jobs";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	HammerIcon,
	Gamepad2Icon,
	ArrowUpIcon,
	ExternalLinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

function ServerIcon({ job }: { job: JobsSerialized }) {
	const is_studio = job.Id.startsWith("studio");

	return (
		<div
			className={`${is_studio ? "bg-studio-background " : ""}bg-secondary w-fit p-4 rounded [&>svg]:size-7`}
		>
			{is_studio ? (
				<HammerIcon className="text-studio" />
			) : (
				<Gamepad2Icon />
			)}
		</div>
	);
}

function DescriptionToggle({ game }: { game: Game }) {
	const [hidden, setHidden] = useState<boolean>(
		localStorage.getItem(`additional_info_${game.Properties.PlaceId}`) ===
			"true",
	);

	const toggle = () => {
		setHidden(!hidden);
		localStorage.setItem(
			`additional_info_${game.Properties.PlaceId}`,
			`${!hidden}`,
		);
	};
	return (
		<>
			<Separator hidden={hidden} />
			<CardContent hidden={hidden}>
				<p className="whitespace-pre-wrap opacity-80">
					{game.Properties.Description}
				</p>
			</CardContent>
			<CardFooter>
				<Button title="Toggle additional info" onClick={toggle}>
					<ArrowUpIcon
						className={hidden ? "rotate-180" : "rotate-0"}
					/>
				</Button>
			</CardFooter>
		</>
	);
}

function TitlePlaceId({ game }: { game: Game }) {
	return (
		<div className="flex flex-col">
			<Link
				to={`https://www.roblox.com/games/${game.Properties.PlaceId}`}
				rel="noopener noreferrer"
				target="_blank"
				className="flex items-center gap-1 size-fit"
			>
				<strong className="text-xl">{game.Properties.Name}</strong>
				<ExternalLinkIcon className="size-4 opacity-50" />
			</Link>
			<span className="opacity-50">{game.Properties.PlaceId}</span>
		</div>
	);
}

export default function ServerDashboardHeader({
	job,
	game,
}: {
	job: JobsSerialized;
	game: Game;
}) {
	return (
		<Card>
			<CardHeader className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<ServerIcon job={job} />
					<TitlePlaceId game={game} />
				</div>
				<div className="flex items-center gap-2 bg-secondary p-3 rounded">
					<div className="bg-green-500 rounded-full size-3"></div>
					<p className="opacity-80">{job.Id}</p>
				</div>
			</CardHeader>
			<DescriptionToggle game={game} />
		</Card>
	);
}
