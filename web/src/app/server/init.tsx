import { Navigate, Outlet, useParams } from "react-router";
import JobsProvider from "../providers/jobs";
import { toast } from "sonner";
import { CurrentGameProvider, CurrentJobProvider } from "../providers/current";

export default function Servers() {
	const { placeId, jobId } = useParams();

	if (placeId === undefined || jobId === undefined) {
		toast.error("Unknown server or place");
		return <Navigate to="/games" replace />;
	}

	return (
		<JobsProvider placeid={placeId}>
			<CurrentGameProvider placeid={placeId}>
				<CurrentJobProvider jobid={jobId}>
					<Outlet />
				</CurrentJobProvider>
			</CurrentGameProvider>
		</JobsProvider>
	);
}
