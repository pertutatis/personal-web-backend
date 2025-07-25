import { FullConfig } from '@playwright/test'
import { ApiHelpers } from './fixtures/api-helpers'
import { request } from '@playwright/test'
import { config } from './setup/config'
import { PostgresTestSetup } from './setup/setupTestDb'
import { ArticleSubscribers } from '@/contexts/backoffice/article/infrastructure/DependencyInjection/ArticleSubscribers'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      Logger.info(
        `Checking server at ${url} (attempt ${attempt + 1}/${maxAttempts})...`,
      )
      const response = await fetch(url)
      if (response.ok || response.status === 404) {
        Logger.info('Server is responding with status:', response.status)
        return true
      }
      Logger.info('Server responded with status:', response.status)
    } catch (error) {
      if (error instanceof Error) {
        Logger.info('Server not ready yet, waiting... Error:', error.message)
      } else {
        Logger.info('Server not ready yet, waiting... Unknown error')
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

async function verifyDatabaseConnection(
  apiHelpers: ApiHelpers,
): Promise<boolean> {
  try {
    Logger.info('Verifying database connection...')
    await apiHelpers.cleanupTestData()
    Logger.info('Database connection verified')
    return true
  } catch (error) {
    if (error instanceof Error) {
      Logger.error('Database connection failed:', error.message)
    } else {
      Logger.error('Database connection failed with unknown error')
    }
    return false
  }
}

async function globalSetup(config: FullConfig) {
  const baseURL =
    process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'
  const healthEndpoint = `${baseURL}/api/health`

  Logger.info('Starting global setup...')
  Logger.info('Base URL:', baseURL)

  try {
    // Configurar bases de datos de test
    Logger.info('Setting up test databases...')
    await PostgresTestSetup.setupTestDatabases()
    Logger.info('Test databases setup completed')

    // Inicializar conexiones y suscriptores
    Logger.info('Setting up event subscribers...')
    const blogConnection = await PostgresConnection.create(getBlogConfig())
    await ArticleSubscribers.init(blogConnection)
    Logger.info('Event subscribers initialized')

    // Esperar a que el servidor esté listo
    Logger.info('Waiting for server to be ready...')
    const isServerReady = await waitForServer(healthEndpoint)
    if (!isServerReady) {
      throw new Error('Server failed to start after multiple attempts')
    }
    Logger.info('Server is ready')

    // Crear cliente de API
    const apiRequest = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    let apiHelpers: ApiHelpers | undefined = undefined
    try {
      // Crear helpers de API
      apiHelpers = ApiHelpers.create(apiRequest)

      // Verificar conexión a la base de datos
      const isDatabaseReady = await verifyDatabaseConnection(apiHelpers)
      if (!isDatabaseReady) {
        throw new Error('Database connection failed')
      }

      // Limpiar datos existentes de artículos y libros
      Logger.info('Cleaning up test data...')
      await apiHelpers.cleanupTestData()
      Logger.info('Test data cleaned up')
    } finally {
      if (apiHelpers) {
        await apiHelpers.dispose()
      }
      await apiRequest.dispose()
    }

    Logger.info('Global setup completed successfully')
  } catch (error) {
    Logger.error(
      'Error during global setup:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    throw error
  }
}

export default globalSetup
