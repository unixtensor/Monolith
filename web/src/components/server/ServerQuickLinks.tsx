import { Button } from "@/components/ui/button";
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenu,
} from "@/components/ui/dropdown-menu";
import type { Game } from "@/providers/GamesProvider";
import { HeaderBarActions } from "@/providers/HeaderBarProvider";
import type { Job } from "@/providers/JobsProvider";
import { ChevronDownIcon } from "lucide-react";
import { Link } from "react-router";

export default function ServerQuickLinks({
	game,
	job,
}: {
	game: Game;
	job: Job;
}) {
	return (
		<HeaderBarActions>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						Quick Links <ChevronDownIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link
							to={`/${game.Properties.PlaceId}/${job.Id}/sandbox`}
						>
							Sandbox
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</HeaderBarActions>
	);
}
