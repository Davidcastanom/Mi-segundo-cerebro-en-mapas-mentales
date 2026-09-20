# 🧩 Catálogo de Componentes

Este documento detalla cada componente del sistema, su ubicación en el proyecto, responsabilidades, propiedades (`props`) y comportamiento ante eventos.

---

## 🗺️ Resumen de Componentes

| Componente | Archivo | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`TopBar`** | `src/components/TopBar.tsx` | Cabecera con buscador, filtros por categoría y tiempo, botones de acción, exportación Markdown/HTML, manual y analíticas. |
| **`CustomNode`** | `src/components/CustomNode.tsx` | Representación visual de cada recurso en el lienzo con 4 puntos de conexión (Arriba/Der/Abajo/Izq), razón de aprendizaje, miniaturas y acciones. |
| **`NodeEditorModal`** | `src/components/NodeEditorModal.tsx` | Formulario modal para crear o editar nodos, redactar la razón manual/automática y crear nuevas categorías al vuelo. |
| **`EdgeEditorModal`** | `src/components/EdgeEditorModal.tsx` | Modal emergente al pulsar una arista con selector manual de 4 lados (origen/destino), etiquetas semánticas y eliminación. |
| **`InstructionManualModal`** | `src/components/InstructionManualModal.tsx` | Manual de instrucciones y guía de uso completa con 7 capítulos detallados para el dominio del sistema. |
| **`NotionPreviewModal`** | `src/components/NotionPreviewModal.tsx` | Simulador interactivo de Notion Bookmark y visor/descargador de la tarjeta Open Graph (1200 × 630 px). |
| **`StatsDrawer`** | `src/components/StatsDrawer.tsx` | Cajón deslizante lateral con gráficos de barras, densidad de conexiones y métricas del grafo de conocimiento. |
| **`NodeDetailModal`** | `src/components/NodeDetailModal.tsx` | Modal de inspección exhaustiva de nodo con pestañas de Ficha, Documento Markdown y Documento HTML, más descarga directa. |
| **`PaletteModal`** | `src/components/PaletteModal.tsx` | Modal de gestión cromática con regla 60-30-10, presets (`#001621` y `#FF4103`) y generador de variaciones a partir de dos colores. |

---

## 1. `TopBar` (`src/components/TopBar.tsx`)

### Responsabilidades
- Entrada de texto para búsqueda instantánea con atajo rápido de limpieza.
- Selector de filtros por categoría con contadores de nodos en tiempo real.
- Selector de filtros cronológicos (Todo, Hoy, Últimos 7 Días, Este Mes, etc.) con alternador de ordenación reciente/antigua.
- Disparadores de acciones globales:
  - Crear nuevo recurso (`+ Nuevo Recurso`).
  - Auto-organizar el lienzo (`Auto-Organizar`).
  - Centrar el mapa (`Centrar`).
  - Manual de uso interactivo (`Manual de Uso`).
  - Gestión cromática 60-30-10 (`Color 60-30-10`).
  - Menú desplegable de descarga documental (Markdown `.md` y HTML interactivo `.html`).
  - Exportar copia de seguridad en JSON.
  - Importar archivo JSON de respaldo.
  - Abrir el panel de métricas (`Estadísticas`).

### Props Clave
```typescript
interface TopBarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onNewNode: () => void;
  onAutoLayout: () => void;
  onFitView: () => void;
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenStats: () => void;
  onOpenManual: () => void;
  onOpenPalette: () => void;
  onExportMarkdown: () => void;
  onExportHTML: () => void;
  nodeCountsByCategory: Record<string, number>;
  totalNodes: number;
}
```

---

## 2. `CustomNode` (`src/components/CustomNode.tsx`)

### Responsabilidades
- **4 Puntos de Conexión Direccionales (`Handles`)**:
  - `Position.Top` (id: `'top'`): Borde superior centrado.
  - `Position.Right` (id: `'right'`): Borde lateral derecho.
  - `Position.Bottom` (id: `'bottom'`): Borde inferior centrado.
  - `Position.Left` (id: `'left'`): Borde lateral izquierdo.
  - Ambos extremos actúan como `source` y `target` bajo `ConnectionMode.Loose`, con animación de escala al pasar el cursor y anillo cian luminoso (`#38bdf8`).
- Aplica estilos condicionales basados en el tema de la categoría asignada (`category.color`, `category.textColor`, `category.borderColor`).
- Visualiza el tipo de recurso con iconos de Lucide (`Film` / `Instagram` / `Youtube` para enlaces, `FileText` para notas, `Image` para imágenes).
- Muestra la **Razón de Aprendizaje** efectiva (`obtenerRazonEfectiva`) con un badge distintivo que indica si es manual o automática.
- Proporciona botones de acción directa en el pie de la tarjeta:
  - 👁️ Abrir ficha detallada del nodo (`onOpenDetail`).
  - 🔗 Abrir enlace externo (si aplica).
  - 📋 Abrir generador de vista previa de Notion (`onOpenNotionModal`).
  - ✏️ Editar nodo (`onEdit`).
  - 🗑️ Eliminar nodo (`onDelete`).
  - 📁 Colapsar/desplegar ramas dependientes (`onToggleCollapse`).
- Soporta doble clic sobre la tarjeta para abrir su ficha completa.
- Soporta estados de selección (`selected`), resaltado de búsqueda (`isHighlighted`) y atenuación (`isDimmed`).

---

## 3. `NodeEditorModal` (`src/components/NodeEditorModal.tsx`)

### Responsabilidades
- Crear un nuevo nodo desde cero o editar un nodo existente.
- Permite seleccionar el tipo de recurso (`enlace`, `nota`, `imagen`).
- Selector de categoría existente o botón para desplegar el formulario de **creación de nueva categoría** con selector de color hexadecimal.
- Manejo del selector de **Modo de Razón**:
  - `manual`: Campo de texto libre con sugerencia de 140–160 caracteres y contador de caracteres con cambio de color si se excede.
  - `automatico`: Muestra la vista previa en vivo de cómo el algoritmo recortará el texto en la puntuación más cercana sin partir palabras.
- Inserción y previsualización opcional de imagen de apoyo / portada.
- Asignación de etiquetas `#tags` separadas por comas.

### Props Clave
```typescript
interface NodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeData: Omit<BrainNodeData, 'id' | 'fechaCreacion'>) => void;
  initialData?: BrainNodeData | null;
  categories: Category[];
  onAddCategory: (newCategory: Category) => void;
}
```

---

## 4. `EdgeEditorModal` (`src/components/EdgeEditorModal.tsx`)

### Responsabilidades
- Se abre al hacer clic sobre cualquier conexión del lienzo.
- Muestra los nombres de los nodos de origen y destino (`sourceNode` ➔ `targetNode`).
- **Selector Manual de 4 Lados de Conexión**:
  - **Punto de Salida (Origen)**: 4 botones directos para elegir entre Arriba (Top), Derecha (Right), Abajo (Bottom) o Izquierda (Left).
  - **Punto de Entrada (Destino)**: 4 botones directos para elegir entre Arriba (Top), Derecha (Right), Abajo (Bottom) o Izquierda (Left).
  - Previsualizador gráfico del flujo de conexión resultante (ej. `[Origen: Abajo] ──► [Destino: Arriba]`).
- **Selector de Etiquetas Semánticas**:
  - Campo de texto libre.
  - Botones de selección rápida de relaciones de aprendizaje:
    - *"se relaciona con"*
    - *"es prerrequisito de"*
    - *"aplica a"*
    - *"ejemplo de"*
    - *"complementa a"*
    - *"deriva de"*
- Botón de eliminación directa de la arista con confirmación visual.

### Props Clave
```typescript
interface EdgeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  edgeId: string | null;
  initialLabel?: string;
  initialSourceHandle?: 'top' | 'right' | 'bottom' | 'left';
  initialTargetHandle?: 'top' | 'right' | 'bottom' | 'left';
  sourceNodeTitle?: string;
  targetNodeTitle?: string;
  onSaveEdge: (
    edgeId: string,
    label: string,
    sourceHandle?: 'top' | 'right' | 'bottom' | 'left',
    targetHandle?: 'top' | 'right' | 'bottom' | 'left'
  ) => void;
  onDeleteEdge: (edgeId: string) => void;
}
```

---

## 5. `InstructionManualModal` (`src/components/InstructionManualModal.tsx`)

### Responsabilidades
- Manual de uso interactivo completo accesible desde la barra superior (`Manual de Uso`) o desde el acceso rápido flotante inferior del lienzo.
- Estructurado en 7 capítulos accesibles mediante pestañas laterales con iconos:
  1. **Conexiones (4 Puntos)**: Guía detallada para conectar cualquier lado, cambiar de dirección manualmente y reconectar sobre el lienzo.
  2. **Nodos & Recursos**: Tipos de contenido (Reel, Nota, Imagen), campos requeridos y etiquetas.
  3. **Razón de Aprendizaje**: Explicación del método activo vs. pasivo, modo manual de 140-160 caracteres y algoritmo automático.
  4. **Filtros & Cronología**: Búsqueda en vivo, filtrado por materia y rangos temporales (Hoy, 7 días, este mes).
  5. **Exportar & Notion**: Generación de tarjetas Open Graph (1200x630), bookmarks, copiado rápido y exportación Markdown/HTML.
  6. **Color 60-30-10**: Filosofía estética con `#001621` (dominante), `#022436` (secundario) y `#FF4103` (acento), más tipografías Vanguard/Athelas/Arial.
  7. **Atajos & Consejos**: Controles de navegación, zoom, auto-organización y buenas prácticas.

### Props Clave
```typescript
interface InstructionManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 6. `NotionPreviewModal` (`src/components/NotionPreviewModal.tsx`)

### Responsabilidades
- Genera la tarjeta Open Graph de **1200 × 630 px (proporción 1.91:1)** renderizada a través del algoritmo en `src/utils/textUtils.ts`.
- Simula la apariencia del bloque **Notion Web Bookmark** para verificar el resultado visual antes de incrustar.
- Ofrece 3 botones de acción con copia al portapapeles y retroalimentación táctil:
  1. **Copiar URL para Notion Bookmark**.
  2. **Copiar Bloque Markdown** formateado.
  3. **Descargar Tarjeta como SVG** vectorizado en alta definición.

---

## 7. `StatsDrawer` (`src/components/StatsDrawer.tsx`)

### Responsabilidades
- Se despliega suavemente desde el lateral derecho de la pantalla con animaciones de `motion`.
- Métricas calculadas:
  - Total de recursos y conexiones activas.
  - Porcentaje de nodos interconectados (densidad del grafo de conocimiento).
  - Distribución gráfica por categorías con barras de progreso coloreadas.
  - Distribución por formato de contenido (enlaces, notas, imágenes).
  - Listado de etiquetas (#tags) más frecuentes en todo el Segundo Cerebro.

---

## 8. `NodeDetailModal` (`src/components/NodeDetailModal.tsx`)

### Responsabilidades
- Modal de consulta completa de un nodo individual con acceso directo desde el botón de ojo o doble clic en el lienzo.
- Tres pestañas de visualización:
  1. **Ficha de Aprendizaje**: Resumen visual con metadatos completos, razón de aprendizaje resaltada, previsualización de multimedia y lista navegable de conexiones activas (entrantes y salientes).
  2. **Documento Markdown**: Generación dinámica en tiempo real del archivo `.md` estructurado y con formato enriquecido.
  3. **Documento HTML**: Generación del documento web estilizado para archivo autónomo o impresión.
- Herramientas integradas:
  - **Descargar .md**: Descarga directa inmediata del archivo Markdown.
  - **Descargar .html**: Descarga directa del archivo HTML interactivo.
  - **Copiar Markdown**: Envía el contenido al portapapeles con confirmación visual.
  - Acciones rápidas para editar el nodo o abrir la previsualización de tarjeta Notion.

---

## 9. `PaletteModal` (`src/components/PaletteModal.tsx`)

### Responsabilidades
- Modal de configuración y personalización del sistema de color bajo la **regla matemática 60% - 30% - 10%**.
- Selector de paletas duales predefinidas con previsualizaciones de franjas de distribución cromática.
- Paleta insignia por defecto configurada con `#001621` (60% dominante) y `#FF4103` (10% acento fuego).
- Generador paramétrico que recibe dos códigos hexadecimales y calcula las variaciones armónicas de luminosidad y saturación para los roles 60-30-10.
- Persistencia inmediata de la paleta en `localStorage` (`mi_segundo_cerebro_palette_60_30_10_v2`) y actualización dinámica de las variables CSS globales (`:root`).
