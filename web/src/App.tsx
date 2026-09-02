import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import Auth from "./app/init";
import Login from "./app/login/init";
import Games from "./app/games/init";
import Servers from "./app/games/servers";
import Server from "./app/server/init";
import ServerDashboard from "./app/server/dashboard";

const Dashboard = lazy(() => import("./app/dashboard/init"));

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Navigate to="/games" replace />} />
			<Route element={<Auth />}>
				<Route element={<Dashboard />}>
					<Route path="/games" index element={<Games />} />
					<Route path="/:placeId/" element={<Servers />} />

					<Route element={<Server />}>
						<Route
							path="/:placeId/:jobId"
							element={<ServerDashboard />}
						/>
						<Route path="/:placeId/:jobId/:userName" />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
