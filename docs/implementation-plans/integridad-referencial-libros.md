# Plan de Implementación: Integridad Referencial Libros-Artículos

## Objetivo
Implementar un sistema de integridad referencial entre libros y artículos basado en eventos y casos de uso específicos.

## 1. Componentes Core

### ArticleBookIds (Value Object)
```typescript
class ArticleBookIds {
  static create(ids: string[]): ArticleBookIds {
    if (!Array.isArray(ids)) throw new ArticleBookIdsEmpty();
    if (ids.length > 10) throw new Error('Maximum exceeded');
    return new ArticleBookIds([...new Set(ids)]);
  }

  remove(id: string): ArticleBookIds {
    return new ArticleBookIds(
      this.value.filter(v => v !== id)
    );
  }
}
```

### RemoveBookReference (Use Case)
```typescript
class RemoveBookReference {
  constructor(private repository: ArticleRepository) {}

  async run(bookId: string): Promise<void> {
    await this.repository.removeBookReference(bookId);
  }
}
```

### ArticleBookReferenceRemover (Subscriber)
```typescript
class ArticleBookReferenceRemover implements DomainEventSubscriber {
  constructor(private removeReference: RemoveBookReference) {}
  
  subscribedTo(): string[] {
    return [BookDeletedDomainEvent.EVENT_NAME];
  }
  
  async on(event: BookDeletedDomainEvent): Promise<void> {
    await this.removeReference.run(event.aggregateId);
  }
}
```

## 2. Plan de Implementación

### Fase 1: Preparación
1. Crear rama feature/book-article-integrity
2. Backup de la base de datos
3. Configurar entorno de pruebas

### Fase 2: Desarrollo
1. Simplificar ArticleBookIds:
   - Eliminar dependencias externas
   - Mantener solo validaciones básicas

2. Implementar DeleteBook:
   - Añadir emisión de evento
   - Configurar event bus

3. Desarrollar RemoveBookReference:
   - Implementar caso de uso
   - Configurar DI

4. Crear ArticleBookReferenceRemover:
   - Implementar subscriber
   - Registrar en el sistema

### Fase 3: Testing
1. Tests Unitarios:
```typescript
describe('ArticleBookIds', () => {
  it('should handle empty array', () => {
    const ids = ArticleBookIds.create([]);
    expect(ids.isEmpty).toBe(true);
  });
});

describe('RemoveBookReference', () => {
  it('should remove references', async () => {
    const useCase = new RemoveBookReference(repository);
    await useCase.run('book-1');
    expect(repository.removeBookReference)
      .toHaveBeenCalledWith('book-1');
  });
});
```

2. Tests de Integración:
```typescript
describe('Book deletion flow', () => {
  it('should update articles', async () => {
    const book = await createBookWithReferences();
    await deleteBook.run(book.id);
    const articles = await findArticlesWithReference(book.id);
    expect(articles).toHaveLength(0);
  });
});
```

3. Tests E2E:
- Flujo completo de eliminación
- Casos de error
- Rendimiento

### Fase 4: Despliegue
1. Preparación:
   - Verificar backups
   - Preparar rollback plan
   - Actualizar documentación

2. Despliegue:
   - Deploy en staging
   - Validación completa
   - Deploy en producción

3. Monitorización:
   - Verificar logs
   - Monitorear rendimiento
   - Validar integridad

## 3. Métricas de Éxito
- Tests passing: 100%
- Cobertura: >95%
- Tiempo de propagación: <5s
- Referencias huérfanas: 0

## 4. Plan de Rollback
1. Script de restauración de referencias
2. Procedimiento de reversión de cambios
3. Plan de comunicación

## 5. Monitorización
1. Métricas clave:
   - Tiempo de procesamiento
   - Tasa de éxito
   - Referencias huérfanas

2. Alertas:
   - Latencia excesiva
   - Errores de procesamiento
   - Inconsistencias detectadas
