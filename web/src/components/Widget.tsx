import { Card, CardHeader } from "@/components/ui/card";

export default function Widget({
	title,
	icon,
	children,
	...props
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
} & React.ComponentProps<"div">) {
	return (
		<Card className="w-50" {...props}>
			<CardHeader className="flex items-center justify-between [&>svg]:opacity-50 [&>svg]:size-5">
				<p>{title}</p>
				{icon}
			</CardHeader>
			{children}
		</Card>
	);
}
