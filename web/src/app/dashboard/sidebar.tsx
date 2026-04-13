import {
	Sidebar as ShadSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";

export default function Sidebar() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<h1>Monolith</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter />
		</ShadSidebar>
	);
}
