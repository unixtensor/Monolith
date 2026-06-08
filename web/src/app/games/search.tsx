import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface Refresh {
	queryKey: QueryKey;
}
interface SearchContext {
	searchTerm: string;
}
const Context = createContext<SearchContext>({ searchTerm: "" });

function RefreshButton({ queryKey }: Refresh) {
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const handleRefresh = () => {
		setRefreshing(true);
		queryClient
			.refetchQueries({ queryKey: queryKey })
			.then(() => {
				setRefreshing(false);
				toast.success("Refresh success");
			})
			.catch(() => location.reload());
	};
	return (
		<Button onClick={handleRefresh} disabled={refreshing}>
			<RefreshCwIcon className={refreshing ? "animate-spin" : ""} />
			Refresh
		</Button>
	);
}

export const useSearch = () => {
	const context = useContext(Context);
	if (context === undefined)
		throw new Error("useSearch must be used within a SearchProvider");
	return context;
};

export default function SearchProvider({
	queryKey,
	children,
}: Refresh & { children: React.ReactNode }) {
	const [searchTerm, setSearchTerm] = useState<string>("");

	return (
		<Context.Provider value={{ searchTerm }}>
			<div className="flex gap-2">
				<RefreshButton queryKey={queryKey} />
				<Input
					placeholder="Search by name or id..."
					onChange={(i) => setSearchTerm(i.target.value)}
				/>
			</div>
			{children}
		</Context.Provider>
	);
}
