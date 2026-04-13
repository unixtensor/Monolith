import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircle, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Logout() {
	const [clicked, setClicked] = useState<boolean>(false);
	const navigator = useNavigate();
	const queryClient = useQueryClient();

	const handleLogout = async () => {
		setClicked(true);

		const r = await axios.post("/api/v1/logout");
		if (r.status === 200) {
			navigator("/", { replace: true });
			queryClient
				.refetchQueries({ queryKey: ["auth"] })
				.catch(() => location.reload());
			toast.success("Successfully logged out");
		} else {
			toast.error("Logout was not successful.");
		}
		setClicked(false);
	};

	return (
		<Button variant="destructive" onClick={handleLogout} disabled={clicked}>
			{clicked ? (
				<LoaderCircle className="animate-spin" />
			) : (
				<>
					<LogOutIcon />
					Logout
				</>
			)}
		</Button>
	);
}
