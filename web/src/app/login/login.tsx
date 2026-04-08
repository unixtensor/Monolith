import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useTitle } from "../hooks/useTitle";

function SecretSubmit() {
	const key = useRef<HTMLInputElement>(null);
	const login = useRef<HTMLButtonElement>(null);
	const [loggingIn, setLogginIn] = useState<boolean>(false);

	const login_click = () => {
		setLogginIn(true);
	};

	return (
		<FieldGroup>
			<Field>
				<Input
					ref={key}
					className="text-center bg-[#141414] border-none"
					placeholder="••••••"
					id="password"
					type="password"
					required
				/>
			</Field>
			<Field>
				<Button
					ref={login}
					disabled={loggingIn}
					onClick={login_click}
					className="h-10"
					type="submit"
				>
					{loggingIn ? (
						<LoaderCircle className="animate-spin" />
					) : (
						"Login"
					)}
				</Button>
			</Field>
		</FieldGroup>
	);
}

export default function Login() {
	useTitle("Login");

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col gap-6 w-100 text-center">
				<Card>
					<CardHeader className="my-1">
						<CardTitle>Enter token to gain access</CardTitle>
					</CardHeader>
					<CardContent>
						<form>
							<SecretSubmit />
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
