import { JwtTokenGenerator } from '../JwtTokenGenerator'
import { InvalidToken } from '../../domain/InvalidToken'
import { TokenPayload } from '../../domain/JWTGenerator'

describe('JwtTokenGenerator', () => {
  const SECRET_KEY = 'test_secret'
  let generator: JwtTokenGenerator

  beforeEach(() => {
    generator = new JwtTokenGenerator(SECRET_KEY, '1h')
  })

  const validPayload: TokenPayload = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
  }

  describe('generate', () => {
    it('should generate a valid JWT token', async () => {
      const token = await generator.generate(validPayload)

      expect(token).toEqual(expect.any(String))
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('verify', () => {
    it('should verify and decode a valid token', async () => {
      const token = await generator.generate(validPayload)
      const decoded = await generator.verify(token)

      expect(decoded).toEqual(expect.objectContaining(validPayload))
    })

    it('should throw InvalidToken for a malformed token', async () => {
      const invalidToken = 'invalid.token.format'

      await expect(generator.verify(invalidToken)).rejects.toThrow(InvalidToken)
    })

    it('should throw InvalidToken for an expired token', async () => {
      const shortLivedGenerator = new JwtTokenGenerator(SECRET_KEY, '1s')
      const token = await shortLivedGenerator.generate(validPayload)

      // Esperar a que el token expire
      await new Promise((resolve) => setTimeout(resolve, 1100))

      await expect(shortLivedGenerator.verify(token)).rejects.toThrow(
        InvalidToken,
      )
    })

    it('should throw InvalidToken for a token signed with a different key', async () => {
      const otherGenerator = new JwtTokenGenerator('different-secret', '1h')
      const token = await otherGenerator.generate(validPayload)

      await expect(generator.verify(token)).rejects.toThrow(InvalidToken)
    })

    it('should throw InvalidToken when payload is missing required fields', async () => {
      const invalidPayload = {
        someOtherField: 'value',
      }

      const token = await generator.generate(invalidPayload as any)

      await expect(generator.verify(token)).rejects.toThrow(InvalidToken)
    })
  })
})
