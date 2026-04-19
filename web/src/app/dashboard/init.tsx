import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import ServersProvider from "./games";
import Sidebar from "./sidebar/init";

function Header() {
	return (
		<header className="flex flex-col justify-center mt-2 mb-2">
			<div className="flex gap-3 items-center ml-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="h-4 my-auto" />
				<h1>Dashboard</h1>
			</div>
			<Separator className="mt-2 mb-2" />
		</header>
	);
}

export default function Dashboard() {
	return (
		<main className="bg-sidebar">
			<ServersProvider>
				<SidebarProvider>
					<Sidebar />
					<main className="bg-background w-full overflow-y-auto overflow-x-hidden">
						<Header />
						<main className="mx-4">
							<Outlet />
						</main>
					</main>
				</SidebarProvider>
			</ServersProvider>
		</main>
	);
}
