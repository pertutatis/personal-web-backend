# Autenticación en la API

## Descripción General
La API utiliza autenticación basada en JWT (JSON Web Tokens) para proteger las rutas del backoffice. Todas las rutas que comienzan con `/api/backoffice/` requieren un token JWT válido.

## Flujo de Autenticación

1. **Login**: El usuario se autentica usando `/api/auth/login`
2. **Token**: Recibe un JWT que debe incluir en las siguientes peticiones
3. **Uso**: Incluir el token en el header `Authorization: Bearer <token>`

## Rutas Protegidas

Todas las rutas bajo `/api/backoffice/` requieren autenticación:
- `/api/backoffice/articles`
- `/api/backoffice/books`
- etc.

## Rutas Públicas

Las siguientes rutas NO requieren autenticación:
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth-config`
- `/api/auth/token`
- `/api/debug/auth`
- `/api/test-helpers`
- `/api/health`

## Errores de Autenticación

Si hay un error de autenticación, la API responderá con:
- Status: 401 Unauthorized
- Body: 
  ```json
  {
    "type": "UnauthorizedError",
    "message": "Token validation failed"
  }
  ```

## Validación de Token

El token JWT debe contener:
- `id`: ID del usuario
- `email`: Email del usuario

Si falta alguno de estos campos, se considerará inválido.
