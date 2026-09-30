import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/useTitle";
import { registerLuau } from "@/lib/luau.monarch";
import { useTheme } from "@/providers/ThemeProvider";
import { Editor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef } from "react";

const default_luau_code: string = 'print("Hello World!")\n';
const model_path: string = "inmemory://sandbox/main.luau";

const monaco_registered = new WeakSet<Monaco>();

function monaco_register_luau(monaco: Monaco) {
	if (monaco_registered.has(monaco)) return;
	monaco_registered.add(monaco);
	registerLuau(monaco);
}

function Explorer() {
	return (
		<Card className="w-150 gap-2 h-fit">
			<CardHeader>
				<Tabs defaultValue="explorer">
					<TabsList className="w-full">
						<TabsTrigger value="explorer">Explorer</TabsTrigger>
						<TabsTrigger value="diff">Changes</TabsTrigger>
					</TabsList>
				</Tabs>
			</CardHeader>
		</Card>
	);
}

function useEditorTheme() {
	const current_theme = useTheme();
	const system_theme = function () {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "luau-dark"
			: "luau-light";
	};
	return (
		(current_theme.theme === "system" && system_theme()) ||
		(current_theme.theme === "light" && "luau-light") ||
		"luau-dark"
	);
}

export default function SandboxPage() {
	useTitle("Sandbox");
	const editor_theme = useEditorTheme();
	const editor_ref = useRef<editor.IStandaloneCodeEditor | null>(null);

	return (
		<div className="flex flex-col overflow-hidden gap-2 h-full">
			{/*<Menu monaco={editor_ref} />*/}
			<div className="flex gap-5 h-full">
				<div className="size-full border rounded-xl p-1">
					<Editor
						theme={editor_theme}
						defaultValue={default_luau_code}
						path={model_path}
						keepCurrentModel
						beforeMount={monaco_register_luau}
						onMount={(i) => {
							editor_ref.current = i;
						}}
						height="100%"
						language="luau"
						defaultLanguage="luau"
						options={{
							automaticLayout: true,
							fontSize: 16,
						}}
					/>
				</div>
				<Explorer />
			</div>
		</div>
	);
}
