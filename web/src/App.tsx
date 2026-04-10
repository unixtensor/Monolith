import { Route, Routes } from "react-router";
import Dashboard from "./app/dashboard/init";
import Auth from "./app/init";
import Login from "./app/login/login";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<Auth />}>
				<Route path="*" element={<Dashboard />} />
				<Route path="/dashboard" index element={<Dashboard />} />
				<Route path="/:placeId/:jobId" />
			</Route>
		</Routes>
	);
}

export default App;
