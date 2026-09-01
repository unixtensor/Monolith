import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { CircleXIcon, RefreshCwIcon, ServerIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { Header } from "./init";

interface Refresh {
	queryKey: QueryKey;
}
export interface SearchContext {
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

export function NoResult({ children }: { children: string }) {
	return (
		<div className="flex flex-col gap-5 justify-center items-center h-100">
			<CircleXIcon className="size-10" />
			<h1>{children}</h1>
		</div>
	);
}

function SearchInfo({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<Header icon={<ServerIcon />}>{title}</Header>
			<p className="text-sm">{description}</p>
			<div className="flex flex-col gap-5 mt-3">{children}</div>
		</>
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
	placeholder,
	title,
	description,
	children,
}: Refresh & {
	placeholder: string;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	const [searchTerm, setSearchTerm] = useState<string>("");

	return (
		<SearchInfo title={title} description={description}>
			<Context.Provider value={{ searchTerm }}>
				<div className="flex gap-2">
					<RefreshButton queryKey={queryKey} />
					<Input
						placeholder={placeholder}
						onChange={(i) =>
							setSearchTerm(i.target.value.toLowerCase())
						}
					/>
				</div>
				{children}
			</Context.Provider>
		</SearchInfo>
	);
}
