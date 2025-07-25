import { createSwaggerSpec } from 'next-swagger-doc'

const errorSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      description: 'Tipo de error',
      example: 'ValidationError',
    },
    message: {
      type: 'string',
      description: 'Mensaje descriptivo del error',
      example: 'El ID debe ser un UUID v4 válido',
    },
  },
  required: ['type', 'message'],
}

const articleIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'ID del artículo (UUID v4)',
  schema: {
    type: 'string',
    format: 'uuid',
    pattern:
      '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
  },
}

const paginationParameters = [
  {
    name: 'page',
    in: 'query',
    description: 'Número de página',
    required: false,
    schema: {
      type: 'integer',
      default: 1,
      minimum: 1,
    },
  },
  {
    name: 'limit',
    in: 'query',
    description: 'Número de elementos por página',
    required: false,
    schema: {
      type: 'integer',
      default: 10,
      minimum: 1,
      maximum: 100,
    },
  },
]

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Personal Web Backend API',
    version: '1.0.0',
    description:
      'API RESTful para la gestión de artículos y libros del backoffice',
  },
  servers: [
    {
      url: '/api',
      description: 'API Base URL',
    },
  ],
  tags: [
    {
      name: 'Articles',
      description: 'Operaciones con artículos',
    },
    {
      name: 'Books',
      description: 'Operaciones con libros',
    },
  ],
  components: {
    schemas: {
      Error: errorSchema,
    },
  },
  paths: {
    '/backoffice/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Listar artículos',
        description: 'Obtiene una lista paginada de artículos',
        parameters: paginationParameters,
        responses: {
          '200': {
            description: 'Lista de artículos obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ArticleCollection',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Articles'],
        summary: 'Crear artículo',
        description: 'Crea un nuevo artículo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateArticleRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Artículo creado correctamente',
          },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/backoffice/articles/{id}': {
      get: {
        tags: ['Articles'],
        summary: 'Obtener artículo',
        description: 'Obtiene un artículo por su ID',
        parameters: [articleIdParameter],
        responses: {
          '200': {
            description: 'Artículo encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Article',
                },
              },
            },
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Articles'],
        summary: 'Actualizar artículo',
        description: 'Actualiza un artículo existente',
        parameters: [articleIdParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateArticleRequest',
              },
            },
          },
        },
        responses: {
          '204': {
            description: 'Artículo actualizado correctamente',
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Articles'],
        summary: 'Eliminar artículo',
        description: 'Elimina un artículo existente',
        parameters: [articleIdParameter],
        responses: {
          '204': {
            description: 'Artículo eliminado correctamente',
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
}

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: openApiDocument,
  })
}
