import { ScreenLoading } from "@/components/Loading";
import ServerError from "@/components/ServerError";
import LoginPage from "@/pages/LoginPage";
import { useAuth } from "@/providers/AuthProvider";
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function RequireAuth() {
	const auth = useAuth();

	if (auth.isLoading) return <ScreenLoading />;
	if (auth.error) return <ServerError>{auth.error.message}</ServerError>;
	if (auth.guest) return <LoginPage />;

	return (
		<Suspense fallback={<ScreenLoading />}>
			<Outlet />
		</Suspense>
	);
}
