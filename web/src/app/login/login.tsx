import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import useAuth from "../context/Auth/context";
import { useTitle } from "../hooks/useTitle";

function SubmitToken() {
	const input = useRef<HTMLInputElement>(null);
	const [loggingIn, setLoggingIn] = useState<boolean>(false);
	const [loginFail, setLoginFail] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async () => {
		setLoginFail(null);
		setLoggingIn(true);

		const r = await fetch("/api/v1/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input.current?.value),
		});
		if (r.status === 200) {
			navigate("/dashboard", { replace: true });
			location.reload(); //lul
		} else if (r.status === 401) {
			setLoginFail("Incorrect token");
		} else {
			setLoginFail(`${r.status} - ${r.statusText}`);
		}
		setLoggingIn(false);
	};

	return (
		<FieldGroup>
			<Field>
				<Input
					ref={input}
					className={`text-center bg-[#141414] ${loginFail ? "border border-red-500" : "border-none"}`}
					placeholder="••••••"
					id="password"
					type="password"
					required
				/>
				{loginFail && (
					<p className="text-red-500! font-bold">{loginFail}</p>
				)}
			</Field>
			<Field>
				<Button
					disabled={loggingIn}
					onClick={handleLogin}
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
	const auth = useAuth();
	//If the user manually navigates here, check and redirect them
	if (auth?.status === 200) return <Navigate to="/dashboard" replace />;

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col gap-6 w-100 text-center">
				<Card>
					<CardHeader className="my-1">
						<CardTitle>Enter token to gain access</CardTitle>
					</CardHeader>
					<CardContent>
						<form>
							<SubmitToken />
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
