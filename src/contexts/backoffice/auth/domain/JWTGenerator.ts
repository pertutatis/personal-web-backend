export interface TokenPayload {
  id: string
  email: string
  [key: string]: unknown
}

// Use type compatible with jose library
export type JwtExpiration = string | number

export interface JWTGenerator {
  generate(payload: TokenPayload): Promise<string>
  verify(token: string): Promise<TokenPayload | null>
}

export interface JWTGeneratorConstructor {
  new (secret: string, expiresIn: JwtExpiration): JWTGenerator
}
