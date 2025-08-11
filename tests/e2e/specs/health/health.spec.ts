import { test, expect } from '@playwright/test'

test('health endpoint should respond', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(data).toMatchObject({
    status: 'ok',
    env: expect.any(String),
    timestamp: expect.any(String),
    auth: expect.any(Object),
  })
})
