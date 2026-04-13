import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext } from "react";

export interface AuthContext {
	guest?: boolean;
	isLoading: boolean;
	error: Error | null;
}

export function LoggedIn(s: number): boolean {
	return s === 200;
}

export function NeedLogin(s: number): boolean {
	return s === 401;
}

export const Context = createContext<AuthContext>({
	isLoading: true,
	error: null,
});

export function useAuth() {
	return useContext(Context);
}

export default function Auth({ children }: { children: React.ReactNode }) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["auth"],
		queryFn: () =>
			axios
				.get("/api/v1", {
					validateStatus: (s) => NeedLogin(s) || LoggedIn(s),
				})
				.then((r) => NeedLogin(r.status)),
	});
	return (
		<Context.Provider value={{ guest: data, isLoading, error }}>
			{children}
		</Context.Provider>
	);
}
