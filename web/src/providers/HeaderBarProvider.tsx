import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import context from "@/lib/context";
import { createContext, useState } from "react";
import { createPortal } from "react-dom";
import Navigator from "@/components/layout/Navigator";

type HeaderBarContext = HTMLElement | null;
const HeaderBarContext = createContext<HeaderBarContext>(null);

export const useHeaderBar = () => {
	return context(
		HeaderBarContext,
		"useHeaderBar must be used within a HeaderBarProvider",
	);
};

export function HeaderBarActions({ children }: { children: React.ReactNode }) {
	const slot = useHeaderBar();
	return slot && createPortal(children, slot);
}

export default function HeaderBarProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [slot, setSlot] = useState<HeaderBarContext>(null);

	return (
		<HeaderBarContext.Provider value={slot}>
			<header className="flex justify-between ml-3 mr-3 pt-2.5 pb-2.5">
				<div className="flex items-center gap-3">
					<SidebarTrigger />
					<Separator orientation="vertical" className="h-4 my-auto" />
					<Navigator />
				</div>
				<div ref={setSlot} className="flex items-center" />
			</header>
			{children}
		</HeaderBarContext.Provider>
	);
}
