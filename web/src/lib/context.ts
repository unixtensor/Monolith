import { useContext } from "react";

export default function context<T>(context: React.Context<T>, err_str: string) {
	const c = useContext(context);
	if (c === undefined) throw new Error(err_str);
	return c;
}
