import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTitle } from "../hooks/useTitle";
import Sidebar from "./sidebar/init";

export default function Dashboard({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	useTitle(title);

	return (
		<main className="bg-sidebar">
			<SidebarProvider>
				<Sidebar />
				<main className="bg-background w-full m-3 ml-0 overflow-y-auto overflow-x-hidden">
					<header className="flex flex-col justify-center mt-2 mb-2">
						<div className="flex gap-3 items-center ml-3">
							<SidebarTrigger />
							<Separator
								orientation="vertical"
								className="h-4 my-auto"
							/>
							<h1>{title}</h1>
						</div>
						<Separator className="mt-2 mb-2" />
					</header>
					<main className="mx-5">{children}</main>
				</main>
			</SidebarProvider>
		</main>
	);
}
