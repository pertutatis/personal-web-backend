import { LoginUser } from '../LoginUser'
import { AuthRepository } from '../../domain/AuthRepository'
import { JWTGenerator } from '../../domain/JWTGenerator'
import { User } from '../../domain/User'
import { EmailVO } from '../../domain/EmailVO'
import { UserId } from '../../domain/UserId'
import { InvalidCredentials } from '../InvalidCredentials'

describe('LoginUser', () => {
  let repository: jest.Mocked<AuthRepository>
  let jwtGenerator: jest.Mocked<JWTGenerator>
  let loginUser: LoginUser

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    }

    jwtGenerator = {
      generate: jest.fn(),
      verify: jest.fn()
    }

    loginUser = new LoginUser(repository, jwtGenerator)
  })

  it('should login successfully with valid credentials', async () => {
    // Given
    const userId = '550e8400-e29b-41d4-a716-446655440000'
    const email = 'test@example.com'
    const password = 'Valid1Password!'
    const token = 'generated.jwt.token'

    const user = User.create({
      id: new UserId(userId),
      email: new EmailVO(email),
      plainPassword: password
    })

    repository.findByEmail.mockResolvedValue(user)
    jwtGenerator.generate.mockResolvedValue(token)

    // When
    const result = await loginUser.run({ email, password })

    // Then
    expect(result).toEqual({ token })
    expect(repository.findByEmail).toHaveBeenCalledWith(
      expect.any(EmailVO)
    )
    expect(jwtGenerator.generate).toHaveBeenCalledWith({
      id: userId,
      email
    })
  })

  it('should throw InvalidCredentials when user not found', async () => {
    // Given
    const email = 'nonexistent@example.com'
    const password = 'Valid1Password!'

    repository.findByEmail.mockResolvedValue(null)

    // When/Then
    await expect(
      loginUser.run({ email, password })
    ).rejects.toThrow(InvalidCredentials)

    expect(jwtGenerator.generate).not.toHaveBeenCalled()
  })

  it('should throw InvalidCredentials when password is invalid', async () => {
    // Given
    const userId = '550e8400-e29b-41d4-a716-446655440000'
    const email = 'test@example.com'
    const correctPassword = 'Valid1Password!'
    const wrongPassword = 'WrongPassword1!'

    const user = User.create({
      id: new UserId(userId),
      email: new EmailVO(email),
      plainPassword: correctPassword
    })

    repository.findByEmail.mockResolvedValue(user)

    // When/Then
    await expect(
      loginUser.run({ email, password: wrongPassword })
    ).rejects.toThrow(InvalidCredentials)

    expect(jwtGenerator.generate).not.toHaveBeenCalled()
  })
})
