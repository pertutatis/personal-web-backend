# 9. Documentación de API con OpenAPI y Swagger UI

Fecha: 2024-03-24

## Estado

Propuesta

## Contexto

La API necesita una documentación clara, actualizada y fácil de usar. Actualmente tenemos:
- Documentación OpenAPI dispersa en varios archivos
- Falta de algunos esquemas y definiciones
- No hay una forma interactiva de explorar y probar la API

## Decisión

Proponemos:
1. Consolidar toda la documentación OpenAPI en un único archivo `openapi.json`
2. Implementar Swagger UI para proporcionar una interfaz interactiva
3. Actualizar y completar los esquemas de la API
4. Agregar ejemplos de uso para cada endpoint

### Detalles Técnicos

1. Se usará `next-swagger-doc` para integrar Swagger UI con Next.js
2. Se consolidarán todos los esquemas en un único archivo
3. Se mantendrá la documentación sincronizada con el código
4. Se agregarán ejemplos de peticiones y respuestas

### Estructura

```bash
docs/
  api/
    openapi.json      # Documentación consolidada
src/
  pages/
    api/
      docs.ts        # Endpoint para Swagger UI
```

## Consecuencias

### Positivas
- Documentación centralizada y más fácil de mantener
- Interfaz interactiva para probar la API
- Mejor experiencia para desarrolladores
- Validación automática de la documentación

### Negativas
- Necesidad de mantener manualmente la sincronización entre código y documentación
- Dependencia adicional (next-swagger-doc)

## Referencias
- [OpenAPI Specification](https://swagger.io/specification/)
- [next-swagger-doc](https://www.npmjs.com/package/next-swagger-doc)
- [Plan de implementación](../implementation-plans/openapi-update.md)
