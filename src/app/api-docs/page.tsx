'use client'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
	const [spec, setSpec] = useState<any>(null)

	useEffect(() => {
		const fetchSpec = async () => {
			try {
				const response = await fetch('/api/swagger')
				const data = await response.json()
				setSpec(data)
			} catch (error) {
				console.error('Error fetching API docs:', error)
			}
		}
		fetchSpec()
	}, [])

	if (!spec) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-lg">Cargando documentación de la API...</div>
			</div>
		)
	}

	return (
		<div className="swagger-container bg-white min-h-screen">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">API Documentation</h1>
				<div className="swagger-ui-wrapper border rounded-lg shadow-lg overflow-hidden">
					<SwaggerUI spec={spec} />
				</div>
			</div>
			<style jsx global>{`
				.swagger-ui .info {
					margin: 20px 0;
				}
				.swagger-ui .scheme-container {
					background: transparent;
					box-shadow: none;
					padding: 0;
				}
				.swagger-ui .opblock {
					border-radius: 8px;
					margin-bottom: 16px;
				}
				.swagger-ui .opblock-tag {
					font-size: 1.5rem;
					border-bottom: 1px solid #e5e7eb;
					padding: 16px 0;
				}
			`}</style>
		</div>
	)
}
