# ADR 016: Migración a Supabase como Base de Datos de Producción

## Estado
Propuesto

## Contexto
El sistema actualmente utiliza PostgreSQL de forma directa para todos los entornos. Para mejorar la escalabilidad y gestión en producción, se ha decidido migrar a Supabase como proveedor de base de datos en producción, manteniendo PostgreSQL local para desarrollo y testing.

## Decisión

### Estructura de Base de Datos
- Unificar todas las bases de datos en una sola con diferentes tablas
- Mantener la misma estructura de tablas en todos los entornos (prod/dev/test)
- Usar esquemas de base de datos para separar contextos si es necesario

### Configuración por Entorno
```typescript
// Producción (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://puawbpuoeqhgprxadrxd.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_Iejo04gqjj897USZg_7VyQ_9Rbxf7Xe

// Desarrollo/Test (PostgreSQL local)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Cambios en la Arquitectura

1. **Capa de Infraestructura**
   - Crear adaptadores específicos para Supabase
   - Mantener los repositorios de PostgreSQL para desarrollo/test
   - Implementar factory para seleccionar el repositorio según el entorno

2. **Controllers**
   - Inyectar el repositorio correcto según el entorno
   - Mantener la lógica de negocio sin cambios
   - Actualizar la configuración de conexión

3. **Testing**
   - Tests unitarios: sin cambios
   - Tests de integración: usar PostgreSQL local
   - Tests E2E: usar PostgreSQL local

### Estructura de Carpetas
```
src/
├── contexts/
│   └── shared/
│       └── infrastructure/
│           ├── persistence/
│           │   ├── PostgresRepository.ts
│           │   └── SupabaseRepository.ts
│           └── config/
│               └── DatabaseConfig.ts
```

## Consecuencias

### Positivas
1. Mejor gestión de la base de datos en producción
2. Backups y seguridad mejorados
3. Escalabilidad automática
4. Menor mantenimiento en producción

### Negativas
1. Complejidad adicional en la configuración
2. Necesidad de mantener dos implementaciones
3. Posibles diferencias de comportamiento entre entornos

### Mitigación de Riesgos
1. Testing exhaustivo en ambos entornos
2. Documentación clara de las diferencias
3. Scripts de migración automatizados
4. Monitorización de rendimiento

## Plan de Implementación

1. **Fase 1: Preparación**
   - Crear configuraciones por entorno
   - Implementar adaptadores de Supabase
   - Actualizar scripts de migración

2. **Fase 2: Migración**
   - Migrar tablas una a una
   - Validar integridad de datos
   - Pruebas en entorno de staging

3. **Fase 3: Validación**
   - Testing exhaustivo
   - Verificación de rendimiento
   - Documentación actualizada

## Referencias
- Documentación de Supabase
- ADRs previos sobre la arquitectura de base de datos
- Patrones de sistema actuales
