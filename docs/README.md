# Project Documentation

## Memory Bank
La documentación principal del proyecto se encuentra en el directorio `memory-bank/`. Esta documentación sigue un formato estructurado y jerárquico que permite mantener un registro claro del estado y evolución del proyecto.

### Core Files
1. [`projectbrief.md`](./memory-bank/projectbrief.md) - Documento fundacional que define los requisitos y objetivos
2. [`productContext.md`](./memory-bank/productContext.md) - Contexto del producto y problemas que resuelve
3. [`systemPatterns.md`](./memory-bank/systemPatterns.md) - Arquitectura y patrones del sistema
4. [`techContext.md`](./memory-bank/techContext.md) - Stack tecnológico y configuración
5. [`activeContext.md`](./memory-bank/activeContext.md) - Estado actual y decisiones activas
6. [`progress.md`](./memory-bank/progress.md) - Progreso y problemas conocidos

### Additional Context
- [`adr/`](./adr/) - Architectural Decision Records
- [`obr/`](./obr/) - Object Business Rules
- [`setup/`](./setup/) - Guías de configuración

## Estructura de Directorios

```
docs/
├── README.md
├── memory-bank/        # Documentación principal
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
├── adr/               # Decisiones arquitectónicas
├── obr/               # Reglas de negocio
└── setup/             # Guías de configuración
```

## Mantenimiento

La documentación debe actualizarse en los siguientes casos:
1. Al descubrir nuevos patrones del proyecto
2. Después de implementar cambios significativos
3. Cuando el usuario solicita **update memory bank**
4. Cuando el contexto necesita clarificación

## Convenciones
1. Usar Markdown para toda la documentación
2. Incluir diagramas cuando sea útil (usando Mermaid)
3. Mantener los archivos organizados y actualizados
4. Documentar decisiones importantes en ADRs
