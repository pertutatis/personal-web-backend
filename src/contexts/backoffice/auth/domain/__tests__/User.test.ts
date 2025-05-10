import { User } from '../User'
import { EmailVO } from '../EmailVO'
import { PasswordVO } from '../PasswordVO'
import { UserId } from '../UserId'

describe('User', () => {
  const validId = new UserId('550e8400-e29b-41d4-a716-446655440000')
  const validEmail = new EmailVO('test@example.com')
  const validPlainPassword = 'Valid1Password!'

  it('should create a valid user', () => {
    const user = User.create({
      id: validId,
      email: validEmail,
      plainPassword: validPlainPassword
    })

    expect(user.id.value).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(user.email.value).toBe('test@example.com')
    expect(user.password.value).not.toBe(validPlainPassword) // Password should be hashed
  })

  it('should validate password correctly', () => {
    const user = User.create({
      id: validId,
      email: validEmail,
      plainPassword: validPlainPassword
    })

    expect(user.validatePassword(validPlainPassword)).toBe(true)
    expect(user.validatePassword('WrongPassword1!')).toBe(false)
  })

  it('should create user with different ids', () => {
    const user1 = User.create({
      id: new UserId('550e8400-e29b-41d4-a716-446655440000'),
      email: validEmail,
      plainPassword: validPlainPassword
    })

    const user2 = User.create({
      id: new UserId('650e8400-e29b-41d4-a716-446655440001'),
      email: new EmailVO('other@example.com'),
      plainPassword: validPlainPassword
    })

    expect(user1.id.equals(user2.id)).toBe(false)
  })

  it('should create a new user with hashed password', () => {
    const user = User.create({
      id: validId,
      email: validEmail,
      plainPassword: validPlainPassword
    })

    expect(user.password.value).not.toBe(validPlainPassword)
    expect(user.validatePassword(validPlainPassword)).toBe(true)
  })
})
