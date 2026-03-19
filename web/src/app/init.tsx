import { Card } from "@/components/ui/card";
import { CircleX, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useTitle } from "./hooks/useTitle";

type Connection = number;
const Connected = {
	True: 0,
	False: 1,
	Error: 2,
};

function Loading() {
	return (
		<main className="flex justify-center items-center h-screen">
			<LoaderPinwheel className="animate-spin-pulse text-[#b3b3b3] w-10 h-10" />
		</main>
	);
}

function Error() {
	useTitle("Server Error");

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<Card className="flex flex-col content-center items-center p-8 gap-5 bg-[#140003]">
				<CircleX />
				<p>Server is unreachable</p>
			</Card>
		</main>
	);
}

function useServerAlive(): Connection | null {
	const [connected, setConnected] = useState<Connection | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const con_req = await fetch("/api/v1/connected");
				if (!con_req.ok) return setConnected(Connected.Error);
				const isConnected = await con_req.json();
				setConnected(isConnected ? Connected.True : Connected.False);
			} catch {
				setConnected(Connected.Error);
			}
		})();
	}, []);
	return connected;
}

export default function GetConnected() {
	const s_alive = useServerAlive();

	if (s_alive === null) return <Loading />;
	if (s_alive === Connected.True) return <Outlet />;
	if (s_alive === Connected.False) return <Navigate to="/login" replace />;
	return <Error />;
}
