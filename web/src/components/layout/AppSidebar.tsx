import { Badge } from "@/components/ui/badge";
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
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGames, type Game } from "@/providers/GamesProvider";
import {
	ChevronRight,
	GitForkIcon,
	ServerIcon,
	TriangleAlertIcon,
	WorkflowIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import LogoutButton from "./LogoutButton";

function useSection(): string {
	return useLocation().pathname.split("/").filter(Boolean)[0] ?? "";
}

function Brand() {
	return (
		<div className="flex items-center gap-2 px-2 py-1">
			<h1 className="text-base leading-none font-black tracking-tight">
				Monolith
			</h1>
			<Badge
				variant="secondary"
				className="px-1.5 text-[0.625rem] tracking-wide uppercase"
			>
				alpha
			</Badge>
		</div>
	);
}

function ListNotice({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<SidebarMenuSubItem>
			<span
				className={cn(
					"flex h-7 items-center gap-2 px-2 text-xs text-sidebar-foreground/60",
					className,
				)}
			>
				{children}
			</span>
		</SidebarMenuSubItem>
	);
}

function GameRow({ game, active }: { game: Game; active: boolean }) {
	const { Name, PlaceId } = game.Properties;
	const servers = game.Jobs.length;
	const idle = servers === 0;
	const label = (
		<>
			<span className="min-w-0 flex-1 truncate">{Name}</span>
			<span className="shrink-0 text-xs tabular-nums opacity-60">
				{servers}
			</span>
		</>
	);

	return (
		<SidebarMenuSubItem>
			<SidebarMenuSubButton
				asChild
				isActive={active}
				aria-disabled={idle}
				title={idle ? `${Name} has no servers running` : undefined}
			>
				{idle ? (
					<span>{label}</span>
				) : (
					<Link to={`/${PlaceId}`}>{label}</Link>
				)}
			</SidebarMenuSubButton>
		</SidebarMenuSubItem>
	);
}

function GamesList() {
	const games = useGames();
	const section = useSection();

	if (games.isLoading) {
		return [0, 1, 2].map((row) => (
			<SidebarMenuSubItem key={row}>
				<SidebarMenuSkeleton className="h-7" />
			</SidebarMenuSubItem>
		));
	}
	if (games.error) {
		return (
			<ListNotice className="text-destructive">
				<TriangleAlertIcon className="size-3.5 shrink-0" />
				Could not load games
			</ListNotice>
		);
	}
	if (games.data.length === 0) {
		return <ListNotice>No games found</ListNotice>;
	}
	return games.data.map((game) => (
		<GameRow
			key={game.Properties.PlaceId}
			game={game}
			active={game.Properties.PlaceId === section}
		/>
	));
}

function GamesSection() {
	const section = useSection();

	return (
		<Collapsible defaultOpen asChild>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					isActive={section === "games"}
					tooltip="Games"
				>
					<Link to="/games">
						<ServerIcon />
						<span>Games</span>
					</Link>
				</SidebarMenuButton>
				<CollapsibleTrigger asChild>
					<SidebarMenuAction className="data-[state=open]:rotate-90">
						<ChevronRight />
						<span className="sr-only">Toggle the game list</span>
					</SidebarMenuAction>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						<GamesList />
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

function NavigationGroup() {
	const section = useSection();

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					<GamesSection />
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={section === "graph"}
							tooltip="Graph"
						>
							<Link to="/graph">
								<WorkflowIcon />
								<span>Graph</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export function SidebarSkeleton() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-12 rounded-4xl" />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{[0, 1].map((row) => (
								<SidebarMenuItem key={row}>
									<SidebarMenuSkeleton showIcon />
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Skeleton className="h-9 w-full" />
			</SidebarFooter>
			<SidebarRail />
		</ShadSidebar>
	);
}

export default function AppSidebar() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<Brand />
			</SidebarHeader>
			<SidebarContent>
				<NavigationGroup />
			</SidebarContent>
			<SidebarFooter>
				<LogoutButton />
			</SidebarFooter>
			<SidebarRail />
		</ShadSidebar>
	);
}
