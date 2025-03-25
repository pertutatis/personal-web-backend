# Plan de Actualización OpenAPI

## Situación Actual

La documentación OpenAPI actual tiene algunas carencias:
- Faltan esquemas completos de Article y Book
- La documentación está dispersa en varios archivos
- No hay una forma interactiva de visualizarla

## Esquemas a Añadir

### Article

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Identificador único del artículo"
    },
    "title": {
      "type": "string",
      "description": "Título del artículo",
      "minLength": 1
    },
    "excerpt": {
      "type": "string",
      "description": "Extracto del artículo",
      "maxLength": 160
    },
    "content": {
      "type": "string",
      "description": "Contenido del artículo",
      "maxLength": 10000
    },
    "bookIds": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "description": "Lista de IDs de libros relacionados"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha de creación"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha de última actualización"
    }
  },
  "required": [
    "id",
    "title",
    "excerpt",
    "content",
    "bookIds",
    "createdAt",
    "updatedAt"
  ]
}
```

### Book

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Identificador único del libro"
    },
    "title": {
      "type": "string",
      "description": "Título del libro",
      "minLength": 1
    },
    "author": {
      "type": "string",
      "description": "Autor del libro",
      "minLength": 1
    },
    "isbn": {
      "type": "string",
      "description": "ISBN del libro",
      "pattern": "^[0-9-]+$"
    },
    "description": {
      "type": "string",
      "description": "Descripción del libro",
      "minLength": 1
    },
    "purchaseLink": {
      "type": "string",
      "format": "uri",
      "description": "Enlace de compra del libro",
      "nullable": true
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha de creación"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Fecha de última actualización"
    }
  },
  "required": [
    "id",
    "title",
    "author",
    "isbn",
    "description",
    "createdAt",
    "updatedAt"
  ]
}
```

### Colecciones

#### ArticleCollection

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Article"
      }
    },
    "page": {
      "type": "integer",
      "minimum": 1
    },
    "limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "total": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["items", "page", "limit", "total"]
}
```

#### BookCollection

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Book"
      }
    },
    "page": {
      "type": "integer",
      "minimum": 1
    },
    "limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "total": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["items", "page", "limit", "total"]
}
```

## Pasos de Implementación

1. Consolidar documentación:
   - Unificar todos los archivos en `openapi.json`
   - Eliminar archivos antiguos una vez migrados

2. Implementar Swagger UI:
   ```typescript
   // pages/api/docs.ts
   import { createSwaggerUI } from 'next-swagger-ui';
   import openApiDocument from '../../../docs/api/openapi.json';

   export default createSwaggerUI({
     openApiDocument,
     title: 'Personal Web API Documentation',
     theme: 'dark'
   });
   ```

3. Agregar ejemplos de respuestas para cada endpoint

4. Actualizar README.md con instrucciones para acceder a la documentación

## Beneficios

- Documentación centralizada y más mantenible
- Interfaz interactiva para probar la API
- Mejor experiencia para desarrolladores
- Documentación siempre sincronizada con el código

## Siguientes Pasos

1. Crear PR para consolidar schemas
2. Implementar Swagger UI
3. Actualizar ejemplos
4. Documentar cambios en ADR
