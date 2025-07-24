import { Container, Token } from 'typedi'
import { AuthController } from '../rest/AuthController'
import { PostgresAuthRepository } from '../PostgresAuthRepository'
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator'
import { JwtTokenGenerator } from '../JwtTokenGenerator'
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator'
import { AuthRepository } from '../../domain/AuthRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { DatabaseConnectionFactory } from '@/contexts/shared/infrastructure/persistence/DatabaseConnectionFactory';
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database';

export const AuthRepositoryToken = new Token<AuthRepository>('authRepository')
export const UuidGeneratorToken = new Token<UuidGenerator>('uuidGenerator')
export const JwtGeneratorToken = new Token<JwtTokenGenerator>('jwtGenerator')
export const AuthControllerToken = new Token<AuthController>('authController')

export async function initializeContainer(): Promise<Container> {
  const connection = await DatabaseConnectionFactory.create(getBlogDatabaseConfig());

  const authRepository = new PostgresAuthRepository(connection)
  Container.set({ id: AuthRepositoryToken, value: authRepository })

  const uuidGenerator = new OfficialUuidGenerator()
  Container.set({ id: UuidGeneratorToken, value: uuidGenerator })

  const jwtGenerator = new JwtTokenGenerator(
    process.env.JWT_SECRET || 'secret',
    process.env.JWT_EXPIRES_IN || '1h'
  )
  Container.set({ id: JwtGeneratorToken, value: jwtGenerator })

  const authController = new AuthController(
    Container.get(AuthRepositoryToken),
    Container.get(UuidGeneratorToken),
    Container.get(JwtGeneratorToken)
  )
  Container.set({ id: AuthControllerToken, value: authController })

  return Container
}

export { Container as container }
