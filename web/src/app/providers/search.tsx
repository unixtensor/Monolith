import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import context from "@/lib/context";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { CircleXIcon, RefreshCwIcon } from "lucide-react";
import { createContext, useState } from "react";
import { toast } from "sonner";

interface Refresh {
	queryKey: QueryKey;
}
export interface SearchContext {
	searchTerm: string;
}
const SearchContext = createContext<SearchContext>({
	searchTerm: "",
});

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
		<div className="flex flex-col gap-5 justify-center items-center">
			<CircleXIcon className="size-10" />
			<h1>{children}</h1>
		</div>
	);
}

export const useSearch = () => {
	return context(
		SearchContext,
		"useSearch must be used within a SearchProvider",
	);
};

export default function SearchProvider({
	queryKey,
	placeholder,
	title,
	description,
	icon,
	filters,
	children,
}: Refresh & {
	placeholder: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	filters?: React.ReactNode;
	children: React.ReactNode;
}) {
	const [searchTerm, setSearchTerm] = useState<string>("");

	const IconTitle = () => {
		const InputRefresh = (
			<div className="flex w-[50%] gap-2">
				<Input
					placeholder={placeholder}
					onChange={(i) =>
						setSearchTerm(i.target.value.toLowerCase())
					}
				/>
				<RefreshButton queryKey={queryKey} />
			</div>
		);

		return (
			<div className="flex items-center justify-between">
				<div className="flex gap-3 items-center">
					<div className="bg-secondary p-3 rounded-full [&>svg]:size-4">
						{icon}
					</div>
					<strong className="text-lg">{title}</strong>
				</div>
				{InputRefresh}
			</div>
		);
	};

	return (
		<SearchContext.Provider value={{ searchTerm }}>
			<IconTitle />
			<div className="flex justify-between items-center">
				<p className="opacity-50">{description}</p>
				{filters}
			</div>
			{children}
		</SearchContext.Provider>
	);
}
