import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
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

const Context = createContext<AuthContext>({
	isLoading: true,
	error: null,
});

export const useAuth = () => {
	const context = useContext(Context);
	if (context === undefined)
		throw new Error("useAuth must be used within a AuthProvider");
	return context;
};

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["auth"],
		queryFn: () =>
			api
				.get<number>("", {
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
