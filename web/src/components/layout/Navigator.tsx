import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGames } from "@/providers/GamesProvider";
import { Fragment } from "react";
import { Link, useLocation } from "react-router";

interface Crumb {
	to: string;
	label: React.ReactNode;
	title?: string;
}

const games_crumb: Crumb = { to: "/games", label: "Games" };

const sections: { [segment: string]: Crumb } = {
	games: games_crumb,
	graph: { to: "/graph", label: "Graph" },
};

function shorten(id: string): string {
	return id.length > 14 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
}

function PendingName() {
	return <Skeleton className="inline-block h-4 w-24 align-middle" />;
}

function useCrumbs(): Crumb[] {
	const games = useGames();
	const [section, job_id, leaf] = useLocation()
		.pathname.split("/")
		.filter(Boolean);

	if (!section) return [games_crumb];
	if (sections[section]) return [sections[section]];

	const game = games.data.find((g) => g.Properties.PlaceId === section);
	const crumbs: Crumb[] = [
		games_crumb,
		{
			to: `/${section}`,
			label: games.isLoading ? (
				<PendingName />
			) : (
				(game?.Properties.Name ?? section)
			),
			title: section,
		},
	];
	if (job_id)
		crumbs.push({
			to: `/${section}/${job_id}`,
			label: shorten(job_id),
			title: job_id,
		});
	if (leaf)
		crumbs.push({
			to: `/${section}/${job_id}/${leaf}`,
			label: leaf,
		});
	return crumbs;
}

function fold(crumbs: Crumb[], max: number): [(Crumb | null)[], Crumb[]] {
	if (crumbs.length <= max) return [crumbs, []];
	const tail = max - 1;
	return [[crumbs[0], null, ...crumbs.slice(-tail)], crumbs.slice(1, -tail)];
}

function Label({ crumb, current }: { crumb: Crumb; current: boolean }) {
	const text = (
		<span className="block max-w-36 truncate md:max-w-56">
			{crumb.label}
		</span>
	);

	if (current)
		return <BreadcrumbPage title={crumb.title}>{text}</BreadcrumbPage>;
	return (
		<BreadcrumbLink asChild title={crumb.title}>
			<Link to={crumb.to}>{text}</Link>
		</BreadcrumbLink>
	);
}

function Folded({ crumbs }: { crumbs: Crumb[] }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Show the rest of the path"
				className="rounded-md transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
			>
				<BreadcrumbEllipsis />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-auto min-w-40">
				{crumbs.map((crumb) => (
					<DropdownMenuItem
						key={crumb.to}
						asChild
						className="max-w-64"
					>
						<Link to={crumb.to}>
							<span className="min-w-0 truncate">
								{crumb.label}
							</span>
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function Navigator() {
	const crumbs = useCrumbs();
	const is_mobile = useIsMobile();
	const [trail, folded] = fold(crumbs, is_mobile ? 2 : 4);

	return (
		<Breadcrumb className="min-w-0">
			<BreadcrumbList className="flex-nowrap">
				{trail.map((crumb, i) => (
					<Fragment key={crumb ? crumb.to : i}>
						{i > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							{crumb ? (
								<Label
									crumb={crumb}
									current={i === trail.length - 1}
								/>
							) : (
								<Folded crumbs={folded} />
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
