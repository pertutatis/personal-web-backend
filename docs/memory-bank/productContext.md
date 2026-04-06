# Product Context

## Purpose

Sistema de gestión de blog que permite organizar y relacionar artículos con libros de referencia, proporcionando una base sólida para crear contenido estructurado y organizado. Ahora, con la integración MCP, se habilita la gestión automatizada por agente IA, mejorando la eficiencia y calidad del contenido.

## Problems Solved

1. Organización de contenido: Permite estructurar artículos y relacionarlos con libros de referencia
2. Validación de datos: Garantiza la integridad y calidad del contenido mediante reglas de negocio estrictas
3. Gestión eficiente: Facilita la administración de artículos y libros con operaciones CRUD estandarizadas
4. Automatización: El agente IA puede publicar, editar, moderar y versionar artículos, reduciendo errores humanos y acelerando procesos
5. Moderación automática: Detección y bloqueo de contenido no permitido antes de publicación
6. Control de versiones: Permite revertir cambios y consultar historial de ediciones

## How It Works

1. Gestión de Artículos

   - Creación, lectura, actualización y eliminación de artículos
   - Validación de título y contenido
   - Asociación con libros de referencia
   - Listado paginado de artículos
   - Moderación automática y control de versiones por agente IA

2. Gestión de Libros

   - Creación, lectura, actualización y eliminación de libros
   - Validación de ISBN, título y autor
   - Listado paginado de libros
   - Referenciación desde artículos

3. Características Técnicas
   - API RESTful
   - Validaciones robustas
   - Manejo de errores consistente
   - Paginación eficiente
   - Integración MCP para automatización y comunicación con agente IA

## User Experience Goals

1. **Fiabilidad**

   - Validaciones claras y precisas
   - Respuestas consistentes
   - Manejo de errores informativo
   - Moderación automática y control de versiones transparente

2. **Usabilidad**

   - API intuitiva y bien documentada
   - Endpoints RESTful consistentes
   - Respuestas JSON bien estructuradas
   - Operaciones automatizadas accesibles para usuarios avanzados

3. **Rendimiento**

   - Tiempos de respuesta optimizados
   - Paginación eficiente
   - Consultas SQL optimizadas
   - Procesos automáticos sin afectar la experiencia del usuario

4. **Mantenibilidad**
   - Código limpio y bien organizado
   - Documentación clara
   - Tests exhaustivos
   - Extensibilidad para nuevos comandos MCP y reglas IA
