import { Card } from "@/components/ui/card";
import { CircleX, LoaderPinwheel } from "lucide-react";
import { Outlet } from "react-router";
import useAuth from "./context/Auth/context";
import { useTitle } from "./hooks/useTitle";
import Login from "./login/login";

function Loading() {
	return (
		<main className="flex justify-center items-center h-screen">
			<LoaderPinwheel className="animate-spin-pulse text-[#b3b3b3] w-10 h-10" />
		</main>
	);
}

function Error({ children }: { children: string }) {
	useTitle("Server Error");

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<Card className="flex flex-col content-center items-center p-8 gap-5 bg-[#260909]">
				<CircleX className="w-7 h-7" />
				<p>{children}</p>
			</Card>
		</main>
	);
}

export default function Auth() {
	const auth = useAuth();

	if (!auth) return <Loading />;
	if (auth?.status === 401) return <Login />;
	if (auth?.status !== 200)
		return <Error>{`${auth?.status} - ${auth?.statusText}`}</Error>;
	return <Outlet />;
}
