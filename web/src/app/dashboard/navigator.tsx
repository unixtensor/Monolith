import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";

const root: string = "games";

interface RouteHistory {
	[route: string]: string;
}

export default function Navigator() {
	const location = useLocation();

	const previous_paths: RouteHistory = {};
	const current_paths = location.pathname.split("/");
	const current_path = current_paths.filter(Boolean).pop();
	const is_root = current_path === root;

	const breadcrumb_paths = current_paths
		.filter((p) => p !== current_path)
		.map((_, i) =>
			i === 0
				? `/${root}` //Prevent re-rendering by pointing at root instead of "/"
				: `/${current_paths.slice(1, i + 1).join("/")}`,
		)
		.reverse(); //Reverse so the most-previous routes show top-first
	breadcrumb_paths.forEach((p) => {
		const r_name = p.split("/").pop() as string;
		//TODO: need to get the game name from useGames somehow instead
		previous_paths[p] = r_name === "" ? root : r_name;
	});

	return (
		<NavigationMenu
			aria-disabled={is_root}
			className={cn(is_root && "pointer-events-none opacity-50")}
		>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						{current_path}
					</NavigationMenuTrigger>
					{!is_root && (
						<NavigationMenuContent>
							{breadcrumb_paths.map((v, k) => (
								<NavigationMenuLink asChild key={k}>
									<Link to={v}>{previous_paths[v]}</Link>
								</NavigationMenuLink>
							))}
						</NavigationMenuContent>
					)}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
