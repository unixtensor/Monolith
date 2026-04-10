import { createContext, useContext } from "react";
import type { AuthState } from "./provider";

export const AuthedContext = createContext<AuthState | null>(null);

export default function useAuth() {
	return useContext(AuthedContext);
}
