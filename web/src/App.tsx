import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import Auth from "./app/init";
import Login from "./app/login/init";

const Servers = lazy(() => import("./app/servers/init"));

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<Auth />}>
				<Route path="*" element={<Navigate to="/servers" replace />} />
				<Route path="/servers" index element={<Servers />} />
				{/*<Route path="/graph" element={<Servers />} />*/}
				<Route path="/:placeId/" />
				<Route path="/:placeId/:jobId" />
			</Route>
		</Routes>
	);
}

export default App;
