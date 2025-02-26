# Reglas de Negocio para el Módulo Book

## Entidad Book

### Propiedades
1. **BookId**
   - Debe ser un UUID válido
   - No puede estar vacío

2. **BookTitle**
   - No puede estar vacío
   - Longitud máxima: 100 caracteres
   - No puede contener solo espacios en blanco

3. **BookAuthor**
   - No puede estar vacío
   - Longitud máxima: 100 caracteres
   - No puede contener solo espacios en blanco

4. **BookIsbn**
   - Debe ser un ISBN válido
   - Debe seguir el formato ISBN-13 o ISBN-10
   - No puede estar vacío

## Escenarios de Prueba

### Creación de Book
1. **Escenario Feliz**
   - Todos los campos válidos
   - ISBN-13 válido
   - ISBN-10 válido

2. **Escenarios de Error**
   - Título vacío
   - Título excede longitud máxima
   - Autor vacío
   - Autor excede longitud máxima
   - ISBN inválido
   - ISBN vacío

### Actualización de Book
1. **Escenario Feliz**
   - Actualización de todos los campos
   - Actualización parcial

2. **Escenarios de Error**
   - Book no encontrado
   - Campos inválidos (mismas validaciones que en creación)

### Listado de Books
1. **Escenarios Felices**
   - Lista vacía
   - Lista con un elemento
   - Lista con múltiples elementos
   - Paginación correcta

2. **Escenarios de Error**
   - Parámetros de paginación inválidos

### Obtener Book por ID
1. **Escenario Feliz**
   - Book encontrado

2. **Escenarios de Error**
   - Book no encontrado
   - ID inválido

## Implementación de Object Mothers

Se crearán los siguientes Object Mothers:

1. **BookMother**
   - `create()`: Crea un Book válido con valores por defecto
   - `random()`: Crea un Book válido con valores aleatorios
   - `withId(id: string)`: Crea un Book con un ID específico
   - `invalid()`: Crea un Book con valores inválidos

2. **BookTitleMother**
   - `create()`: Crea un título válido
   - `random()`: Crea un título aleatorio válido
   - `tooLong()`: Crea un título que excede la longitud máxima
   - `empty()`: Crea un título vacío

3. **BookAuthorMother**
   - `create()`: Crea un autor válido
   - `random()`: Crea un autor aleatorio válido
   - `tooLong()`: Crea un autor que excede la longitud máxima
   - `empty()`: Crea un autor vacío

4. **BookIsbnMother**
   - `create()`: Crea un ISBN-13 válido
   - `createIsbn10()`: Crea un ISBN-10 válido
   - `random()`: Crea un ISBN aleatorio válido
   - `invalid()`: Crea un ISBN inválido
   - `empty()`: Crea un ISBN vacío
