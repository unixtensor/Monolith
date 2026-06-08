import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton as ShadSkeleton } from "@/components/ui/skeleton";
import { LoaderCircleIcon } from "lucide-react";
import { SidebarSkeleton } from "./sidebar/init";

function SkeletonHeader() {
	return (
		<header className="flex flex-col justify-center mt-2 mb-2">
			<div className="flex gap-3 items-center ml-3">
				<ShadSkeleton className="h-5 w-5" />
				<Separator orientation="vertical" className="h-4 my-auto" />
				<ShadSkeleton className="h-5 w-50" />
			</div>
			<Separator className="mt-2 mb-2" />
		</header>
	);
}

export default function Skeleton() {
	return (
		<main className="bg-sidebar">
			<SidebarProvider>
				<SidebarSkeleton />
				<main className="bg-background w-full">
					<SkeletonHeader />
					<main className="bg-background w-full h-full">
						<main className="flex justify-center items-center w-full h-[90%]">
							<LoaderCircleIcon className="animate-spin w-10" />
						</main>
					</main>
				</main>
			</SidebarProvider>
		</main>
	);
}
