# ADR 002: Persistencia de Datos con PostgreSQL

## Estado
Aceptado

## Contexto
Necesitamos almacenar información de artículos y libros de manera eficiente y consistente. Cada agregado (Article y Book) debe tener su propia base de datos para mantener el principio de segregación de responsabilidades.

## Decisión
Utilizaremos PostgreSQL como sistema de base de datos por las siguientes razones:

1. Bases de datos separadas:
   - `articles`: Almacenará la información de los artículos
   - `books`: Almacenará la información de los libros

2. Estructura de tablas:
   ```sql
   -- Articles Database
   CREATE TABLE articles (
     id UUID PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     slug VARCHAR(255) NOT NULL UNIQUE,
     date TIMESTAMP NOT NULL,
     category VARCHAR(100) NOT NULL,
     excerpt TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE article_related_links (
     id UUID PRIMARY KEY,
     article_id UUID REFERENCES articles(id),
     text VARCHAR(255) NOT NULL,
     link VARCHAR(512) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE article_books (
     article_id UUID REFERENCES articles(id),
     book_id UUID NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (article_id, book_id)
   );

   -- Books Database
   CREATE TABLE books (
     id UUID PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL,
     isbn VARCHAR(13),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. Join de datos:
   - El repositorio de artículos será responsable de hacer el join con la información de libros cuando sea necesario
   - Se utilizará el patrón Repository para encapsular la lógica de acceso a datos

## Consecuencias
### Positivas
- Separación clara de datos por agregado
- Integridad referencial garantizada
- Soporte para transacciones ACID
- Buena performance para queries complejos
- Facilidad para hacer joins entre tablas

### Negativas
- Necesidad de mantener múltiples conexiones a bases de datos
- Complejidad adicional en la configuración inicial
- Mayor overhead en la gestión de esquemas separados
