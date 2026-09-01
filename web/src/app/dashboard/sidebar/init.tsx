import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar as ShadSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ChevronRight,
	GitForkIcon,
	LoaderCircleIcon,
	ServerIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useGames, type Game } from "../providers/games";
import Logout from "./logout";

function Game({ game }: { game: Game }) {
	if (game.Jobs.length === 0)
		return <span className="opacity-30">{game.Properties.Name}</span>;

	return (
		<Link to={`/${game.Properties.PlaceId}`}>
			<span>{game.Properties.Name}</span>
		</Link>
	);
}

function Games() {
	const games = useGames();

	return (
		<SidebarMenuItem>
			<Link to="/games">
				<CollapsibleTrigger asChild disabled={games.data.length === 0}>
					<SidebarMenuButton>
						<ServerIcon />
						<span>Games</span>
						{games.isLoading && (
							<LoaderCircleIcon className="animate-spin" />
						)}
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
			</Link>
			<CollapsibleContent>
				<SidebarMenuSub>
					<SidebarMenuSubItem>
						{games.data.map((game) => (
							<SidebarMenuSubButton
								asChild
								key={game.Properties.PlaceId}
							>
								<Game game={game} />
							</SidebarMenuSubButton>
						))}
					</SidebarMenuSubItem>
				</SidebarMenuSub>
			</CollapsibleContent>
		</SidebarMenuItem>
	);
}

function ButtonsGroup() {
	return (
		<SidebarGroup>
			<Collapsible asChild className="group/collapsible">
				<SidebarMenu>
					<Games />
				</SidebarMenu>
			</Collapsible>
			<Link to="/graph">
				<Button className="justify-baseline bg-transparent text-primary pl-2">
					<GitForkIcon /> Graph
				</Button>
			</Link>
		</SidebarGroup>
	);
}

function SettingsGroup() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
		</SidebarGroup>
	);
}

export function SidebarSkeleton() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<Skeleton className="h-5 w-40 mx-auto" />
			</SidebarHeader>
			<SidebarContent>
				<Skeleton className="h-5 w-55 ml-2 mt-5" />
				<Skeleton className="h-5 w-55 ml-2 mt-3" />
			</SidebarContent>
			<SidebarFooter>
				<Skeleton className="h-7 w-60" />
			</SidebarFooter>
		</ShadSidebar>
	);
}

export default function Sidebar() {
	return (
		<ShadSidebar>
			<SidebarHeader className="mt-3">
				<div className="flex gap-2 items-center ml-1">
					<h1 className="font-black">Monolith</h1>
					<p className="opacity-40 text-sm">alpha</p>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<ButtonsGroup />
				<SettingsGroup />
			</SidebarContent>
			<SidebarFooter>
				<Logout />
			</SidebarFooter>
		</ShadSidebar>
	);
}
