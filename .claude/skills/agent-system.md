# Skill: Configurar el sistema de Agents para un proyecto

## Uso

Cuando necesites implementar el sistema de ficheros agent en un proyecto nuevo (cualquier stack: Python, Next.js, Go, etc.). Este sistema permite a Claude mantener contexto actualizado sobre cada módulo del código sin depender de leer todo el codebase en cada conversación.

## Qué es el sistema de Agents

Los agents son ficheros `.md` dentro de una carpeta `agents/` en cada componente/aplicación del proyecto. Cada fichero documenta el **estado actual de implementación** de un módulo o capa del código: qué existe, qué está pendiente, decisiones de diseño, configuración, dependencias y gotchas.

**No son código ejecutable** — son documentación estructurada que Claude lee antes de tocar un módulo y actualiza después de modificarlo.

## Estructura de carpetas

```
mi-proyecto/
├── CLAUDE.md              # ← Routing principal a agents
├── agents/
│   ├── README.md          # Template + instrucciones para crear nuevos agents
│   ├── overview.md        # Visión general del proyecto
│   ├── <modulo-1>.md      # Agent por módulo/capa
│   ├── <modulo-2>.md
│   └── ...
├── src/                   # (o app/, lib/, packages/, etc.)
│   ├── <modulo-1>/
│   └── <modulo-2>/
└── ...
```

Para **monorepos**, cada sub-proyecto tiene su propia carpeta `agents/` y su propio `CLAUDE.md`:

```
monorepo/
├── CLAUDE.md              # Routing global entre sub-proyectos
├── apps/
│   ├── web/
│   │   ├── CLAUDE.md      # Routing interno → agents/
│   │   └── agents/
│   └── api/
│       ├── CLAUDE.md
│       └── agents/
└── packages/
    └── shared/
        ├── CLAUDE.md
        └── agents/
```

## Paso 1: Crear el CLAUDE.md con Agent Routing

Añadir una sección **Agent Routing** al `CLAUDE.md` del proyecto/componente. Mapea cada directorio de código a su fichero agent:

```markdown
## Agent Routing

**Antes de leer o editar código en `src/`, lee el fichero agent correspondiente en `agents/`.** Esto es obligatorio.

| Trabajando en... | Lee primero |
|-------------------|-------------|
| `src/components/` | `agents/components.md` |
| `src/api/` | `agents/api.md` |
| `src/lib/` | `agents/lib.md` |
| `src/models/` | `agents/models.md` |
| `src/services/` | `agents/services.md` |
| `src/utils/` | `agents/utils.md` |
| General / overview | `agents/overview.md` |
```

Adaptar los nombres según la estructura real del proyecto (ej: `app/` en Next.js, `pkg/` en Go, `packages/` en monorepos JS).

## Paso 2: Crear el README.md de agents

```markdown
# Agents — <Nombre del Proyecto>

Ficheros de contexto para Claude. Cada fichero documenta el estado de implementación de un módulo.

## Template para nuevos agents

(ver template en Paso 3)

## Cuándo crear un nuevo agent

Crea `agents/<nombre>.md` cuando añadas un nuevo package/módulo a la estructura del proyecto y añade una fila a la tabla de routing en `CLAUDE.md`.
```

## Paso 3: Template de un agent

Cada agent sigue esta estructura. Adaptar el contenido al stack del proyecto:

```markdown
# Agent: <Nombre del Módulo>

## What Exists
- Listado de ficheros/clases/funciones/componentes implementados
- Incluir exports, interfaces públicas, rutas

## Pending
- Tareas pendientes de implementar
- Features planificadas pero no comenzadas

## Key Decisions
- Decisiones de diseño con justificación (ej: "Zustand en vez de Redux porque...")
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

## Paso 4: Crear el agent overview.md

El `overview.md` documenta la visión general del proyecto. Incluir:

- Entry points (ej: `main.py`, `app/layout.tsx`, `cmd/server/main.go`)
- Flujo principal de la aplicación (diagrama ASCII si ayuda)
- Stack tecnológico y versiones
- Decisiones arquitectónicas globales

## Paso 5: Añadir las reglas de mantenimiento al CLAUDE.md

```markdown
### Agent Maintenance Rules

**Después de implementar o cambiar cualquier cosa, actualiza el fichero agent correspondiente.**

1. **Nueva implementación** → Actualiza "What Exists", mueve item de "Pending" a documentado
2. **Nuevo módulo/package** → Crea `agents/<nombre>.md` usando el template de `agents/README.md`, añade fila a la tabla de routing
3. **Config/env vars cambiados** → Actualiza "Configuration"
4. **Nueva dependencia** → Actualiza "Dependencies"
5. **Bug fix que revela comportamiento no obvio** → Añade a "Gotchas"
6. **Decisión de diseño** → Añade a "Key Decisions" con justificación
```

## Ejemplos de agents por stack

### Next.js / React

```
agents/
├── overview.md        # App Router layout, middleware, providers
├── components.md      # UI components, design system
├── api.md             # Route handlers (app/api/), server actions
├── lib.md             # Shared utilities, clients, helpers
├── hooks.md           # Custom React hooks
├── services.md        # Business logic, external API clients
├── models.md          # Types, interfaces, Zod schemas
└── auth.md            # Auth setup (NextAuth, Clerk, etc.)
```

### Python (FastAPI / Django)

```
agents/
├── overview.md        # Entry point, startup, middleware
├── api.md             # Routes/endpoints, request handlers
├── core.md            # Repositorios, clientes, lógica core
├── models.md          # Dataclasses, schemas, ORM models
├── services.md        # Orquestación, business logic
├── interfaces.md      # ABCs, contracts, protocols
└── utils.md           # Helpers, logger, error hierarchy
```

### Go

```
agents/
├── overview.md        # cmd/ entry points, wire setup
├── handlers.md        # HTTP handlers, middleware
├── services.md        # Business logic layer
├── repositories.md    # Data access, SQL queries
├── models.md          # Structs, interfaces
└── pkg.md             # Shared packages
```

## Checklist de implementación

- [ ] `CLAUDE.md` con sección Agent Routing y tabla de mapeo directorio → agent
- [ ] `agents/README.md` con template y instrucciones
- [ ] `agents/overview.md` con visión general del proyecto
- [ ] Un `agents/<modulo>.md` por cada directorio principal de código
- [ ] Agent Maintenance Rules en `CLAUDE.md`
- [ ] Contenido de "What Exists" rellenado con el estado actual del código
