import { Container } from 'typedi'
import { AuthController } from '../rest/AuthController'
import { PostgresAuthRepository } from '../PostgresAuthRepository'
import { UuidGeneratorNode } from '@/contexts/shared/infrastructure/UuidGeneratorNode'
import { JwtTokenGenerator } from '../JwtTokenGenerator'

const container = new Container()

container.set('authRepository', new PostgresAuthRepository())
container.set('uuidGenerator', new UuidGeneratorNode())
container.set('jwtGenerator', new JwtTokenGenerator(process.env.JWT_SECRET || 'secret'))

container.set(
  'authController',
  new AuthController(
    container.get('authRepository'),
    container.get('uuidGenerator'),
    container.get('jwtGenerator')
  )
)

export { container }
