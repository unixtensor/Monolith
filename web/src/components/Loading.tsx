import { LoaderCircleIcon } from "lucide-react";

export function Loading() {
	return (
		<div className="flex justify-center items-center h-100">
			<LoaderCircleIcon className="animate-spin size-10" />
		</div>
	);
}

export function ScreenLoading() {
	return (
		<main className="flex justify-center items-center h-screen">
			<LoaderCircleIcon className="animate-spin w-10" />
		</main>
	);
}
