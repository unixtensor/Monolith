import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "@/App";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="system">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<BrowserRouter>
						<App />
						<Toaster />
					</BrowserRouter>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>,
);
