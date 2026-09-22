import { Card } from "@/components/ui/card";
import { useTitle } from "@/hooks/useTitle";
import { CircleX } from "lucide-react";

export default function ServerError({ children }: { children: string }) {
	useTitle("Server Error");

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<Card className="flex flex-col content-center items-center p-8 gap-5">
				<CircleX className="w-7 h-7" />
				<p>{children}</p>
			</Card>
		</main>
	);
}
