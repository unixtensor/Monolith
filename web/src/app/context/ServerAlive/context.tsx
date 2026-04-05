import { createContext, useContext } from "react";
import type { aliveState } from "./provider";

export const ServerAliveContext = createContext<aliveState | null>(null);

export default function useServerAlive() {
	return useContext(ServerAliveContext);
}
