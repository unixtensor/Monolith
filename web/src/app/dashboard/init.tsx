import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Outlet } from "react-router";
import ServersProvider from "./games-servers";
import Navigator from "./navigator";
import Sidebar from "./sidebar/init";
import Skeleton from "./skeleton";

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
		<Suspense fallback={<Skeleton />}>
			<main className="bg-sidebar">
				<ServersProvider>
					<SidebarProvider>
						<Sidebar />
						<main className="bg-background w-full overflow-x-hidden">
							<Header />
							<main className="mx-4">
								<Outlet />
							</main>
						</main>
					</SidebarProvider>
				</ServersProvider>
			</main>
		</Suspense>
	);
}
