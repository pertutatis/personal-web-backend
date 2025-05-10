import { TokenPayload } from './TokenPayload'

export interface JWTGenerator {
  generate(payload: TokenPayload): Promise<string>
  verify(token: string): Promise<TokenPayload>
}
