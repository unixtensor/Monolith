import { createContext, useContext } from "react";
import type { AuthContext } from "./init";

export const Context = createContext<AuthContext | null>(null);

export default function useAuth() {
	return useContext(Context);
}
