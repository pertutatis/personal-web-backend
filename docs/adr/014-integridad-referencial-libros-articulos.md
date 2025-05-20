# 014 - Integridad Referencial entre Libros y Artículos

## Estado

Propuesto - 2025-05-20

## Contexto

Actualmente existe una relación entre libros y artículos donde los artículos pueden referenciar múltiples libros a través de sus IDs. Sin embargo, si un libro es eliminado, no se actualiza esta relación, dejando referencias huérfanas en los artículos. Esto puede llevar a inconsistencias en los datos y potenciales errores en la aplicación.

## Decisión

Implementaremos integridad referencial entre libros y artículos mediante los siguientes cambios:

1. Validación al crear/actualizar artículos:
   - Cuando se asignen libros a un artículo, verificaremos que todos los IDs de libros existan
   - Se lanzará una excepción `InvalidBookReferenceError` si algún libro no existe

2. Manejo de eliminación de libros:
   - Al eliminar un libro, buscaremos todos los artículos que lo referencian
   - Eliminaremos automáticamente la referencia al libro eliminado de estos artículos
   - Publicaremos un evento de dominio `BookDeletedDomainEvent` que será escuchado por el módulo de artículos

3. Arquitectura hexagonal:
   - El repositorio de artículos implementará un método `removeBookReference` para actualizar artículos
   - El caso de uso `DeleteBook` será responsable de coordinar la eliminación y actualización de referencias
   - Se mantendrá la separación de contextos usando eventos de dominio para la comunicación

4. Testing:
   - Tests unitarios para validación de referencias de libros
   - Tests de integración para el proceso de eliminación
   - Tests e2e para verificar el comportamiento completo del sistema

## Consecuencias

### Positivas
- Se mantiene la consistencia de datos eliminando referencias huérfanas
- Mejor encapsulación de la lógica de negocio al validar referencias
- Comportamiento predecible al eliminar libros
- Mayor facilidad para detectar y depurar problemas relacionales

### Negativas
- Mayor complejidad en el proceso de eliminación de libros
- Necesidad de coordinación entre módulos a través de eventos
- Posible impacto en rendimiento al tener que verificar existencia de libros

### Notas de implementación
- La validación de referencias se realizará en el dominio mediante el value object `ArticleBookIds`
- Se usará el patrón Observer para manejar la actualización de artículos
- Se mantendrá la limitación actual de máximo 10 libros por artículo
