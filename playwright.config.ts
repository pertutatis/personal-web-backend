import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: false, // Ejecutar tests en serie para evitar problemas de concurrencia
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Un solo worker para evitar problemas de concurrencia
  reporter: process.env.CI ? 'github' : 'html',
  globalSetup: require.resolve('./tests/e2e/global.setup.ts'),
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'api tests',
      use: { 
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      },
      testMatch: /.*\.spec\.ts/,
      timeout: 60000,
      expect: {
        timeout: 10000,
      },
    },
  ],

  // Configuración global de timeouts
  timeout: 60000,
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined, // 1 hora en CI
});
