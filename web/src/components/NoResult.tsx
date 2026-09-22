import { CircleXIcon } from "lucide-react";

export default function NoResult({ children }: { children: string }) {
	return (
		<div className="flex flex-col gap-5 justify-center items-center">
			<CircleXIcon className="size-10" />
			<h1>{children}</h1>
		</div>
	);
}
