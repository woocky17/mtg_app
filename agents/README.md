# Agents — MTG App

Ficheros de contexto para Claude. Cada fichero documenta el estado de implementación de un módulo.

## Template para nuevos agents

```markdown
# Agent: <Nombre del Módulo>

## What Exists
- Listado de ficheros/clases/funciones/componentes implementados
- Incluir exports, interfaces públicas, rutas

## Pending
- Tareas pendientes de implementar
- Features planificadas pero no comenzadas

## Key Decisions
- Decisiones de diseño con justificación
- Trade-offs aceptados

## Configuration
- Variables de entorno relevantes
- Ficheros de configuración que afectan a este módulo

## Dependencies
- Dependencias externas usadas por este módulo

## Gotchas
- Comportamientos no obvios, bugs conocidos, edge cases
- Cosas que sorprenderían a alguien que lee el código por primera vez
```

## Cuándo crear un nuevo agent

Crea `agents/<nombre>.md` cuando añadas un nuevo package/módulo a la estructura del proyecto y añade una fila a la tabla de routing en `CLAUDE.md`.
