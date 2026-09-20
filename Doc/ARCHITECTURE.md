# 🏗️ Arquitectura del Sistema

Este documento describe la arquitectura global, el flujo de datos unidireccional, el manejo del estado del grafo interactivo y el ciclo de persistencia de **Mi Segundo Cerebro**.

---

## 📐 Diagrama de Flujo de Datos

```text
┌────────────────────────────────────────────────────────┐
│               App.tsx (Root Controller)                │
│  - React Flow Nodes & Edges State                      │
│  - Categories State                                    │
│  - Filter & Search State                               │
│  - Collapsed Node Set                                  │
│  - Edge Reconnection Controller (`onReconnect`)        │
└───────┬──────────────────────┬──────────────────┬──────┘
        │                      │                  │
        ▼                      ▼                  ▼
┌──────────────┐       ┌──────────────┐   ┌───────────────────────────┐
│  TopBar.tsx  │       │ ReactFlow    │   │ Modals & Drawer           │
│  - Search    │       │ Canvas       │   │ - NodeEditorModal         │
│  - Filters   │       │ - CustomNode │   │ - EdgeEditorModal (4 Lados)
│  - Dates     │       │   (4 Handles)│   │ - InstructionManualModal  │
│  - Manual    │       │ - Controls   │   │ - NodeDetailModal         │
│  - Palette   │       │ - MiniMap    │   │ - PaletteModal            │
│  - Backup    │       │ - Loose Mode │   │ - NotionPreviewModal      │
│  - Layout    │       │ - Reconnect  │   │ - StatsDrawer             │
└──────────────┘       └──────────────┘   └───────────────────────────┘
        │                      ▲                  │
        │                      │                  │
        ▼                      │                  ▼
┌────────────────────────────────────────────────────────┐
│             localStorage Persistence Layer             │
│   - segundo_cerebro_nodes                              │
│   - segundo_cerebro_edges                              │
│   - segundo_cerebro_categories                         │
└────────────────────────────────────────────────────────┘
```

---

## 💾 Capa de Persistencia (`localStorage`)

Toda la aplicación opera de forma cliente autónoma ("offline-first"), almacenando automáticamente el estado en el navegador cada vez que se modifican nodos, aristas o categorías:

| Clave en localStorage | Tipo Serializado | Descripción |
| :--- | :--- | :--- |
| `segundo_cerebro_nodes` | `Array<{ id: string, position: {x, y}, data: BrainNodeData }>` | Almacena los nodos y su posición en el lienzo. |
| `segundo_cerebro_edges` | `Array<Edge>` | Almacena las conexiones dirigidas, estilo y etiqueta descriptiva. |
| `segundo_cerebro_categories` | `Array<Category>` | Lista de materias activas (nativas y personalizadas por el usuario). |

### Inicialización Inteligente
Al arrancar la aplicación (`App.tsx`):
1. Intenta leer `segundo_cerebro_nodes` y `segundo_cerebro_edges`.
2. Si no existen registros previos (primera visita), carga los datos sembrados en `src/data/initialData.ts` con ejemplos reales de **Inglés**, **Photoshop 2022**, **Programación**, **Gestión Administrativa**, **Diseño UX/UI** y **Productividad**.

---

## 🕸️ Motor de Grafos (`@xyflow/react`)

La aplicación usa la versión 12 de React Flow (`@xyflow/react`):

### 1. Nodos Personalizados (`nodeTypes`)
Se define un tipo único de nodo `'brainNode'` mapeado a `CustomNode`:
```typescript
const nodeTypes = useMemo(() => ({ brainNode: CustomNode }), []);
```

### 2. Formato de Nodos en el Lienzo
Cada nodo en el lienzo tiene la siguiente estructura:
- `id`: Identificador único (ej. `'node-1'`, `'node-1710000000000'`).
- `type`: `'brainNode'`.
- `position`: Coordenadas `{ x: number, y: number }`.
- `data`: Objeto `BrainCanvasNodeData` que hereda de `BrainNodeData` e inyecta propiedades computadas:
  - `category`: Metadatos de la categoría asignada (colores, nombre).
  - `isHighlighted`: `true` si coincide con la búsqueda activa.
  - `isDimmed`: `true` si hay una búsqueda o filtro activo y este nodo NO coincide.
  - `isCollapsed`: Indica si sus hijos están plegados.
  - `hasChildren` / `childrenCount`: Conteo de sub-ramas conectadas.
  - Callbacks de acción (`onEdit`, `onDelete`, `onOpenNotionModal`, `onToggleCollapse`).

### 3. Conexiones (`Edges`), 4 Puntos de Acople y Reconexión en Vivo
- **4 Puntos de Conexión por Nodo**: Cada componente `CustomNode` renderiza 4 conectores interactivos con IDs específicos:
  - `'top'`: Cara superior (salida y entrada hacia arriba).
  - `'right'`: Cara lateral derecha.
  - `'bottom'`: Cara inferior (por defecto en conexiones descendentes).
  - `'left'`: Cara lateral izquierda.
- **Modo Libre Bidireccional (`ConnectionMode.Loose`)**: Configurado en `<ReactFlow connectionMode={ConnectionMode.Loose}>`, elimina la rigidez de origen/destino y permite unir libremente cualquier cara con cualquier otra.
- **Reconexión Interactiva en Lienzo (`onReconnect`)**: Gracias a `edgesReconnectable={true}` y `reconnectRadius={25}`, el usuario puede arrastrar cualquiera de los dos extremos de una flecha existente sobre el canvas hacia otro punto sin tener que borrarla y crear una nueva.
- **Edición Manual de Lados (`EdgeEditorModal`)**: Al pulsar sobre cualquier conexión, se abre el modal que permite reasignar visualmente los lados de origen y destino mediante botones para los 4 lados cardinales, además de personalizar su etiqueta semántica.
- **Estilo de las Aristas**: Tipo `smoothstep` con trazo estilizado en `#38bdf8`, grosor `2.5px`, animación direccional `animated: true`, flecha terminal `MarkerType.ArrowClosed` y pill de etiqueta en fondo oscuro `#0f172a`.
- **Persistencia de Conexiones**: Cada arista guarda sus propiedades `sourceHandle` y `targetHandle` en `localStorage` (`segundo_cerebro_edges`) para mantener la orientación espacial elegida por el usuario.

---

## 🌳 Árbol Jerárquico y Algoritmo de Colapso (DFS)

Para evitar la saturación visual cuando el mapa crece:
1. Se calcula un mapa de adyacencia `source -> targets[]`.
2. Si un nodo tiene conexiones de salida, muestra un indicador con el número de descendientes directos.
3. Al pulsar en colapsar, el `id` del nodo se añade a un `Set<string>` (`collapsedNodeIds`).
4. La función recursiva `getHiddenDescendantIds()` recorre en profundidad (DFS) todos los nodos descendientes y los oculta dinámicamente del lienzo.
5. Las aristas conectadas a nodos ocultos también se excluyen automáticamente.

---

## 🗂️ Auto-Organización (Layout por Categorías)

La función `handleAutoLayout()` agrupa los nodos por su `categoriaId`:
- Cada categoría forma una columna vertical (`X = colIndex * 380 + 100`).
- Dentro de cada categoría, los nodos se apilan verticalmente (`Y = rowIndex * 260 + 100`).
- Tras reordenar las posiciones de todos los nodos, se invoca `reactFlowInstance.fitView({ padding: 0.2, duration: 600 })` para encuadrar elegantemente la vista completa.
