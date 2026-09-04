import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, ExternalLinkIcon } from "lucide-react";
import { Link, type To } from "react-router";

export function ExternalLink({
	to,
	children,
}: {
	to: To;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-1 w-fit"
		>
			{children}
			<ExternalLinkIcon className="opacity-40 size-4" />
		</Link>
	);
}

export function PromptInfo({
	icon,
	label,
	children,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col">
			<div className="flex gap-1 items-center mb-1">
				{icon}
				<p>{`${label}:`}</p>
			</div>
			<p className="opacity-70 whitespace-pre-wrap">{children}</p>
		</div>
	);
}

export default function Dropdown({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="h-full w-15 rounded-l-none"
				>
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="start">
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
