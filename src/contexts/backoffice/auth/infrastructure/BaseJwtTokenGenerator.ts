import {
  JWTGenerator,
  TokenPayload,
  JwtExpiration,
} from '../domain/JWTGenerator'

export abstract class BaseJwtTokenGenerator implements JWTGenerator {
  constructor(
    protected readonly secret: string,
    protected readonly expiresIn: JwtExpiration,
  ) {}

  abstract generate(payload: TokenPayload): Promise<string>
  abstract verify(token: string): Promise<TokenPayload | null>
}
