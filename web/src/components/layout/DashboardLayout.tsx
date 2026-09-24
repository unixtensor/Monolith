import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import GamesProvider from "@/providers/GamesProvider";
import HeaderBarProvider from "@/providers/HeaderBarProvider";
import AppSidebar from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout() {
	return (
		<GamesProvider>
			<SidebarProvider>
				<TooltipProvider>
					<AppSidebar />
					<main className="flex flex-col w-full h-svh overflow-hidden">
						<HeaderBarProvider>
							<main className="flex-1 min-h-0 mx-4 pb-4 overflow-x-hidden overflow-y-auto">
								<Outlet />
							</main>
						</HeaderBarProvider>
					</main>
				</TooltipProvider>
			</SidebarProvider>
		</GamesProvider>
	);
}
