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

interface Routes {
	[route: string]: string;
}

export default function Navigator() {
	const location = useLocation();

	const current_paths = location.pathname.split("/");
	const current_path = current_paths[current_paths.length - 1];
	const is_root = current_path === root;

	const breadcrumb_paths = current_paths
		.filter((s) => s !== current_path)
		.map((_, i) =>
			i === 0
				? `/${root}` //Prevent re-rendering by pointing at root instead of "/"
				: `/${current_paths.slice(1, i + 1).join("/")}`,
		)
		.reverse(); //Reverse so the most-previous routes show top-first

	const previous_routes: Routes = {};
	breadcrumb_paths.forEach((v) => {
		const r = v.split("/");
		let r_name = r[r.length - 1];
		if (r_name === "") {
			r_name = root;
		}
		previous_routes[v] = r_name;
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
									<Link to={v}>{previous_routes[v]}</Link>
								</NavigationMenuLink>
							))}
						</NavigationMenuContent>
					)}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
