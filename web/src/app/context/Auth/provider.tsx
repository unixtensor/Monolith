import { useEffect, useState } from "react";
import { AuthedContext } from "./context";

export interface AuthState {
	statusText: string;
	status: number;
}

export default function Auth({ children }: { children: React.ReactNode }) {
	const [authed, setAuthed] = useState<AuthState | null>(null);

	useEffect(() => {
		fetch("/api/v1/").then((r) =>
			setAuthed({ statusText: r.statusText, status: r.status }),
		);
	}, []);
	return (
		<AuthedContext.Provider value={authed}>
			{children}
		</AuthedContext.Provider>
	);
}
