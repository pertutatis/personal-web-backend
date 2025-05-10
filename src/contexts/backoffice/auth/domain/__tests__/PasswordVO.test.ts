import { PasswordVO } from '../PasswordVO'
import { PasswordEmpty } from '../PasswordEmpty'
import { PasswordInvalid } from '../PasswordInvalid'

describe('PasswordVO', () => {
  it('should create a valid password', () => {
    const password = new PasswordVO('Valid1Password!')
    expect(password.value).toBe('Valid1Password!')
  })

  it('should throw PasswordEmpty for empty password', () => {
    expect(() => new PasswordVO('')).toThrow(PasswordEmpty)
  })

  it('should throw PasswordInvalid for password shorter than 8 characters', () => {
    expect(() => new PasswordVO('Short1!')).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password longer than 64 characters', () => {
    const longPassword = 'A1!'.padEnd(65, 'a')
    expect(() => new PasswordVO(longPassword)).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password without uppercase', () => {
    expect(() => new PasswordVO('password1!')).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password without lowercase', () => {
    expect(() => new PasswordVO('PASSWORD1!')).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password without numbers', () => {
    expect(() => new PasswordVO('Password!')).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password without special characters', () => {
    expect(() => new PasswordVO('Password1')).toThrow(PasswordInvalid)
  })

  it('should throw PasswordInvalid for password with spaces', () => {
    expect(() => new PasswordVO('Password 1!')).toThrow(PasswordInvalid)
  })

  it('should compare passwords correctly', () => {
    const password1 = new PasswordVO('Valid1Password!')
    const password2 = new PasswordVO('Valid1Password!')
    const password3 = new PasswordVO('Different2Password!')

    expect(password1.equals(password2)).toBe(true)
    expect(password1.equals(password3)).toBe(false)
  })
})
