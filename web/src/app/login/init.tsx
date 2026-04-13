import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import useAuth from "../context/auth/context";
import { useTitle } from "../hooks/useTitle";

interface loginData {
	LoginProgress?: boolean;
	Failed: boolean;
	FailedReason?: string;
}

function SubmitToken() {
	const input = useRef<HTMLInputElement>(null);
	const [loginData, setLoginData] = useState<loginData>({ Failed: false });
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleLogin = async () => {
		setLoginData({ LoginProgress: true, Failed: false });

		const r = await axios.post(
			"/api/v1",
			JSON.stringify(input.current?.value),
			{ validateStatus: () => true },
		);
		if (r.status === 200) {
			navigate("/dashboard", { replace: true });
			queryClient
				.refetchQueries({ queryKey: ["auth"] })
				.catch(() => location.reload());
		} else if (r.status === 401) {
			setLoginData({ FailedReason: "Incorrect token", Failed: true });
		} else {
			setLoginData({
				FailedReason: `${r.status} - ${r.statusText}`,
				Failed: true,
			});
		}
	};

	return (
		<FieldGroup>
			<Field>
				<Input
					ref={input}
					className={`text-center bg-[#141414] ${loginData.Failed ? "border border-red-500" : "border-none"}`}
					placeholder="••••••"
					id="password"
					type="password"
					required
				/>
				{loginData.Failed && (
					<p className="text-red-500! font-bold">
						{loginData.FailedReason}
					</p>
				)}
			</Field>
			<Field>
				<Button
					disabled={loginData.LoginProgress}
					onClick={handleLogin}
					className="h-10"
					type="submit"
				>
					{loginData.LoginProgress ? (
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

	if (!auth) return <></>;
	if (!auth.guest) return <Navigate to="/dashboard" replace />;

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
