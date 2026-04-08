import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import ServerAlive from "./app/context/ServerAlive/provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ServerAlive>
			<BrowserRouter>
				<App />
				<Toaster />
			</BrowserRouter>
		</ServerAlive>
	</StrictMode>,
);
