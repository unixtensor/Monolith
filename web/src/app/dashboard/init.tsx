import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import GamesProvider from "../providers/games";
import Navigator from "./navigator";
import Sidebar from "./sidebar/init";

function Header() {
	return (
		<header className="flex flex-col justify-center mt-2 mb-2">
			<div className="flex gap-3 items-center ml-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="h-4 my-auto" />
				<Navigator />
			</div>
			<Separator className="mt-2 mb-2" />
		</header>
	);
}

export default function Dashboard() {
	return (
		<GamesProvider>
			<SidebarProvider>
				<Sidebar />
				<main className="w-full overflow-x-hidden">
					<Header />
					<main className="mx-4">
						<Outlet />
					</main>
				</main>
			</SidebarProvider>
		</GamesProvider>
	);
}
