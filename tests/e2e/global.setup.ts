import { FullConfig } from '@playwright/test';
import { ApiHelpers } from './fixtures/api-helpers';
import { request } from '@playwright/test';

async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`Checking server at ${url} (attempt ${attempt + 1}/${maxAttempts})...`);
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        console.log('Server is responding with status:', response.status);
        return true;
      }
      console.log('Server responded with status:', response.status);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Server not ready yet, waiting... Error:', error.message);
      } else {
        console.log('Server not ready yet, waiting... Unknown error');
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

async function verifyDatabaseConnection(apiHelpers: ApiHelpers): Promise<boolean> {
  try {
    console.log('Verifying database connection...');
    await apiHelpers.cleanupTestData();
    console.log('Database connection verified');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database connection failed:', error.message);
    } else {
      console.error('Database connection failed with unknown error');
    }
    return false;
  }
}

async function globalSetup(config: FullConfig) {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
  const healthEndpoint = `${baseURL}/api/health`;

  console.log('Starting global setup...');
  console.log('Base URL:', baseURL);

  // Esperar a que el servidor esté listo
  console.log('Waiting for server to be ready...');
  const isServerReady = await waitForServer(healthEndpoint);
  if (!isServerReady) {
    throw new Error('Server failed to start after multiple attempts');
  }
  console.log('Server is ready');

  // Crear cliente de API
  const apiRequest = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  let apiHelpers: ApiHelpers | undefined = undefined;
  try {
    // Crear helpers de API
    apiHelpers = ApiHelpers.create(apiRequest);

    // Verificar conexión a la base de datos
    const isDatabaseReady = await verifyDatabaseConnection(apiHelpers);
    if (!isDatabaseReady) {
      throw new Error('Database connection failed');
    }

    // Limpiar datos existentes
    console.log('Cleaning up test data...');
    await apiHelpers.cleanupTestData();
    console.log('Test data cleaned up');

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during global setup:', error.message);
    } else {
      console.error('Unknown error during global setup');
    }
    throw error;
  } finally {
    if (apiHelpers) {
      await apiHelpers.dispose();
    }
    await apiRequest.dispose();
  }

  console.log('Global setup completed successfully');
}

export default globalSetup;
