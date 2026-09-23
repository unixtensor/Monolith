import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import GamesProvider from "@/providers/GamesProvider";
import AppSidebar from "./AppSidebar";
import Navigator from "./Navigator";
import { TooltipProvider } from "@/components/ui/tooltip";

function Header() {
	return (
		<header className="flex flex-col justify-center mt-1 mb-1">
			<div className="flex gap-3 items-center ml-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="h-4 my-auto" />
				<Navigator />
			</div>
			<Separator className="mt-2 mb-2" />
		</header>
	);
}

export default function DashboardLayout() {
	return (
		<GamesProvider>
			<SidebarProvider>
				<TooltipProvider>
					<AppSidebar />
					<main className="flex flex-col w-full h-svh overflow-hidden">
						<Header />
						<main className="flex-1 min-h-0 mx-4 pb-4 overflow-x-hidden overflow-y-auto">
							<Outlet />
						</main>
					</main>
				</TooltipProvider>
			</SidebarProvider>
		</GamesProvider>
	);
}
