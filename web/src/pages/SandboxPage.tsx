import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/useTitle";
import { registerLuau } from "@/lib/luau.monarch";
import { Editor } from "@monaco-editor/react";

const default_luau_code: string = 'print("Hello World!")\n';

function Explorer() {
	return (
		<Card className="w-full gap-2 h-fit">
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

export default function SandboxPage() {
	useTitle("Sandbox");

	return (
		<div className="flex gap-5 h-full min-h-0 overflow-hidden">
			<div className="size-full">
				<Editor
					theme="luau-dark"
					value={default_luau_code}
					beforeMount={registerLuau}
					height="100%"
					language="luau"
					defaultLanguage="luau"
					options={{ automaticLayout: true }}
				/>
			</div>
			<Explorer />
		</div>
	);
}
