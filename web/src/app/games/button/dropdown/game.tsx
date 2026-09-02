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
import { Link } from "react-router";
import { type Game } from "../../../providers/games";
import Dropdown, { ExternalLink, PromptInfo } from "./init";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";

function InfoDialog({ game }: { game: Game }) {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<InfoIcon /> <strong>{game.Properties.Name}</strong>
				</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-4">
				<PromptInfo icon={<CrownIcon />} label="Creator">
					<ExternalLink
						to={`https://www.roblox.com/users/${game.Creator.Id}/profile`}
					>
						{game.Creator.Name}
					</ExternalLink>
				</PromptInfo>
				<PromptInfo icon={<HouseIcon />} label="Place ID">
					<ExternalLink
						to={`https://www.roblox.com/games/${game.Properties.PlaceId}`}
					>
						{game.Properties.PlaceId}
					</ExternalLink>
				</PromptInfo>
				<PromptInfo icon={<UsersIcon />} label="Server Size">
					{game.Properties.MaxPlayers}
				</PromptInfo>
				<PromptInfo icon={<InfoIcon />} label="Description">
					{game.Properties.Description}
				</PromptInfo>
				<div className="flex justify-between">
					<PromptInfo icon={<InfoIcon />} label="Created">
						{format(
							parseISO(game.Properties.Created),
							"yyyy-MM-dd HH:mm",
						)}
					</PromptInfo>
					<PromptInfo icon={<InfoIcon />} label="Last Updated">
						{format(
							parseISO(game.Properties.Updated),
							"yyyy-MM-dd HH:mm",
						)}
					</PromptInfo>
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
