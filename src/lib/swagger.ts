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

const bookIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'ID del libro (UUID v4)',
  schema: {
    type: 'string',
    format: 'uuid',
    pattern:
      '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
  },
}

const slugParameter = {
  name: 'slug',
  in: 'path',
  required: true,
  description: 'Slug del artículo',
  schema: {
    type: 'string',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
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
      'API RESTful para la gestión de artículos y libros del backoffice, blog público y autenticación',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
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
      description: 'Operaciones de gestión de artículos (backoffice)',
    },
    {
      name: 'Books',
      description: 'Operaciones de gestión de libros (backoffice)',
    },
    {
      name: 'Blog',
      description: 'Endpoints públicos del blog',
    },
    {
      name: 'Authentication',
      description: 'Autenticación y autorización',
    },
    {
      name: 'System',
      description: 'Endpoints del sistema (health check, debug)',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token para autenticación',
      },
    },
    schemas: {
      Error: errorSchema,
      ArticleStatus: {
        type: 'string',
        enum: ['DRAFT', 'PUBLISHED'],
        description: 'Estado del artículo',
        example: 'DRAFT',
      },
      RelatedLink: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Texto del enlace',
            maxLength: 100,
            example: 'Documentación oficial',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'URL del enlace',
            maxLength: 500,
            example: 'https://example.com/docs',
          },
        },
        required: ['text', 'url'],
      },
      Article: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único del artículo',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          title: {
            type: 'string',
            description: 'Título del artículo',
            maxLength: 255,
            example: 'Introducción a Domain-Driven Design',
          },
          excerpt: {
            type: 'string',
            description: 'Extracto del artículo',
            maxLength: 300,
            example:
              'Una guía completa sobre los principios fundamentales de DDD',
          },
          content: {
            type: 'string',
            description: 'Contenido completo del artículo',
            maxLength: 20000,
            example: 'Domain-Driven Design es una metodología...',
          },
          slug: {
            type: 'string',
            description: 'URL slug del artículo',
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
            example: 'introduccion-domain-driven-design',
          },
          status: {
            $ref: '#/components/schemas/ArticleStatus',
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
            description: 'IDs de libros relacionados',
            example: ['987fcdeb-51a2-4321-89ab-654321098abc'],
          },
          relatedLinks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RelatedLink',
            },
            description: 'Enlaces relacionados',
            maxItems: 10,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación',
            example: '2024-01-15T10:30:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización',
            example: '2024-01-15T14:45:00Z',
          },
        },
        required: [
          'id',
          'title',
          'excerpt',
          'content',
          'slug',
          'status',
          'bookIds',
          'relatedLinks',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateArticleRequest: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único del artículo (debe ser UUID v4)',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          title: {
            type: 'string',
            description: 'Título del artículo',
            maxLength: 255,
            minLength: 1,
            example: 'Introducción a Domain-Driven Design',
          },
          excerpt: {
            type: 'string',
            description: 'Extracto del artículo',
            maxLength: 300,
            minLength: 1,
            example:
              'Una guía completa sobre los principios fundamentales de DDD',
          },
          content: {
            type: 'string',
            description: 'Contenido completo del artículo',
            maxLength: 20000,
            minLength: 1,
            example: 'Domain-Driven Design es una metodología...',
          },
          status: {
            $ref: '#/components/schemas/ArticleStatus',
            description:
              'Estado inicial del artículo (opcional, por defecto DRAFT)',
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
            description: 'IDs de libros relacionados (opcional)',
            default: [],
            example: ['987fcdeb-51a2-4321-89ab-654321098abc'],
          },
          relatedLinks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RelatedLink',
            },
            description: 'Enlaces relacionados (opcional)',
            maxItems: 10,
            default: [],
          },
        },
        required: ['id', 'title', 'excerpt', 'content'],
      },
      UpdateArticleRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Nuevo título del artículo',
            maxLength: 255,
            minLength: 1,
            example: 'Introducción a Domain-Driven Design (Actualizado)',
          },
          excerpt: {
            type: 'string',
            description: 'Nuevo extracto del artículo',
            maxLength: 300,
            minLength: 1,
            example: 'Una guía completa y actualizada sobre DDD',
          },
          content: {
            type: 'string',
            description: 'Nuevo contenido del artículo',
            maxLength: 20000,
            minLength: 1,
            example: 'Domain-Driven Design es una metodología actualizada...',
          },
          status: {
            $ref: '#/components/schemas/ArticleStatus',
            description:
              'Nuevo estado del artículo (DRAFT->PUBLISHED permitido, PUBLISHED->DRAFT NO permitido)',
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Nuevos IDs de libros relacionados',
            example: ['987fcdeb-51a2-4321-89ab-654321098abc'],
          },
          relatedLinks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RelatedLink',
            },
            description: 'Nuevos enlaces relacionados',
            maxItems: 10,
          },
        },
        description:
          'Todos los campos son opcionales. Solo se actualizan los campos proporcionados.',
      },
      ArticleCollection: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Article',
            },
            description: 'Lista de artículos',
          },
          total: {
            type: 'integer',
            description: 'Total de artículos',
            example: 25,
          },
          page: {
            type: 'integer',
            description: 'Página actual',
            example: 1,
          },
          limit: {
            type: 'integer',
            description: 'Elementos por página',
            example: 10,
          },
        },
        required: ['items', 'total', 'page', 'limit'],
      },
      PublishResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Mensaje de confirmación',
            example: 'Article published successfully',
          },
        },
        required: ['message'],
      },
      Book: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único del libro',
            example: '987fcdeb-51a2-4321-89ab-654321098abc',
          },
          title: {
            type: 'string',
            description: 'Título del libro',
            maxLength: 255,
            example: 'Domain-Driven Design',
          },
          author: {
            type: 'string',
            description: 'Autor del libro',
            maxLength: 255,
            example: 'Eric Evans',
          },
          isbn: {
            type: 'string',
            description: 'ISBN del libro',
            pattern:
              '^(97[89]-?\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?\\d|\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?[\\dX])$',
            example: '978-0-321-12521-7',
          },
          description: {
            type: 'string',
            description: 'Descripción del libro',
            maxLength: 1000,
            example: 'Una guía completa sobre Domain-Driven Design...',
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            description: 'Enlace de compra del libro (opcional)',
            maxLength: 500,
            nullable: true,
            example: 'https://example.com/book',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación',
            example: '2024-01-15T10:30:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización',
            example: '2024-01-15T14:45:00Z',
          },
        },
        required: [
          'id',
          'title',
          'author',
          'isbn',
          'description',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateBookRequest: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único del libro (debe ser UUID v4)',
            example: '987fcdeb-51a2-4321-89ab-654321098abc',
          },
          title: {
            type: 'string',
            description: 'Título del libro',
            maxLength: 255,
            minLength: 1,
            example: 'Domain-Driven Design',
          },
          author: {
            type: 'string',
            description: 'Autor del libro',
            maxLength: 255,
            minLength: 1,
            example: 'Eric Evans',
          },
          isbn: {
            type: 'string',
            description: 'ISBN del libro',
            pattern:
              '^(97[89]-?\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?\\d|\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?[\\dX])$',
            example: '978-0-321-12521-7',
          },
          description: {
            type: 'string',
            description: 'Descripción del libro',
            maxLength: 1000,
            minLength: 1,
            example: 'Una guía completa sobre Domain-Driven Design...',
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            description: 'Enlace de compra del libro (opcional)',
            maxLength: 500,
            nullable: true,
            example: 'https://example.com/book',
          },
        },
        required: ['id', 'title', 'author', 'isbn', 'description'],
      },
      UpdateBookRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Nuevo título del libro',
            maxLength: 255,
            minLength: 1,
            example: 'Domain-Driven Design (Segunda Edición)',
          },
          author: {
            type: 'string',
            description: 'Nuevo autor del libro',
            maxLength: 255,
            minLength: 1,
            example: 'Eric Evans',
          },
          isbn: {
            type: 'string',
            description: 'Nuevo ISBN del libro',
            pattern:
              '^(97[89]-?\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?\\d|\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?[\\dX])$',
            example: '978-0-321-12521-8',
          },
          description: {
            type: 'string',
            description: 'Nueva descripción del libro',
            maxLength: 1000,
            minLength: 1,
            example: 'Una guía completa y actualizada sobre DDD...',
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            description: 'Nuevo enlace de compra del libro',
            maxLength: 500,
            nullable: true,
            example: 'https://example.com/new-book',
          },
        },
        description:
          'Todos los campos son opcionales. Solo se actualizan los campos proporcionados.',
      },
      BookCollection: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Book',
            },
            description: 'Lista de libros',
          },
          total: {
            type: 'integer',
            description: 'Total de libros',
            example: 15,
          },
          page: {
            type: 'integer',
            description: 'Página actual',
            example: 1,
          },
          limit: {
            type: 'integer',
            description: 'Elementos por página',
            example: 10,
          },
        },
        required: ['items', 'total', 'page', 'limit'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            description: 'Contraseña del usuario',
            minLength: 8,
            example: 'securePassword123!',
          },
        },
        required: ['email', 'password'],
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario',
            example: 'user@example.com',
          },
          password: {
            type: 'string',
            description: 'Contraseña del usuario (mínimo 8 caracteres)',
            minLength: 8,
            example: 'securePassword123!',
          },
        },
        required: ['email', 'password'],
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT token para autenticación',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
        required: ['token'],
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Estado del sistema',
            example: 'ok',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp del check',
            example: '2024-01-15T10:30:00Z',
          },
          env: {
            type: 'string',
            description: 'Entorno de ejecución',
            example: 'production',
          },
          auth: {
            type: 'object',
            properties: {
              hasJwtSecret: {
                type: 'boolean',
                description: 'Si el JWT secret está configurado',
                example: true,
              },
              jwtExpiresIn: {
                type: 'string',
                description: 'Tiempo de expiración del JWT',
                example: '3600',
              },
            },
          },
        },
        required: ['status', 'timestamp'],
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  schemas: {
    // ...existing schemas...
    Serie: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Identificador único de la serie',
        },
        title: {
          type: 'string',
          maxLength: 100,
          description: 'Título de la serie',
        },
        description: {
          type: 'string',
          maxLength: 500,
          description: 'Descripción de la serie',
        },
      },
      required: ['id', 'title'],
    },
  },
  paths: {
    // Endpoints backoffice de series
    '/backoffice/series': {
      get: {
        tags: ['Series'],
        summary: 'Listar series (backoffice)',
        description: 'Obtiene una lista de series para gestión backoffice',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de series obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Serie' },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Series'],
        summary: 'Crear serie',
        description: 'Crea una nueva serie',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Serie' },
            },
          },
        },
        responses: {
          '201': { description: 'Serie creada correctamente' },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '409': {
            description: 'El ID ya existe',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/backoffice/series/{id}': {
      get: {
        tags: ['Series'],
        summary: 'Obtener serie (backoffice)',
        description: 'Obtiene una serie por su ID para gestión backoffice',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID de la serie',
          },
        ],
        responses: {
          '200': {
            description: 'Serie encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Serie' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Serie no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Series'],
        summary: 'Actualizar serie',
        description: 'Actualiza una serie existente',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID de la serie',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Serie' },
            },
          },
        },
        responses: {
          '200': { description: 'Serie actualizada correctamente' },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Serie no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Series'],
        summary: 'Eliminar serie',
        description: 'Elimina una serie existente',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID de la serie',
          },
        ],
        responses: {
          '204': { description: 'Serie eliminada correctamente' },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Serie no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health Check',
        description: 'Verifica el estado del sistema y la configuración',
        security: [],
        responses: {
          '200': {
            description: 'Sistema funcionando correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
          '500': {
            description: 'Error del sistema',
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
    '/backoffice/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y devuelve un JWT token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticación exitosa',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '401': {
            description: 'Credenciales inválidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '400': {
            description: 'Datos de entrada inválidos',
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
    '/backoffice/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Registrar usuario',
        description: 'Registra un nuevo usuario en el sistema',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario registrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '400': {
            description: 'Datos de entrada inválidos o usuario ya existe',
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
    '/backoffice/books': {
      get: {
        tags: ['Books'],
        summary: 'Listar libros',
        description: 'Obtiene una lista paginada de libros',
        parameters: paginationParameters,
        responses: {
          '200': {
            description: 'Lista de libros obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BookCollection',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
      post: {
        tags: ['Books'],
        summary: 'Crear libro',
        description: 'Crea un nuevo libro',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBookRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Libro creado correctamente',
          },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                examples: {
                  duplicateId: {
                    summary: 'ID duplicado',
                    value: {
                      type: 'ValidationError',
                      message: 'Book with this ID already exists',
                    },
                  },
                  invalidIsbn: {
                    summary: 'ISBN inválido',
                    value: {
                      type: 'ValidationError',
                      message: 'Invalid ISBN format',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
    '/backoffice/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Obtener libro',
        description: 'Obtiene un libro por su ID',
        parameters: [bookIdParameter],
        responses: {
          '200': {
            description: 'Libro encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book',
                },
              },
            },
          },
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
        tags: ['Books'],
        summary: 'Actualizar libro',
        description: 'Actualiza un libro existente',
        parameters: [bookIdParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateBookRequest',
              },
            },
          },
        },
        responses: {
          '204': {
            description: 'Libro actualizado correctamente',
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
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
        tags: ['Books'],
        summary: 'Eliminar libro',
        description: 'Elimina un libro existente',
        parameters: [bookIdParameter],
        responses: {
          '204': {
            description: 'Libro eliminado correctamente',
          },
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
    '/backoffice/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Listar artículos',
        description:
          'Obtiene una lista paginada de artículos (incluye DRAFT y PUBLISHED)',
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
          '401': {
            description: 'No autorizado',
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
      post: {
        tags: ['Articles'],
        summary: 'Crear artículo',
        description: 'Crea un nuevo artículo. Por defecto se crea como DRAFT.',
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
                examples: {
                  invalidStatus: {
                    summary: 'Estado inválido',
                    value: {
                      type: 'ValidationError',
                      message: 'status must be either "DRAFT" or "PUBLISHED"',
                    },
                  },
                  duplicateId: {
                    summary: 'ID duplicado',
                    value: {
                      type: 'ValidationError',
                      message: 'Article with this ID already exists',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
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
        description:
          'Obtiene un artículo por su ID (incluye DRAFT y PUBLISHED)',
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
          '401': {
            description: 'No autorizado',
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
        description:
          'Actualiza un artículo existente. Permite transición DRAFT->PUBLISHED, pero NO PUBLISHED->DRAFT.',
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
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                examples: {
                  invalidTransition: {
                    summary: 'Transición de estado inválida',
                    value: {
                      type: 'ValidationError',
                      message:
                        'Invalid article status: Cannot change from PUBLISHED to DRAFT',
                    },
                  },
                  invalidStatus: {
                    summary: 'Estado inválido',
                    value: {
                      type: 'ValidationError',
                      message: 'status must be either "DRAFT" or "PUBLISHED"',
                    },
                  },
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
          '401': {
            description: 'No autorizado',
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
        description: 'Elimina un artículo existente (DRAFT o PUBLISHED)',
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
          '401': {
            description: 'No autorizado',
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
    '/backoffice/articles/{id}/publish': {
      post: {
        tags: ['Articles'],
        summary: 'Publicar artículo',
        description:
          'Publica un artículo cambiando su estado a PUBLISHED. Si ya está publicado, no hace nada.',
        parameters: [articleIdParameter],
        responses: {
          '200': {
            description: 'Artículo publicado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PublishResponse',
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
          '401': {
            description: 'No autorizado',
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
    '/backoffice/articles/by-slug/{slug}': {
      get: {
        tags: ['Articles'],
        summary: 'Obtener artículo por slug (backoffice)',
        description:
          'Obtiene un artículo por su slug (incluye DRAFT y PUBLISHED)',
        parameters: [slugParameter],
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
          '401': {
            description: 'No autorizado',
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
    '/blog/articles': {
      get: {
        tags: ['Blog'],
        summary: 'Listar artículos públicos',
        description:
          'Obtiene una lista paginada de artículos PUBLICADOS solamente (endpoint público)',
        security: [],
        parameters: paginationParameters,
        responses: {
          '200': {
            description: 'Lista de artículos públicos obtenida correctamente',
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
    },
    '/blog/articles/by-slug/{slug}': {
      get: {
        tags: ['Blog'],
        summary: 'Obtener artículo público por slug',
        description:
          'Obtiene un artículo PUBLICADO por su slug (endpoint público)',
        security: [],
        parameters: [slugParameter],
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
            description: 'Artículo no encontrado (o está en DRAFT)',
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
