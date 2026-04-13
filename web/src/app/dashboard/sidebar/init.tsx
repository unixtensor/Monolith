import { Button } from "@/components/ui/button";
import {
	Sidebar as ShadSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";
import Logout from "./logout";

export default function Sidebar() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<h1>Monolith</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<Button>Servers</Button>
					<Button>Graph</Button>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<Logout />
			</SidebarFooter>
		</ShadSidebar>
	);
}
