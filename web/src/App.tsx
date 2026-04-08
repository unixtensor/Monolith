import { Route, Routes } from "react-router";
import GetConnected from "./app/init";
import Login from "./app/login/login";

function App() {
	return (
		<Routes>
			<Route element={<GetConnected />}>
				<Route path="/login" element={<Login />} />
				<Route index element={<Login />} />
				<Route path="/games/:id" />
			</Route>
		</Routes>
	);
}

export default App;
