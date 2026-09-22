import GameLayout from "@/components/layout/GameLayout";
import ServerLayout from "@/components/layout/ServerLayout";
import RequireAuth from "@/components/RequireAuth";
import GamesPage from "@/pages/GamesPage";
import LoginPage from "@/pages/LoginPage";
import ServerPage from "@/pages/ServerPage";
import ServersPage from "@/pages/ServersPage";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const DashboardLayout = lazy(
	() => import("@/components/layout/DashboardLayout"),
);

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="*" element={<Navigate to="/games" replace />} />
			<Route element={<RequireAuth />}>
				<Route element={<DashboardLayout />}>
					<Route path="/games" index element={<GamesPage />} />

					<Route element={<GameLayout />}>
						<Route path="/:placeId/" element={<ServersPage />} />
						<Route element={<ServerLayout />}>
							<Route
								path="/:placeId/:jobId"
								element={<ServerPage />}
							/>
							<Route path="/:placeId/:jobId/:userName" />
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
