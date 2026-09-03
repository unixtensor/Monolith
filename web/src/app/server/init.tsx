import { Navigate, Outlet, useParams } from "react-router";
import JobsProvider from "../providers/jobs";
import { toast } from "sonner";
import GamesProvider from "../providers/games";
import { CurrentGameProvider, CurrentJobProvider } from "../providers/current";

export default function Servers() {
	const { placeId, jobId } = useParams();

	if (placeId === undefined || jobId === undefined) {
		toast.error("Unknown server or place");
		return <Navigate to="/games" replace />;
	}

	return (
		<GamesProvider>
			<JobsProvider placeid={placeId}>
				<CurrentGameProvider placeid={placeId}>
					<CurrentJobProvider jobid={jobId}>
						<Outlet />
					</CurrentJobProvider>
				</CurrentGameProvider>
			</JobsProvider>
		</GamesProvider>
	);
}
