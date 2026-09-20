# ⚡ Flujos de Trabajo y Lógica de Negocio

Este documento detalla la lógica de los algoritmos de recorte de texto, auto-organización, renderizado Open Graph para Notion y colapso de ramas en **Mi Segundo Cerebro**.

---

## 1. Algoritmo de "Razón de Aprendizaje" Dual (`src/utils/textUtils.ts`)

Uno de los requerimientos clave del sistema es asegurar que ningún recurso se guarde sin una síntesis significativa.

### Flujo de Decisión:
```text
                    ¿Modo Manual o Automático?
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      [Modo Manual]                        [Modo Automático]
  ¿Tiene razonManual no vacía?       Ejecuta generarRazonAutomatica()
    ├── Sí: Retorna razonManual        - Remueve URLs y formato Markdown
    └── No: Deriva a Automático        - Toma hasta ~28 palabras
                                       - Busca el último '.', ',' o ';'
                                       - Corta en signo de puntuación
                                       - Retorna sin truncar palabras
```

### Algoritmo de Recorte Inteligente (`generarRazonAutomatica`):
1. **Limpieza**: Remueve URLs (`https?://...`) y caracteres de marcado (`#`, `*`, `_`, `~`).
2. **Segmentación**: Divide el texto por espacios en palabras (`split(/\s+/)`).
3. Si el total de palabras es menor o igual a 28, devuelve el texto completo.
4. Si supera el umbral, toma las primeras 28 palabras y busca el último signo de puntuación (`.`, `,`, `;`):
   - Si el signo está ubicado después del 60% de la longitud preliminar, corta exactamente ahí y agrega un punto final.
   - De lo contrario, corta limpiamente al final de la última palabra completa y añade puntos suspensivos (`...`).
5. **Garantía**: Nunca corta a mitad de una palabra (ej. nunca produce *"fotogra..."*).

---

## 2. Generador Open Graph para Notion (1200 × 630 px)

Notion utiliza las etiquetas Open Graph (`og:image`, `og:title`, `og:description`) para generar sus tarjetas de vista previa (*unfurl bookmark*).

### Especificaciones de la Tarjeta Generada:
- **Dimensiones Estándar**: `1200 × 630 píxeles` (relación de aspecto exacta de **1.91:1** recomendada por Open Graph y Notion).
- **Formato**: SVG vectorial de alta fidelidad exportable y descargable.
- **Estructura Visual**:
  1. Fondo degradado oscuro con patrón de rejilla técnica sutil.
  2. Badge superior con el color oficial de la materia (ej. Cian para Photoshop, Esmeralda para Programación).
  3. Título en tipografía clara y destacada (interlineado optimizado con corte a 2 líneas si es largo).
  4. Caja contenedora con la **Razón de Aprendizaje** rotulada explícitamente:
     > *"¿Por qué lo guardé? / ¿Cómo lo aplico?"*
  5. Pie de tarjeta con el tipo de contenido (Reel, Nota, Imagen), fecha de creación y logotipo de Mi Segundo Cerebro.

### Simulador Notion Web Bookmark:
En `NotionPreviewModal.tsx`, se renderiza una réplica exacta del componente de tarjeta que Notion muestra en sus páginas cuando el usuario pega un enlace como marcador:
- Favicon / icono temático.
- Título truncado a 58 caracteres.
- Descripción con la razón de aprendizaje.
- Miniatura lateral de apoyo.

---

## 3. Algoritmo de Plegado y Expansión de Ramas Jerárquicas

Para mantener el lienzo legible cuando el usuario crea árboles de conocimiento profundos:

### Algoritmo DFS (Depth-First Search):
```typescript
function getHiddenDescendantIds(
  rootId: string, 
  adjacencyMap: Map<string, string[]>, 
  collapsedIds: Set<string>
): Set<string> {
  const hidden = new Set<string>();
  
  function dfs(currentId: string) {
    const children = adjacencyMap.get(currentId) || [];
    for (const childId of children) {
      hidden.add(childId);
      // Continúa recursivamente hacia abajo por toda la rama
      dfs(childId);
    }
  }
  
  // Si el nodo raíz está en la lista de colapsados, esconde sus hijos
  if (collapsedIds.has(rootId)) {
    dfs(rootId);
  }
  
  return hidden;
}
```
- Cada nodo muestra visualmente un botón con el número de descendientes.
- Al alternar el colapso, los nodos ocultos desaparecen del lienzo de forma instantánea y sus aristas se desvanecen limpiamente sin desconectarse de la memoria.

---

## 4. Algoritmo de Auto-Organización (Auto-Layout)

Permite restablecer el orden espacial de los nodos con un solo clic:
1. Agrupa los nodos por su identificador de materia (`categoriaId`).
2. Para cada categoría, reserva una columna vertical en el eje X:
   $$\text{Posición X} = 100 + (\text{Índice de Categoría} \times 380\text{ px})$$
3. Para cada nodo dentro de esa categoría, lo apila en el eje Y:
   $$\text{Posición Y} = 100 + (\text{Índice del Nodo} \times 260\text{ px})$$
4. Invoca la cámara de React Flow con una transición suave (`fitView` con `duration: 600ms`) centrando el nuevo diseño ordenado.

---

## 5. Búsqueda y Filtrado en Tiempo Real

El filtrado opera de manera no destructiva sobre el grafo:
- **No elimina nodos del estado**: Simplemente calcula dos banderas booleanas (`isHighlighted` y `isDimmed`).
- **Nodos coincidentes (`isHighlighted: true`)**:
  - Borde reforzado con resplandor en color índigo.
  - Opacidad al 100%.
- **Nodos no coincidentes (`isDimmed: true`)**:
  - Opacidad reducida al 20%.
  - Puntero deshabilitado temporalmente para destacar los resultados relevantes.
- La búsqueda inspecciona simultáneamente:
  1. Título del recurso (`titulo`).
  2. Contenido o notas (`contenido`).
  3. Razón de aprendizaje efectiva (`obtenerRazonEfectiva`).
  4. Lista de etiquetas (`etiquetas[]`).

---

## 6. Filtrado y Ordenamiento Temporal por Fecha de Creación

Permite explorar la bitácora según la cronología del aprendizaje:
- **Criterios de Fecha Disponibles**:
  - `todas`: Muestra todo el historial.
  - `hoy`: Nodos creados en la fecha actual ($< 24\text{ h}$).
  - `7dias`: Creados en la última semana ($\le 7\text{ días}$).
  - `30dias`: Creados en el último mes ($\le 30\text{ días}$).
  - `esteMes`: Nodos creados en el mes calendario en curso.
- **Ordenamiento Temporal**: Alternador en barra superior entre `Recientes` (más nuevos primero) y `Antiguos` (más antiguos primero), que también rige el ordenamiento del Auto-Layout por columnas.
- **Etiqueta de Fecha en Nodo**: Cada tarjeta en el lienzo muestra en su pie la fecha formateada en lenguaje natural y su tiempo relativo (ej. *"Hoy"*, *"Hace 3 días"*).

---

## 7. Consulta de Nodo Específico y Exportación Documental (`NodeDetailModal`)

Al consultar un nodo específico (haciendo clic en el icono de ojo o doble clic en el nodo):
- **Ficha Visual Interactiva**: Muestra título, categoría, razón de aprendizaje con fondo destacado, notas completas, imagen de apoyo, etiquetas y red de conexiones entrantes y salientes con títulos navegables.
- **Visualizador de Documento Descargable**:
  - **Pestaña Markdown**: Código estructurado con metadatos YAML/tabla, encabezados, citas de aprendizaje y lista de enlaces relacionados.
  - **Pestaña HTML**: Documento web autosuficiente con estilos oscuros, tipografía moderna y listo para imprimir o archivar.
- **Botones de Descarga Directa**:
  - `Descargar .md`: Archivo `.md` listo para Obsidian, Logseq, Typora o Notion.
  - `Descargar .html`: Archivo `.html` interactivo y autónomo.
  - `Copiar`: Copia limpia al portapapeles.
- **Exportación Global de Dossier (`TopBar`)**: Menú desplegable *"Descargar"* en la barra principal para compilar toda la bitácora (o los nodos filtrados actualmente) en un único documento maestro Markdown o HTML con índice navegable.

---

## 8. Flujo de Conexiones en 4 Direcciones, Reconexión y Editor Manual de Lados

El sistema de conexiones no lineal de **Mi Segundo Cerebro** permite articular relaciones conceptuales fluidas en cualquier dirección espacial:

### Arquitectura de Conexión de 4 Puntos:
1. **4 Conectores por Tarjeta**: Cada nodo expone conectores interactivos en las 4 caras cardinales:
   - `top`: Borde superior centrado.
   - `right`: Borde lateral derecho.
   - `bottom`: Borde inferior centrado.
   - `left`: Borde lateral izquierdo.
2. **Modo Libre Bidireccional (`ConnectionMode.Loose`)**:
   - Rompe la rigidez clásica de React Flow (donde los handles son puramente `source` o `target`).
   - Todos los handles operan simultáneamente como emisores y receptores, permitiendo enlazar nodos verticalmente (Abajo ➔ Arriba), horizontalmente (Derecha ➔ Izquierda), o en diagonales complejas.

### Reconexión Interactiva en el Lienzo (`onReconnect`):
- Los extremos de cualquier arista existente pueden ser tomados directamente con el ratón o trackpad en el lienzo y soltados en otro conector o nodo.
- El controlador `onReconnect(oldEdge, newConnection)` en `App.tsx` invoca `reconnectEdge` de `@xyflow/react` para reemplazar la relación preservando la etiqueta original e insertando los nuevos identificadores `sourceHandle` y `targetHandle`.

### Modal Editor de Relaciones (`EdgeEditorModal`):
Al pulsar sobre cualquier conexión, se despliega el modal interactivo con tres capacidades clave:
1. **Selector Manual de Lados**:
   - Permite conmutar con un clic el **Punto de Salida** del nodo de origen (Arriba, Derecha, Abajo, Izquierda).
   - Permite conmutar con un clic el **Punto de Entrada** del nodo de destino (Arriba, Derecha, Abajo, Izquierda).
   - Muestra un diagrama visual en tiempo real del flujo (ej. `[Origen: Derecha] ──► [Destino: Izquierda]`).
2. **Etiqueta Semántica de Aprendizaje**:
   - Campo de texto libre para definir la naturaleza del vínculo cognitivo.
   - Chips rápidos de un solo clic: *"se relaciona con"*, *"es prerrequisito de"*, *"aplica a"*, *"ejemplo de"*, *"complementa a"*, *"deriva de"*.
3. **Eliminación**: Botón con confirmación para desvincular los dos nodos inmediatamente.

---

## 9. Manual de Instrucciones y Guía de Uso Integrada (`InstructionManualModal`)

Para garantizar que el usuario aproveche al máximo el sistema sin barreras de aprendizaje:
- **Puntos de Acceso**:
  - Botón destacado con icono de libro en la barra superior: **"Manual de Uso"**.
  - Insignia flotante en el extremo inferior izquierdo del lienzo: *"¿Dudas? Abre el Manual de Uso"*.
- **Estructura en 7 Capítulos Interactivos**:
  1. **Conexiones (4 Puntos)**: Cómo trazar líneas, usar el selector manual de lados en `EdgeEditorModal` y reconectar aristas en vivo.
  2. **Nodos & Recursos**: Cómo registrar enlaces a reels de Instagram, tutoriales de YouTube, notas de estudio y capturas técnicas.
  3. **Razón de Aprendizaje**: La regla de oro del aprendizaje activo (concepto central + aplicación inmediata), modo manual con contador 140-160 caracteres y algoritmo inteligente automático.
  4. **Filtros & Cronología**: Búsqueda en vivo en múltiples campos, filtros por materia con aislamiento visual y filtros temporales de creación.
  5. **Exportar & Notion**: Creación y copiado de tarjetas Open Graph (1200x630 px) para bookmarks de Notion, y exportación documental en Markdown (.md) y HTML.
  6. **Color 60-30-10 & Tipografía**: Fundamento de la paleta oscura `#001621` (dominante), `#022436` (secundario) y `#FF4103` (acento), con tipografías Vanguard, Athelas y Arial.
  7. **Atajos & Consejos**: Uso de la rueda de ratón para zoom, clic central o arrastrar para paneo, auto-organización y respaldos JSON.
