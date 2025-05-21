# OBR 002: Blog Read Model

## Contexto
Definición de los casos de uso y comportamientos específicos para el contexto de blog, que actúa como read model del sistema.

## Casos de Uso

### 1. Listar Artículos (ListArticles)

#### Comportamiento
- Devuelve todos los artículos publicados
- No requiere paginación (pocos artículos)
- Incluye información básica de libros relacionados
- Ordena por fecha de creación descendente

#### Reglas
1. Solo devuelve artículos válidos (con todos los campos requeridos)
2. Los libros relacionados deben existir en la base de datos
3. No incluye artículos marcados como borrados (si se implementa soft delete)

#### Test Scenarios
```gherkin
Escenario: Obtener lista de artículos con libros relacionados
  Dado que existen artículos en la base de datos
  Y algunos artículos tienen libros relacionados
  Cuando se solicita la lista de artículos
  Entonces se devuelven todos los artículos
  Y cada artículo incluye sus libros relacionados
  Y los artículos están ordenados por fecha de creación descendente

Escenario: Lista vacía cuando no hay artículos
  Dado que no existen artículos en la base de datos
  Cuando se solicita la lista de artículos
  Entonces se devuelve una lista vacía
```

### 2. Obtener Artículo por Slug (GetArticleBySlug)

#### Comportamiento
- Busca un artículo específico por su slug
- Incluye información completa de libros relacionados
- Devuelve 404 si no existe

#### Reglas
1. El slug debe ser válido (formato URL-friendly)
2. Debe incluir todos los datos del artículo
3. Debe incluir información completa de los libros relacionados
4. No debe exponer datos internos (IDs de sistema, etc.)

#### Test Scenarios
```gherkin
Escenario: Obtener artículo existente por slug
  Dado que existe un artículo con slug "mi-articulo"
  Y el artículo tiene libros relacionados
  Cuando se solicita el artículo por su slug
  Entonces se devuelve el artículo completo
  Y se incluyen todos los detalles de sus libros relacionados

Escenario: Artículo no encontrado
  Dado que no existe un artículo con slug "no-existe"
  Cuando se solicita el artículo por ese slug
  Entonces se devuelve un error 404

Escenario: Artículo con libros eliminados
  Dado que existe un artículo con referencias a libros
  Y algunos libros han sido eliminados
  Cuando se solicita el artículo por su slug
  Entonces se devuelve el artículo
  Y solo se incluyen los libros que aún existen
```

## Modelo de Datos

### BlogArticle
```typescript
interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  bookIds: BlogBook[];
  relatedLinks: Array<{ text: string; url: string }>;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BlogBook
```typescript
interface BlogBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Restricciones CORS

### Orígenes Permitidos
- localhost (desarrollo)
- https://diegopertusa.netlify.app/
- https://diegopertusa.com/

### Reglas CORS
1. Solo permitir GET
2. No permitir credenciales
3. Caché de preflight: 1 hora
4. Headers permitidos: básicos

#### Test Scenarios
```gherkin
Escenario: Petición desde origen permitido
  Dado que se hace una petición GET desde diegopertusa.com
  Cuando se solicita la lista de artículos
  Entonces la petición es permitida
  Y se devuelven los datos correctamente

Escenario: Petición desde origen no permitido
  Dado que se hace una petición desde otro-dominio.com
  Cuando se solicita la lista de artículos
  Entonces la petición es rechazada con error CORS
```

## Consideraciones de Rendimiento

### Optimizaciones Futuras
1. Implementar caché de respuestas
2. Añadir índices en columnas frecuentes
3. Considerar CDN para mercados internacionales
4. Implementar rate limiting si es necesario
