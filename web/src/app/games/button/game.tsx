import { Button } from "@/components/ui/button";
import { CrownIcon, PowerIcon, UsersIcon } from "lucide-react";
import { Link, type To } from "react-router";
import type { Game } from "../../dashboard/games";
import GameButtonDropdown from "./dropdown/game";

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

function Metadata({ game }: { game: Game }) {
	return (
		<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:items-center [&>div]:gap-1">
			<Data
				icon={
					<PowerIcon
						className={
							game.Jobs.length === 0
								? "text-red-500"
								: "text-green-500"
						}
					/>
				}
			>
				{game.Jobs.length}
			</Data>
			<Data icon={<CrownIcon />}>{game.Creator.Name}</Data>
			<Data icon={<UsersIcon />}>{game.Properties.MaxPlayers}</Data>
		</div>
	);
}

function ServerLink({
	jobs,
	to,
	children,
}: {
	jobs: string[];
	to: To;
	children: React.ReactNode;
}) {
	if (jobs.length === 0) return <div className="w-full">{children}</div>;
	return (
		<Link to={to} className="w-full">
			{children}
		</Link>
	);
}

export default function GameButton({ to, game }: { to: To; game: Game }) {
	return (
		<div className="flex min-w-full">
			<ServerLink to={to} jobs={game.Jobs}>
				<Button
					variant="outline"
					disabled={game.Jobs.length === 0}
					className="flex justify-between h-fit w-full p-5 text-primary rounded-r-none [&>a]:min-w-full"
				>
					<div className="flex flex-col gap-2">
						<h1 className="font-bold text-lg text-left">
							{game.Properties.Name}
						</h1>
						<Metadata game={game} />
					</div>
				</Button>
			</ServerLink>
			<div>
				<GameButtonDropdown game={game} />
			</div>
		</div>
	);
}
