export default function ApiDocsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center">
						<h1 className="text-lg font-semibold leading-6 text-gray-900">
							Personal Web Backend API
						</h1>
						<a
							href="/"
							className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
						>
							Volver al inicio
						</a>
					</div>
				</div>
			</header>
			<main>
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
			</main>
		</div>
	)
}
