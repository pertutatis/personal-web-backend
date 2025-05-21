# 14. Gestión de Integridad Referencial entre Libros y Artículos

Fecha: 2025-05-20

## Estado
Implementado

## Contexto
Necesitamos asegurar la integridad referencial entre libros y artículos, específicamente cuando se elimina un libro que está referenciado en artículos.

## Decisión

### Enfoque Final: Eventos y Caso de Uso Dedicado
Implementaremos un sistema basado en:

1. Eventos de Dominio:
   - `BookDeletedDomainEvent`: notifica la eliminación de un libro
   - Proporciona comunicación desacoplada entre contextos

2. Subscriber dedicado:
   - `ArticleBookReferenceRemover`: escucha eventos de eliminación
   - Coordina la actualización de referencias

3. Caso de uso específico:
   - `RemoveBookReference`: ejecuta la lógica de actualización
   - Utiliza el repositorio para las operaciones

4. Simplificación del dominio:
   - `ArticleBookIds`: objeto de valor puro sin validaciones externas
   - Solo valida estructura y límites básicos

### Flujo de Datos
```
DeleteBook -> BookDeletedDomainEvent -> ArticleBookReferenceRemover -> RemoveBookReference -> Repository
```

### Responsabilidades
- ArticleBookIds: validación estructural
- RemoveBookReference: lógica de actualización
- Subscriber: orquestación del proceso
- Repository: persistencia de cambios

## Consecuencias

### Positivas
- Clara separación de responsabilidades
- Objetos de valor simples y puros
- Lógica de negocio centralizada
- Fácil de testear y mantener
- Mejor rendimiento
- Desacoplamiento entre contextos

### Negativas
- Latencia en la actualización de referencias
- Necesidad de gestionar consistencia eventual

## Implementación

### 1. Componentes Clave
```typescript
// Subscriber
class ArticleBookReferenceRemover implements DomainEventSubscriber {
  subscribedTo() {
    return [BookDeletedDomainEvent.EVENT_NAME];
  }

  async on(event: BookDeletedDomainEvent) {
    await this.removeReference.run(event.aggregateId);
  }
}

// Caso de Uso
class RemoveBookReference {
  async run(bookId: string): Promise<void> {
    await this.repository.removeBookReference(bookId);
  }
}

// Value Object
class ArticleBookIds {
  static create(ids: string[]): ArticleBookIds {
    if (!Array.isArray(ids)) throw new ArticleBookIdsEmpty();
    if (ids.length > 10) throw new Error('Maximum exceeded');
    return new ArticleBookIds([...new Set(ids)]);
  }
}
```

### 2. Configuración
- Registrar subscriber en el contenedor DI
- Configurar event bus
- Implementar monitorización

## Alternativas Consideradas

### 1. Validación en ArticleBookIds (Rechazada)
- Mezclaba responsabilidades
- Complicaba el testing
- Creaba dependencias innecesarias

### 2. Actualización Síncrona (Rechazada)
- Menos resiliente
- Peor rendimiento
- Acoplamiento fuerte

## Notas
- Priorizar simplicidad y separación de responsabilidades
- Monitorizar tiempos de propagación
- Mantener logs detallados
- Implementar retry policy
