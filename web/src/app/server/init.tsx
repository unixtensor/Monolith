import { Navigate, Outlet, useParams } from "react-router";
import { toast } from "sonner";
import { CurrentJobProvider } from "../providers/current";

export default function Servers() {
	const { placeId, jobId } = useParams();

	if (placeId === undefined || jobId === undefined) {
		toast.error("Unknown server or place");
		return <Navigate to="/games" replace />;
	}

	return (
		<CurrentJobProvider jobid={jobId}>
			<Outlet />
		</CurrentJobProvider>
	);
}
