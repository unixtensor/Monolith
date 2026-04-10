import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import Auth from "./app/context/Auth/provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Auth>
			<BrowserRouter>
				<App />
				<Toaster />
			</BrowserRouter>
		</Auth>
	</StrictMode>,
);
