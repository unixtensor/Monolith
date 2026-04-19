import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import Auth from "./app/init";
import Login from "./app/login/init";

const Dashboard = lazy(() => import("./app/dashboard/init"));
const Games = lazy(() => import("./app/games/init"));

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Navigate to="/games" replace />} />
			<Route element={<Auth />}>
				<Route element={<Dashboard />}>
					<Route path="/games" index element={<Games />} />
					<Route path="/:placeId/" />
					<Route path="/:placeId/:jobId" />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
