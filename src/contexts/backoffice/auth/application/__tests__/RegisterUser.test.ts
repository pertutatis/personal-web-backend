import { RegisterUser } from '../RegisterUser'
import { AuthRepository } from '../../domain/AuthRepository'
import { User } from '../../domain/User'
import { EmailVO } from '../../domain/EmailVO'
import { UserId } from '../../domain/UserId'
import { PasswordVO } from '../../domain/PasswordVO'
import { UuidGenerator } from '../../../../shared/domain/UuidGenerator'
import { UserAlreadyExists } from '../UserAlreadyExists'

describe('RegisterUser', () => {
  let repository: jest.Mocked<AuthRepository>
  let uuidGenerator: jest.Mocked<UuidGenerator>
  let registerUser: RegisterUser

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    }
    uuidGenerator = {
      generate: jest.fn()
    }
    registerUser = new RegisterUser(repository, uuidGenerator)
  })

  it('should register a new user successfully', async () => {
    // Given
    const userId = '550e8400-e29b-41d4-a716-446655440000'
    const email = 'test@example.com'
    const password = 'Valid1Password!'

    uuidGenerator.generate.mockReturnValue(userId)
    repository.findByEmail.mockResolvedValue(null)
    repository.save.mockResolvedValue(undefined)

    // When
    const result = await registerUser.run({ email, password })

    // Then
    expect(result).toBe(userId)
    expect(repository.findByEmail).toHaveBeenCalledWith(
      expect.any(EmailVO)
    )
    expect(repository.save).toHaveBeenCalledWith(
      expect.any(User)
    )
  })

  it('should throw UserAlreadyExists when email is already registered', async () => {
    // Given
    const email = 'test@example.com'
    const password = 'Valid1Password!'

    repository.findByEmail.mockResolvedValue(new User({
      id: new UserId('650e8400-e29b-41d4-a716-446655440001'),
      email: new EmailVO(email),
      password: new PasswordVO(password)
    }))

    // When/Then
    await expect(
      registerUser.run({ email, password })
    ).rejects.toThrow(UserAlreadyExists)

    expect(repository.save).not.toHaveBeenCalled()
  })
})
