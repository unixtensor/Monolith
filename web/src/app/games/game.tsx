import { Navigate, Outlet, useParams } from "react-router";
import { CurrentGameProvider } from "../providers/current";
import { toast } from "sonner";
import JobsProvider from "../providers/jobs";

export default function Game() {
	const { placeId } = useParams();

	if (!placeId) {
		toast.error("Unknown place");
		return <Navigate to="/games" replace />;
	}
	return (
		<CurrentGameProvider placeid={placeId}>
			<JobsProvider placeid={placeId}>
				<Outlet />
			</JobsProvider>
		</CurrentGameProvider>
	);
}
