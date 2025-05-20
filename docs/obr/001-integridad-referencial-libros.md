# OBR-001: Integridad Referencial Libros

## Estado
Aceptado

## Contexto
Define las reglas de negocio para gestionar las referencias entre libros y artículos.

## Reglas de Negocio

### BR-1: Referencias a Libros
1. Límites y Estructura
   - Un artículo puede tener entre 0 y 10 referencias a libros
   - Las referencias son IDs únicos
   - No se permiten duplicados en un mismo artículo

2. Validaciones
   - `ArticleBookIds` valida solo estructura y límites
   - La validación de existencia se realiza en el caso de uso

### BR-2: Eliminación de Libros
1. Proceso
   - Emisión de evento `BookDeletedDomainEvent`
   - Procesamiento asíncrono por subscriber
   - Actualización de artículos afectados

2. Requerimientos
   - El proceso debe ser eventualmente consistente
   - No debe afectar otros datos del artículo
   - Debe ser idempotente

### BR-3: Monitorización
1. Tiempos de Respuesta
   - Eliminación de libro: < 1s
   - Propagación de cambios: < 5s
   - Actualización de artículos: < 100ms por artículo

2. Métricas
   - Referencias huérfanas: 0
   - Éxito en actualizaciones: 100%
   - Logs de todas las operaciones

## Implementación

### 1. Eventos y Mensajes
```typescript
// Evento de libro eliminado
{
  eventName: 'book.deleted',
  aggregateId: string, // ID del libro
  occurredOn: Date
}
```

### 2. Validaciones del Dominio
```typescript
// ArticleBookIds
- Máximo 10 referencias
- Array no vacío cuando se proporcionan referencias
- Eliminación automática de duplicados

// Actualizaciones
- Transaccional a nivel de artículo
- Retry automático en caso de fallo
```

### 3. Logs y Auditoría
```typescript
// Eventos a registrar
- Libro eliminado
- Inicio de actualización de referencias
- Referencias actualizadas
- Errores durante el proceso
```

## Verificación

### 1. Tests Unitarios
- Validaciones de ArticleBookIds
- Procesamiento de eventos
- Actualizaciones de referencias

### 2. Tests de Integración
- Flujo completo de eliminación
- Manejo de errores
- Concurrencia

### 3. Tests E2E
- Eliminación con múltiples referencias
- Rendimiento con carga
- Recuperación ante fallos

## Operación

### 1. Monitorización
- Dashboard de operaciones
- Alertas por latencia
- Métricas de consistencia

### 2. Mantenimiento
- Backup antes de operaciones masivas
- Scripts de verificación de consistencia
- Plan de rollback documentado

## Consideraciones de Seguridad
1. Acceso
   - Solo usuarios autorizados pueden eliminar libros
   - Logging de todas las operaciones de eliminación

2. Datos
   - No exponer IDs internos en logs
   - Validar input en todas las operaciones
   - Sanitizar datos antes de persistir
