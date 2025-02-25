# ADR 001: Arquitectura Hexagonal y DDD

## Estado
Aceptado

## Contexto
Necesitamos implementar un sistema de blog que sea mantenible, testeable y que permita cambios en la infraestructura sin afectar la lógica de negocio.

## Decisión
Implementaremos una arquitectura hexagonal (ports & adapters) junto con Domain Driven Design (DDD) por las siguientes razones:

1. Separación clara de responsabilidades:
   - Domain: Contiene la lógica de negocio pura
   - Application: Casos de uso que orquestan el dominio
   - Infrastructure: Implementaciones concretas (bases de datos, HTTP, etc.)

2. Contextos acotados (Bounded Contexts):
   - Blog: Principal contexto que contiene los agregados Article y Book
   - Shared: Código compartido entre contextos

3. Inversión de dependencias:
   - El dominio no depende de capas externas
   - Las interfaces definen contratos que la infraestructura debe implementar

## Consecuencias
### Positivas
- Alta testeabilidad
- Código más mantenible y comprensible
- Facilidad para cambiar implementaciones de infraestructura
- Clara separación de responsabilidades

### Negativas
- Mayor complejidad inicial
- Más código boilerplate
- Curva de aprendizaje más pronunciada para nuevos desarrolladores
