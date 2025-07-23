import { PostgresAuthRepository } from '../PostgresAuthRepository'
import { User } from '../../domain/User'
import { UserId } from '../../domain/UserId'
import { EmailVO } from '../../domain/EmailVO'
import { TestDatabase } from '../../../../shared/infrastructure/__tests__/TestDatabase'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'

describe('PostgresAuthRepository', () => {
  let repository: PostgresAuthRepository
  let connection: DatabaseConnection
  let user: User

  beforeAll(async () => {
    connection = await TestDatabase.getAuthConnection()
    repository = new PostgresAuthRepository(connection)
  })

  afterAll(async () => {
    await TestDatabase.closeAll()
  })

  beforeEach(async () => {
    await connection.execute('DELETE FROM users')
    
    user = await User.create({
      id: new UserId('550e8400-e29b-41d4-a716-446655440000'),
      email: new EmailVO('test@example.com'),
      plainPassword: 'Valid1Password!'
    })
  })

  it('should save a user', async () => {
    await repository.save(user)
    
    const result = await connection.execute(
      'SELECT * FROM users WHERE id = $1',
      [user.id.value]
    )
    
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].email).toBe(user.email.value)
  })

  it('should find a user by id', async () => {
    await repository.save(user)
    
    const found = await repository.findById(user.id)
    
    expect(found).not.toBeNull()
    expect(found?.id.value).toBe(user.id.value)
    expect(found?.email.value).toBe(user.email.value)
  })

  it('should find a user by email', async () => {
    await repository.save(user)
    
    const found = await repository.findByEmail(user.email)
    
    expect(found).not.toBeNull()
    expect(found?.id.value).toBe(user.id.value)
    expect(found?.email.value).toBe(user.email.value)
  })

  it('should return null when user is not found by id', async () => {
    const nonExistentId = new UserId('650e8400-e29b-41d4-a716-446655440001')
    const found = await repository.findById(nonExistentId)
    expect(found).toBeNull()
  })

  it('should return null when user is not found by email', async () => {
    const nonExistentEmail = new EmailVO('nonexistent@example.com')
    const found = await repository.findByEmail(nonExistentEmail)
    expect(found).toBeNull()
  })
})
