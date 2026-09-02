import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { ArrowRightIcon, InfoIcon, UserIcon, UsersIcon } from "lucide-react";
import Dropdown from "./init";
import type { JobsSerialized } from "@/app/providers/jobs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";

interface Player {
	name: string;
	id: string;
}

function PlayerButton({
	player,
	placeid,
	jobid,
}: {
	player: Player;
	placeid: string;
	jobid: string;
}) {
	return (
		<Link to={`/${placeid}/${jobid}/${player.name}`}>
			<Button className="flex justify-between w-full h-15">
				<div className="flex items-center gap-2">
					<UserIcon className="size-6" />
					<div className="flex flex-col items-baseline">
						{player.name}
						<span className="text-xs opacity-60">{player.id}</span>
					</div>
				</div>
				<ArrowRightIcon />
			</Button>
		</Link>
	);
}

function PlayersDialog({ job }: { job: JobsSerialized }) {
	const { placeId } = useParams();
	const players: Player[] = Object.entries(job.Job.Players).map(
		([id, name]) => ({ name, id }),
	);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<InfoIcon /> <strong>Players</strong>
				</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto no-scrollbar">
				{players.map((player) => (
					<PlayerButton
						key={player.id}
						player={player}
						placeid={placeId as string}
						jobid={job.Id}
					/>
				))}
			</div>
		</DialogContent>
	);
}

export default function ServerButtonDropdown({ job }: { job: JobsSerialized }) {
	return (
		<Dropdown>
			<DropdownMenuGroup>
				<Dialog>
					<PlayersDialog job={job} />
					<DialogTrigger asChild>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							Players
							<DropdownMenuShortcut>
								<UsersIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DialogTrigger>
				</Dialog>
			</DropdownMenuGroup>
		</Dropdown>
	);
}
