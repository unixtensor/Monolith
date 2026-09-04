import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Widget({
	title,
	icon,
	children,
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Card className="w-50">
			<CardHeader className="flex items-center justify-between [&>svg]:opacity-50 [&>svg]:size-5">
				<p>{title}</p>
				{icon}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
