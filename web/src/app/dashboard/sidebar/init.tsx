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
import { useGames } from "../games-servers";
import Logout from "./logout";

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
							<SidebarMenuSubButton asChild key={game.PlaceId}>
								<Link to={`/${game.PlaceId}`}>
									<span>{game.Name}</span>
								</Link>
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
				<Button className="justify-baseline bg-sidebar pl-2">
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
			<SidebarHeader>
				<h1 className="text-center">Monolith</h1>
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
