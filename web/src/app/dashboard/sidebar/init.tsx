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
import {
	ChevronRight,
	GitForkIcon,
	LoaderCircleIcon,
	ServerIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useServers } from "../games";
import Logout from "./logout";

function Games() {
	const servers = useServers();

	return (
		<SidebarMenuItem>
			<Link to="/servers">
				<CollapsibleTrigger
					asChild
					disabled={servers.data.length === 0}
				>
					<SidebarMenuButton>
						<ServerIcon />
						<span>Games</span>
						{servers.isLoading && (
							<LoaderCircleIcon className="animate-spin" />
						)}
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
			</Link>
			<CollapsibleContent>
				<SidebarMenuSub>
					<SidebarMenuSubItem>
						{servers.data.map((server) => (
							<SidebarMenuSubButton asChild key={server.PlaceId}>
								<Link to={`/${server.PlaceId}`}>
									<span>{server.Name}</span>
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

export default function Sidebar() {
	return (
		<ShadSidebar className="border-none">
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
