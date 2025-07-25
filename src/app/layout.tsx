export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html>
			<body>{children}</body>
		</html>
	)
}

export const metadata = {
	title: 'API',
	description: 'API Only',
}
