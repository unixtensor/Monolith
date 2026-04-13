import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Context } from "./context";

export interface AuthContext {
	guest?: boolean;
	isLoading: boolean;
	error: Error | null;
}

export default function Auth({ children }: { children: React.ReactNode }) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["auth"],
		queryFn: () =>
			axios.get("/api/v1", { validateStatus: () => true }).then((r) => {
				return r.status === 401;
			}),
	});

	return (
		<Context.Provider value={{ guest: data, isLoading, error }}>
			{children}
		</Context.Provider>
	);
}
