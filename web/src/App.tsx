import { Route, Routes } from "react-router";
import GetConnected from "./app/init";
import Login from "./app/Login/Login";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<GetConnected />}>
				<Route index element={<Login />} />
				<Route path="/games/:id" />
			</Route>
		</Routes>
	);
}

export default App;
