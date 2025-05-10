# OBR 003: Reglas de Autenticación

## Reglas de Negocio

### Usuario (User)
1. **Email**
   - Debe ser una dirección de correo válida
   - Longitud máxima: 255 caracteres
   - No puede estar vacío
   - Debe ser único en el sistema

2. **Password**
   - Longitud mínima: 8 caracteres
   - Longitud máxima: 64 caracteres
   - Debe contener al menos:
     - Una letra mayúscula
     - Una letra minúscula
     - Un número
     - Un carácter especial
   - No puede contener espacios

### Token JWT
1. **Estructura**
   - Must contain: userId, email
   - Must include standard claims: iat, exp
   - Expiration time: 1 hora
   - Refresh token expiration: 7 días

2. **Validación**
   - Token debe ser válido y no expirado
   - Signature debe ser verificable
   - Claims requeridos deben estar presentes

## Casos de Uso

### 1. Registro de Usuario
- **Input**: email, password
- **Output**: userId, token
- **Pasos**:
  1. Validar formato de email y password
  2. Verificar que el email no existe
  3. Hashear password
  4. Crear usuario
  5. Generar token JWT
  6. Retornar userId y token

### 2. Login de Usuario
- **Input**: email, password
- **Output**: token, refreshToken
- **Pasos**:
  1. Buscar usuario por email
  2. Verificar password
  3. Generar token JWT
  4. Generar refresh token
  5. Retornar tokens

### 3. Validación de Token
- **Input**: token
- **Output**: payload decodificado o error
- **Pasos**:
  1. Verificar firma del token
  2. Verificar expiración
  3. Verificar claims requeridos
  4. Retornar payload si es válido

### 4. Refresh Token
- **Input**: refreshToken
- **Output**: nuevo token JWT
- **Pasos**:
  1. Validar refresh token
  2. Verificar que no está expirado
  3. Generar nuevo token JWT
  4. Retornar nuevo token

## Casos de Error

### 1. Registro
- Email inválido
- Password no cumple requisitos
- Email ya existe

### 2. Login
- Usuario no encontrado
- Password incorrecto
- Usuario inactivo/bloqueado

### 3. Validación Token
- Token expirado
- Firma inválida
- Claims faltantes
- Token malformado

### 4. Refresh Token
- Token expirado
- Token inválido
- Token no encontrado

## Testing Scenarios

### Unit Tests
1. **Value Objects**
   - Email validation
   - Password validation
   - Token validation

2. **Domain Logic**
   - User creation
   - Password hashing
   - Token generation
   - Token validation

### Integration Tests
1. **Repository**
   - User creation
   - User retrieval
   - User uniqueness

2. **Token Service**
   - Token generation
   - Token verification
   - Refresh token handling

### E2E Tests
1. **Registro**
   - Registro exitoso
   - Email duplicado
   - Datos inválidos

2. **Login**
   - Login exitoso
   - Credenciales inválidas
   - Usuario no existente

3. **Protected Routes**
   - Acceso con token válido
   - Acceso con token expirado
   - Acceso sin token
   - Refresh token flow

## Métricas de Monitoreo
1. **Performance**
   - Tiempo de registro
   - Tiempo de login
   - Tiempo de validación de token

2. **Seguridad**
   - Intentos de login fallidos
   - Tokens inválidos
   - Intentos de acceso no autorizados

3. **Disponibilidad**
   - Uptime del servicio
   - Tasa de error en autenticación
   - Latencia de operaciones
