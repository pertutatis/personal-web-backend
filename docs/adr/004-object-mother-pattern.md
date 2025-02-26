# 4. Implementación del patrón Object Mother para tests

Fecha: 2024-02-26

## Estado
Aceptado

## Contexto
Necesitamos una forma consistente y mantenible de crear objetos de prueba para nuestros tests. Actualmente, cada test está creando sus propios objetos de prueba, lo que lleva a:
- Duplicación de código
- Inconsistencia en los datos de prueba
- Dificultad para mantener los tests cuando cambian las reglas de negocio
- Poca claridad en la intención de los tests

## Decisión
Implementaremos el patrón Object Mother para nuestros tests. Este patrón:
- Proporciona una única fuente de verdad para la creación de objetos de prueba
- Hace los tests más legibles y mantenibles
- Facilita la creación de diferentes escenarios de prueba
- Centraliza la lógica de creación de objetos
- Reduce la duplicación de código

Estructura:
```
__tests__/
  mothers/
    BookMother.ts
    BookTitleMother.ts
    BookAuthorMother.ts
    BookIsbnMother.ts
```

## Consecuencias
### Positivas
- Tests más legibles y mantenibles
- Menos duplicación de código
- Facilita la creación de diferentes escenarios de prueba
- Centraliza la lógica de creación de objetos
- Hace más fácil adaptar los tests cuando cambian las reglas de negocio

### Negativas
- Añade una capa adicional de abstracción
- Requiere mantenimiento de las clases Mother
- Puede ser excesivo para tests muy simples

## Referencias
- [Object Mother Pattern](https://martinfowler.com/bliki/ObjectMother.html)
- [Test Data Builders](https://www.natpryce.com/articles/000714.html)
