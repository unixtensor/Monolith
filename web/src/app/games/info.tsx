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
	TagIcon,
	ClockIcon,
	CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

function ServerIcon({ job }: { job?: JobsSerialized }) {
	const is_studio = job && job.Id.startsWith("studio");

	return (
		<div
			className={`${is_studio ? "bg-studio-background " : ""}bg-secondary w-fit p-3 rounded [&>svg]:size-5`}
		>
			{is_studio ? (
				<HammerIcon className="text-studio" />
			) : (
				<Gamepad2Icon />
			)}
		</div>
	);
}

function DescriptionMetadata({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Badge>
			{icon}
			{children}
		</Badge>
	);
}

function DescriptionToggle({ game }: { game: Game }) {
	const [hidden, setHidden] = useState<boolean>(
		localStorage.getItem(`${game.Properties.PlaceId}-info-hidden`) ===
			"true",
	);

	const toggle = () => {
		setHidden(!hidden);
		localStorage.setItem(
			`${game.Properties.PlaceId}-info-hidden`,
			`${!hidden}`,
		);
	};

	return (
		<>
			<Separator hidden={hidden} />
			<CardContent hidden={hidden} className="flex flex-col gap-2">
				<p className="whitespace-pre-wrap opacity-80 mb-1">
					{game.Properties.Description}
				</p>
				<div className="flex gap-2">
					<DescriptionMetadata icon={<TagIcon />}>
						{game.Properties.PlaceId}
					</DescriptionMetadata>
					<DescriptionMetadata icon={<CalendarIcon />}>
						{format(
							parseISO(game.Properties.Created),
							"yyyy-MM-dd HH:mm:ss",
						)}
					</DescriptionMetadata>
					<DescriptionMetadata icon={<ClockIcon />}>
						{format(
							parseISO(game.Properties.Updated),
							"yyyy-MM-dd HH:mm:ss",
						)}
					</DescriptionMetadata>
				</div>
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
		<div className="flex flex-col [&>a]:size-fit">
			<Link
				to={`https://www.roblox.com/games/${game.Properties.PlaceId}`}
				rel="noopener noreferrer"
				target="_blank"
			>
				<strong className="text-xl">{game.Properties.Name}</strong>
			</Link>
			<Link
				to={`https://www.roblox.com/users/${game.Creator.Id}/profile`}
				rel="noopener noreferrer"
				target="_blank"
				className="hover:[&>span]:opacity-100"
			>
				<span className="opacity-50 transition-opacity">
					@{game.Creator.Name}
				</span>
			</Link>
		</div>
	);
}

export default function GameInfoCard({
	job,
	game,
	children,
}: {
	job?: JobsSerialized;
	game: Game;
	children?: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<ServerIcon job={job} />
					<TitlePlaceId game={game} />
				</div>
				{children}
			</CardHeader>
			<DescriptionToggle game={game} />
		</Card>
	);
}
