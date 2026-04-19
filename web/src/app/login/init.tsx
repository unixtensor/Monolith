import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { LoggedIn, NeedLogin, useAuth } from "../auth/init";
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

		const r = await api.post("", JSON.stringify(input.current?.value), {
			validateStatus: () => true,
		});
		if (LoggedIn(r.status)) {
			navigate("/games", { replace: true });
			queryClient
				.refetchQueries({ queryKey: ["auth"] })
				.catch(() => location.reload());
			toast.success("Login successful");
		} else if (NeedLogin(r.status)) {
			setLoginData({ FailedReason: "Invalid token", Failed: true });
		} else {
			setLoginData({
				FailedReason: `${r.status} - ${r.statusText}`,
				Failed: true,
			});
		}
	};

	return (
		<FieldGroup>
			<Field data-invalid={loginData.Failed}>
				<FieldLabel
					htmlFor="textarea-invalid"
					className="flex items-center"
				>
					{loginData.FailedReason}
				</FieldLabel>
				<Input
					ref={input}
					className="text-center bg-[#141414]"
					placeholder="••••••••••••••••••••••••"
					id="password"
					type="password"
					required
					aria-invalid={loginData.Failed}
				/>
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
	if (!auth.guest) return <Navigate to="/games" replace />;

	return (
		<main className="w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col gap-6 w-100 text-center">
				<Card>
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
