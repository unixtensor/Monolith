import { Card } from "@/components/ui/card";
import { CircleX, LoaderPinwheel } from "lucide-react";
import { Outlet } from "react-router";
import { useAuth } from "./auth/init";
import { useTitle } from "./hooks/useTitle";
import Login from "./login/init";

function Loading() {
	return (
		<main className="flex justify-center items-center h-screen">
			<LoaderPinwheel className="animate-spin-pulse w-10 h-10" />
		</main>
	);
}

function ServerError({ children }: { children: string }) {
	useTitle("Server Error");

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<Card className="flex flex-col content-center items-center p-8 gap-5 border border-destructive">
				<CircleX className="w-7 h-7" />
				<p>{children}</p>
			</Card>
		</main>
	);
}

export default function Auth() {
	const auth = useAuth();

	if (auth.isLoading) return <Loading />;
	if (auth.error) return <ServerError>{auth.error.message}</ServerError>;
	if (auth.guest) return <Login />;
	return <Outlet />;
}
