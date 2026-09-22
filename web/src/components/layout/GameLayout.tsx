import { Navigate, Outlet, useParams } from "react-router";
import { CurrentGameProvider } from "@/providers/CurrentProvider";
import { toast } from "sonner";
import JobsProvider from "@/providers/JobsProvider";

export default function GameLayout() {
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
