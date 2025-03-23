# Project Brief: Personal Web Backend

## Core Requirements
- Sistema de blog con gestión de artículos y libros
- API RESTful con Next.js y TypeScript
- Base de datos PostgreSQL
- Arquitectura hexagonal y DDD

## Project Goals
1. Mantener una clara separación de responsabilidades
2. Garantizar alta testeabilidad del código
3. Permitir cambios en la infraestructura sin afectar la lógica de negocio
4. Implementar un sistema robusto de validaciones
5. Mantener una documentación clara y actualizada

## Project Scope

### Core Features
1. Gestión de Artículos
   - CRUD de artículos
   - Validación de contenido
   - Relación con libros
   - Paginación en listados

2. Gestión de Libros
   - CRUD de libros
   - Validación de ISBN
   - Paginación en listados

### Technical Requirements
1. Arquitectura
   - Implementación hexagonal (ports & adapters)
   - Domain Driven Design (DDD)
   - Contextos acotados

2. Testing
   - Tests unitarios
   - Tests de integración
   - Tests end-to-end
   - Object Mothers para testing

3. Infraestructura
   - Next.js y TypeScript
   - PostgreSQL
   - Docker para desarrollo
   - CI/CD pipeline
