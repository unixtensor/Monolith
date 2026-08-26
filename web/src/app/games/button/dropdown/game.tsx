import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
	CrownIcon,
	ExternalLinkIcon,
	HouseIcon,
	InfoIcon,
	UsersIcon,
} from "lucide-react";
import { Link, type To } from "react-router";
import { type Game } from "../../../dashboard/games";
import Dropdown from "./init";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import type React from "react";

function InfoLink({ to, children }: { to: To; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-1 w-fit"
		>
			{children}
			<ExternalLinkIcon className="opacity-40 size-4" />
		</Link>
	);
}

function InfoRow({
	icon,
	label,
	children,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col">
			<div className="flex gap-1 items-center mb-1">
				{icon}
				<p>{`${label}:`}</p>
			</div>
			<p className="opacity-70">{children}</p>
		</div>
	);
}

function InfoDialog({ game }: { game: Game }) {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<InfoIcon /> <strong>{game.Properties.Name}</strong>
				</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-4">
				<InfoRow icon={<CrownIcon />} label="Creator">
					<InfoLink
						to={`https://www.roblox.com/users/${game.Creator.Id}/profile`}
					>
						{game.Creator.Name}
					</InfoLink>
				</InfoRow>
				<InfoRow icon={<HouseIcon />} label="Place ID">
					<InfoLink
						to={`https://www.roblox.com/games/${game.Properties.PlaceId}`}
					>
						{game.Properties.PlaceId}
					</InfoLink>
				</InfoRow>
				<InfoRow icon={<UsersIcon />} label="Server Size">
					{game.Properties.MaxPlayers}
				</InfoRow>
				<InfoRow icon={<InfoIcon />} label="Description">
					{game.Properties.Description}
				</InfoRow>
				<div className="flex justify-between">
					<InfoRow icon={<InfoIcon />} label="Created">
						{format(
							parseISO(game.Properties.Created),
							"yyyy-MM-dd HH:mm",
						)}
					</InfoRow>
					<InfoRow icon={<InfoIcon />} label="Last Updated">
						{format(
							parseISO(game.Properties.Updated),
							"yyyy-MM-dd HH:mm",
						)}
					</InfoRow>
				</div>
			</div>
		</DialogContent>
	);
}

function Info({ game }: { game: Game }) {
	return (
		<Dialog>
			<InfoDialog game={game} />
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					Info
					<DropdownMenuShortcut>
						<InfoIcon />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DialogTrigger>
		</Dialog>
	);
}

export default function GameButtonDropdown({ game }: { game: Game }) {
	return (
		<Dropdown>
			<DropdownMenuGroup>
				<Link
					to={`https://www.roblox.com/games/${game.Properties.PlaceId}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					<DropdownMenuItem>
						View on Roblox
						<DropdownMenuShortcut>
							<ExternalLinkIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
				<Link
					to={`https://www.roblox.com/games/start?placeId=${game.Properties.PlaceId}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					<DropdownMenuItem>
						Play
						<DropdownMenuShortcut>
							<ExternalLinkIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<Info game={game} />
			</DropdownMenuGroup>
		</Dropdown>
	);
}
