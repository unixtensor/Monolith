import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TriangleAlertIcon } from "lucide-react";

export default function LiveServerWarning() {
	return (
		<Tooltip>
			<TooltipTrigger>
				<div className="bg-secondary p-2 rounded-full [&>svg]:size-4 [&>svg]:text-yellow-300">
					<TriangleAlertIcon />
				</div>
			</TooltipTrigger>
			<TooltipContent>
				Websocket's are not supported in live games. Modifications will
				have a noticable delay before they take effect.
			</TooltipContent>
		</Tooltip>
	);
}
