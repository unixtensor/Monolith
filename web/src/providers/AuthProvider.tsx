import api from "@/lib/axios";
import context from "@/lib/context";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

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

const AuthContext = createContext<AuthContext>({
	isLoading: true,
	error: null,
});

export const useAuth = () => {
	return context(AuthContext, "useAuth must be used within a AuthProvider");
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
		<AuthContext.Provider value={{ guest: data, isLoading, error }}>
			{children}
		</AuthContext.Provider>
	);
}
