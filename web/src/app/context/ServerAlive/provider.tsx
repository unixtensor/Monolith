import { useEffect, useState } from "react";
import { ServerAliveContext } from "./context";

export interface aliveState {
	ok: boolean;
	status: string;
}

export default function ServerAlive({
	children,
}: {
	children: React.ReactNode;
}) {
	const [alive, setAlive] = useState<aliveState | null>(null);

	useEffect(() => {
		fetch("/api/v1/").then((r) =>
			setAlive({ ok: r.ok, status: `${r.status} | ${r.statusText}` }),
		);
	}, []);
	return (
		<ServerAliveContext.Provider value={alive}>
			{children}
		</ServerAliveContext.Provider>
	);
}
