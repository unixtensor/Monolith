import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
	CircleXIcon,
	ExternalLinkIcon,
	HardDriveIcon,
	LoaderCircleIcon,
	RefreshCwIcon,
	TagIcon,
	UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Dashboard from "../dashboard/init";
import ServersProvider, { useServers } from "../dashboard/servers";

function NoGamesRunning() {
	return (
		<div className="flex flex-col gap-5 justify-center items-center h-100">
			<CircleXIcon className="h-10 w-10" />
			<h1>No games are running</h1>
		</div>
	);
}

function Loading() {
	return (
		<div className="flex justify-center items-center h-100">
			<LoaderCircleIcon className="animate-spin h-10 w-10" />
		</div>
	);
}

function DisplayServers() {
	const servers = useServers();

	if (servers.isLoading) return <Loading />;
	if (servers.data.length === 0) return <NoGamesRunning />;

	return servers.data.map((server) => (
		<Link to={`/${server.PlaceId}`} key={server.JobId}>
			<Button className="w-full bg-secondary hover:bg-primary flex justify-between gap-5 min-h-22 p-5">
				<div className="flex items-center gap-5">
					<img
						src={
							server.JobId !== "studio"
								? "https://upload.wikimedia.org/wikipedia/commons/2/29/Roblox_Icon_Transparent.png"
								: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Roblox_Studio_icon_2025.svg"
						}
						className="w-15 h-15"
					/>
					<div className="flex flex-col gap-2 text-left">
						<div className="flex items-center gap-3">
							<h1 className="font-bold text-lg">{server.Name}</h1>
							<div className="bg-green-500 w-3 h-3 rounded-full"></div>
						</div>
						<div className="flex gap-3 opacity-60 [&>div]:flex [&>div]:items-center [&>div]:gap-1">
							<div>
								<TagIcon />
								<h2>{server.PlaceId}</h2>
							</div>
							<div>
								<UsersIcon />
								<h2>{server.MaxPlayers}</h2>
							</div>
						</div>
					</div>
				</div>
				<ExternalLinkIcon />
			</Button>
		</Link>
	));
}

function Search() {
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const handleRefresh = () => {
		setRefreshing(true);
		queryClient
			.refetchQueries({ queryKey: ["games-servers"] })
			.then(() => {
				setRefreshing(false);
				toast.success("Games refreshed");
			})
			.catch(() => location.reload());
	};
	return (
		<div>
			<div className="flex gap-2">
				<Button onClick={handleRefresh} disabled={refreshing}>
					<RefreshCwIcon
						className={refreshing ? "animate-spin" : ""}
					/>{" "}
					Refresh
				</Button>
				<Input placeholder="Search by name, players, id..." />
			</div>
		</div>
	);
}

export default function Servers() {
	return (
		<ServersProvider>
			<Dashboard title="Servers">
				<header className="flex gap-3 mt-3 mb-5">
					<HardDriveIcon />
					<div>Active Games</div>
				</header>
				<div className="flex flex-col gap-5 mt-3">
					<Search />
					<DisplayServers />
				</div>
			</Dashboard>
		</ServersProvider>
	);
}
