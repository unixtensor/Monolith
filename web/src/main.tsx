import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import Auth from "./app/context/auth/init.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Auth>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</Auth>
		</QueryClientProvider>
	</StrictMode>,
);
