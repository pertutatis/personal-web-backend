import { NextRequest } from 'next/server'
import { AuthController } from '../AuthController'
import { AuthRepository } from '../../../domain/AuthRepository'
import { UuidGenerator } from '../../../../../shared/domain/UuidGenerator'
import { JWTGenerator } from '../../../domain/JWTGenerator'
import { User } from '../../../domain/User'
import { EmailVO } from '../../../domain/EmailVO'
import { UserId } from '../../../domain/UserId'
import { UserAlreadyExists } from '../../../application/UserAlreadyExists'
import { InvalidCredentials } from '../../../application/InvalidCredentials'

describe('AuthController', () => {
  let controller: AuthController
  let repository: jest.Mocked<AuthRepository>
  let uuidGenerator: jest.Mocked<UuidGenerator>
  let jwtGenerator: jest.Mocked<JWTGenerator>

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    }

    uuidGenerator = {
      generate: jest.fn()
    }

    jwtGenerator = {
      generate: jest.fn(),
      verify: jest.fn()
    }

    controller = new AuthController(repository, uuidGenerator, jwtGenerator)
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000'
      const requestBody = {
        email: 'test@example.com',
        password: 'Valid1Password!'
      }

      const request = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      repository.findByEmail.mockResolvedValue(null)
      uuidGenerator.generate.mockReturnValue(userId)
      repository.save.mockResolvedValue(undefined)

      const response = await controller.register(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body).toEqual({ id: userId })
    })

    it('should return 409 when user already exists', async () => {
      const requestBody = {
        email: 'existing@example.com',
        password: 'Valid1Password!'
      }

      const request = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      repository.findByEmail.mockResolvedValue(new User({
        id: new UserId('650e8400-e29b-41d4-a716-446655440001'),
        email: new EmailVO(requestBody.email),
        password: requestBody.password as any
      }))

      const response = await controller.register(request)
      const body = await response.json()

      expect(response.status).toBe(409)
      expect(body).toEqual({ error: 'User already exists' })
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'Valid1Password!'
      }

      const request = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const token = 'valid.jwt.token'
      const user = User.create({
        id: new UserId('550e8400-e29b-41d4-a716-446655440000'),
        email: new EmailVO(requestBody.email),
        plainPassword: requestBody.password
      })

      repository.findByEmail.mockResolvedValue(user)
      jwtGenerator.generate.mockResolvedValue(token)

      const response = await controller.login(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual({ token })
    })

    it('should return 401 with invalid credentials', async () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'WrongPassword1!'
      }

      const request = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      repository.findByEmail.mockResolvedValue(null)

      const response = await controller.login(request)
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body).toEqual({ error: 'Invalid credentials' })
    })
  })
})
