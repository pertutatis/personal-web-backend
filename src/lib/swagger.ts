import { createSwaggerSpec } from 'next-swagger-doc';

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Personal Web Backend API',
    version: '1.0.0',
    description: 'API RESTful para la gestión de artículos y libros del blog personal',
  },
  servers: [
    {
      url: '/api',
      description: 'API Base URL'
    }
  ],
  tags: [
    {
      name: 'Articles',
      description: 'Operaciones con artículos'
    },
    {
      name: 'Books',
      description: 'Operaciones con libros'
    }
  ],
  paths: {
    '/blog/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Listar artículos',
        description: 'Obtiene una lista paginada de artículos',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número de página',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
              minimum: 1
            }
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
              maximum: 100
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de artículos obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ArticleCollection'
                }
              }
            }
          }
        }
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
                $ref: '#/components/schemas/CreateArticleRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Artículo creado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Article'
                }
              }
            }
          },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/blog/articles/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del artículo',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      get: {
        tags: ['Articles'],
        summary: 'Obtener artículo',
        description: 'Obtiene un artículo por su ID',
        responses: {
          '200': {
            description: 'Artículo encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Article'
                }
              }
            }
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Articles'],
        summary: 'Actualizar artículo',
        description: 'Actualiza un artículo existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateArticleRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Artículo actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Article'
                }
              }
            }
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Articles'],
        summary: 'Eliminar artículo',
        description: 'Elimina un artículo existente',
        responses: {
          '204': {
            description: 'Artículo eliminado correctamente'
          },
          '404': {
            description: 'Artículo no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/blog/books': {
      get: {
        tags: ['Books'],
        summary: 'Listar libros',
        description: 'Obtiene una lista paginada de libros',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número de página',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
              minimum: 1
            }
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
              maximum: 100
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de libros obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BookCollection'
                }
              }
            }
          }
        }
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
                $ref: '#/components/schemas/CreateBookRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Libro creado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          '400': {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/blog/books/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del libro',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      get: {
        tags: ['Books'],
        summary: 'Obtener libro',
        description: 'Obtiene un libro por su ID',
        responses: {
          '200': {
            description: 'Libro encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Books'],
        summary: 'Actualizar libro',
        description: 'Actualiza un libro existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateBookRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Libro actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Books'],
        summary: 'Eliminar libro',
        description: 'Elimina un libro existente',
        responses: {
          '204': {
            description: 'Libro eliminado correctamente'
          },
          '404': {
            description: 'Libro no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Article: {
        type: 'object',
        required: [
          'id',
          'title',
          'excerpt',
          'content',
          'bookIds',
          'createdAt',
          'updatedAt'
        ],
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          title: {
            type: 'string',
            minLength: 1
          },
          excerpt: {
            type: 'string',
            maxLength: 160
          },
          content: {
            type: 'string',
            maxLength: 10000
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ArticleCollection: {
        type: 'object',
        required: ['items', 'page', 'limit', 'total'],
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Article'
            }
          },
          page: {
            type: 'integer',
            minimum: 1
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100
          },
          total: {
            type: 'integer',
            minimum: 0
          }
        }
      },
      CreateArticleRequest: {
        type: 'object',
        required: ['title', 'excerpt', 'content'],
        properties: {
          title: {
            type: 'string',
            minLength: 1
          },
          excerpt: {
            type: 'string',
            maxLength: 160
          },
          content: {
            type: 'string',
            maxLength: 10000
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            },
            default: []
          }
        }
      },
      UpdateArticleRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1
          },
          excerpt: {
            type: 'string',
            maxLength: 160
          },
          content: {
            type: 'string',
            maxLength: 10000
          },
          bookIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            }
          }
        }
      },
      Book: {
        type: 'object',
        required: [
          'id',
          'title',
          'author',
          'isbn',
          'description',
          'createdAt',
          'updatedAt'
        ],
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          title: {
            type: 'string',
            minLength: 1
          },
          author: {
            type: 'string',
            minLength: 1
          },
          isbn: {
            type: 'string',
            pattern: '^[0-9-]+$'
          },
          description: {
            type: 'string',
            minLength: 1
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            nullable: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      BookCollection: {
        type: 'object',
        required: ['items', 'page', 'limit', 'total'],
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Book'
            }
          },
          page: {
            type: 'integer',
            minimum: 1
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100
          },
          total: {
            type: 'integer',
            minimum: 0
          }
        }
      },
      CreateBookRequest: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'description'],
        properties: {
          title: {
            type: 'string',
            minLength: 1
          },
          author: {
            type: 'string',
            minLength: 1
          },
          isbn: {
            type: 'string',
            pattern: '^[0-9-]+$'
          },
          description: {
            type: 'string',
            minLength: 1
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            nullable: true
          }
        }
      },
      UpdateBookRequest: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'description'],
        properties: {
          title: {
            type: 'string',
            minLength: 1
          },
          author: {
            type: 'string',
            minLength: 1
          },
          isbn: {
            type: 'string',
            pattern: '^[0-9-]+$'
          },
          description: {
            type: 'string',
            minLength: 1
          },
          purchaseLink: {
            type: 'string',
            format: 'uri',
            nullable: true
          }
        }
      },
      Error: {
        type: 'object',
        required: ['type', 'message'],
        properties: {
          type: {
            type: 'string',
            description: 'Tipo de error'
          },
          message: {
            type: 'string',
            description: 'Mensaje descriptivo del error'
          }
        }
      }
    }
  }
};

// @ts-ignore - next-swagger-doc tiene problemas con los tipos
export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: openApiDocument
  });
};
