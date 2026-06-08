import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, subSeconds } from "date-fns";
import {
	BombIcon,
	ClockIcon,
	EllipsisIcon,
	ExternalLinkIcon,
	HouseIcon,
	PowerIcon,
	TagIcon,
	UsersIcon,
} from "lucide-react";
import { Link, type To } from "react-router";
import type { Game } from "../dashboard/games-servers";

function Dropdown({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="border-none h-full w-15 bg-secondary">
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="start">
				<DropdownMenuGroup>{children}</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function GameButtonDropdown({ game }: { game: Game }) {
	return (
		<Dropdown>
			<Link
				to={`https://www.roblox.com/games/${game.PlaceId}`}
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
				to={`https://www.roblox.com/games/start?placeId=${game.PlaceId}`}
				target="_blank"
			>
				<DropdownMenuItem>
					Join
					<DropdownMenuShortcut>
						<ExternalLinkIcon />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</Link>
		</Dropdown>
	);
}

function ServerButtonDropdown({ game }: { game: Game }) {
	return (
		<Dropdown>
			<DropdownMenuItem variant="destructive">
				Shutdown
				<DropdownMenuShortcut>
					<BombIcon />
				</DropdownMenuShortcut>
			</DropdownMenuItem>
		</Dropdown>
	);
}

function MainButton({
	to,
	game,
	image,
	dropdown,
	metadata,
}: {
	to: To;
	game: Game;
	dropdown: React.ReactNode;
	metadata: React.ReactNode;
	image?: string;
}) {
	return (
		<div className="flex w-full">
			<Link to={to} className="w-full">
				<Button className="bg-secondary flex justify-between gap-5 h-fit p-5 w-full border-none">
					<div className="flex items-center gap-5">
						{image ? (
							<img src={image} className="size-15" />
						) : (
							<div className="bg-green-500 size-3 rounded-full"></div>
						)}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-3 ml-0.5">
								{image && (
									<div className="bg-green-500 size-3 rounded-full"></div>
								)}
								<h1 className="font-bold text-lg">
									{game.Name}
								</h1>
							</div>
							<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:items-center [&>div]:gap-1">
								{metadata}
							</div>
						</div>
					</div>
				</Button>
			</Link>
			<div>{dropdown}</div>
		</div>
	);
}

export function GameButton({
	to,
	image,
	game,
	games,
}: {
	to: To;
	image: string;
	game: Game;
	games: Game[];
}) {
	return (
		<MainButton
			to={to}
			game={game}
			image={image}
			dropdown={<GameButtonDropdown game={game} />}
			metadata={
				<>
					<div>
						<PowerIcon className="text-green-500" />
						<h2>{games.length}</h2>
					</div>
					<div>
						<TagIcon />
						<h2>{game.PlaceId}</h2>
					</div>
					<div>
						<UsersIcon />
						<h2>{game.MaxPlayers}</h2>
					</div>
				</>
			}
		/>
	);
}

export function ServerButton({ to, game }: { to: To; game: Game }) {
	return (
		<MainButton
			to={to}
			game={game}
			dropdown={<ServerButtonDropdown game={game} />}
			metadata={
				<>
					<div>
						<HouseIcon />
						<h2>{game.Name}</h2>
					</div>
					<div>
						<UsersIcon />
						<h2>
							{game.Players}/{game.MaxPlayers}
						</h2>
					</div>
					<div>
						<ClockIcon />
						<h2>
							{formatDistanceToNow(
								subSeconds(new Date(), game.UpTime),
							)}
						</h2>
					</div>
				</>
			}
		/>
	);
}
