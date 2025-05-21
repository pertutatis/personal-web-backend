# OBR-001: Integridad Referencial Libros

## Estado
Aceptado

## Contexto
Define las reglas de negocio para gestionar las referencias entre libros y artículos.

## Reglas de Negocio

### BR-1: Referencias a Libros
1. Límites y Estructura
   - Un artículo puede tener entre 0 y 10 referencias a libros
   - Las referencias son UUIDs v4 válidos
   - No se permiten duplicados en un mismo artículo

2. Validaciones
   - `ArticleBookIds` valida solo estructura y límites
   - `BookId` valida formato UUID v4
   - La validación de existencia se realiza en el repositorio

### BR-2: Eliminación de Libros
1. Proceso
   - Emisión de evento `BookDeletedDomainEvent`
   - Procesamiento asíncrono por subscriber
   - Actualización de artículos afectados

2. Requerimientos
   - El proceso debe ser eventualmente consistente
   - No debe afectar otros datos del artículo
   - Debe ser idempotente
   - Debe validar UUIDs en toda la cadena

### BR-3: Monitorización
1. Tiempos de Respuesta
   - Eliminación de libro: < 1s
   - Propagación de cambios: < 5s
   - Actualización de artículos: < 100ms por artículo

2. Métricas
   - Referencias huérfanas: 0
   - Éxito en actualizaciones: 100%
   - Logs de todas las operaciones
   - Errores de validación UUID

## Implementación

### 1. Eventos y Mensajes
```typescript
// Evento de libro eliminado
{
  eventName: 'book.deleted',
  aggregateId: string, // UUID v4 del libro
  occurredOn: Date
}
```

### 2. Validaciones del Dominio
```typescript
// ArticleBookIds
- Máximo 10 referencias
- Array no vacío cuando se proporcionan referencias
- Eliminación automática de duplicados

// BookId
- Validación de formato UUID v4
- Throw BookIdInvalid en caso de formato inválido

// Actualizaciones
- Transaccional a nivel de artículo
- Retry automático en caso de fallo
```

### 3. Logs y Auditoría
```typescript
// Eventos a registrar
- Libro eliminado (incluir UUID)
- Inicio de actualización de referencias
- Referencias actualizadas (número de artículos)
- Errores durante el proceso
- Errores de validación UUID
```

## Verificación

### 1. Tests Unitarios
- Validaciones de ArticleBookIds
- Validaciones de BookId (UUID)
- Procesamiento de eventos
- Actualizaciones de referencias

### 2. Tests de Integración
- Flujo completo de eliminación
- Manejo de errores de validación
- Concurrencia
- Validación de UUIDs en BD

### 3. Tests E2E
- Eliminación con múltiples referencias
- Rendimiento con carga
- Recuperación ante fallos
- Validación end-to-end de UUIDs

## Operación

### 1. Monitorización
- Dashboard de operaciones
- Alertas por latencia
- Métricas de consistencia
- Errores de validación UUID

### 2. Mantenimiento
- Backup antes de operaciones masivas
- Scripts de verificación de consistencia
- Scripts de validación de UUIDs
- Plan de rollback documentado

## Consideraciones de Seguridad
1. Acceso
   - Solo usuarios autorizados pueden eliminar libros
   - Logging de todas las operaciones de eliminación
   - Validación de UUIDs en todas las operaciones

2. Datos
   - No exponer UUIDs completos en logs (truncar)
   - Validar input en todas las operaciones
   - Sanitizar datos antes de persistir
   - Validar formato UUID antes de cualquier operación
