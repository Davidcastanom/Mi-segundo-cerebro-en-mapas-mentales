# 📊 Modelos de Datos y Esquemas

Este documento describe todas las interfaces de TypeScript, estructuras de datos, tipos y formatos de persistencia de **Mi Segundo Cerebro**.

---

## 📐 Definiciones de TypeScript (`src/types.ts`)

### 1. `NodeType`
Tipo de recurso admitido en el sistema:
```typescript
export type NodeType = 'enlace' | 'nota' | 'imagen';
```
- `'enlace'`: Reels de Instagram, videos de YouTube, podcasts o enlaces web.
- `'nota'`: Notas de estudio, definiciones, sintaxis o apuntes teóricos.
- `'imagen'`: Infografías, atajos de teclado o capturas de pantalla de referencia.

---

### 2. `Category`
Estructura de una materia o categoría de estudio:
```typescript
export interface Category {
  id: string;          // Identificador único (ej: 'ingles', 'photoshop', 'cat-171000')
  nombre: string;      // Nombre visible (ej: 'Photoshop 2022', 'Inglés')
  color: string;       // Color principal Hex o Tailwind (ej: '#06b6d4')
  bgLight: string;     // Fondo suave para badges (ej: 'rgba(6,182,212,0.15)')
  borderColor: string; // Color del borde (ej: 'rgba(6,182,212,0.4)')
  textColor: string;   // Color de texto contrastado (ej: '#22d3ee')
  iconName?: string;   // Nombre opcional de icono de lucide-react
}
```

---

### 3. `BrainNodeData`
Datos centrales de cada nodo en el grafo de conocimiento:
```typescript
export interface BrainNodeData {
  id: string;
  tipo: NodeType;
  titulo: string;
  contenido: string; // URL en enlaces/imágenes, o texto para notas
  categoriaId: string;
  etiquetas: string[];
  fechaCreacion: string; // Formato ISO 8601
  
  // Sistema de Razón de Aprendizaje (Requisitos clave)
  razonModo: 'manual' | 'automatico';
  razonManual?: string;     // Redacción manual (140-160 caracteres óptimo)
  razonCalculada?: string;  // Resumen generado automáticamente
  
  // Metadatos de Enlaces
  urlOriginal?: string;
  plataforma?: 'instagram' | 'youtube' | 'web' | 'otro';
  
  // Imagen de apoyo
  imagenUrl?: string;
  
  // Jerarquía y Colapso de Ramas
  isCollapsed?: boolean;
  hasChildren?: boolean;
  childrenCount?: number;
  
  // Compatibilidad con React Flow Record<string, unknown>
  [key: string]: unknown;
}
```

---

### 4. `BrainCanvasNodeData` (`src/components/CustomNode.tsx`)
Extensión inyectada por `App.tsx` en tiempo de renderizado con callbacks y estados visuales:
```typescript
export type BrainCanvasNodeData = BrainNodeData & {
  category?: Category;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onEdit?: (node: BrainNodeData) => void;
  onDelete?: (id: string) => void;
  onOpenNotionModal?: (node: BrainNodeData) => void;
  onOpenDetail?: (node: BrainNodeData) => void;
  onToggleCollapse?: (id: string) => void;
};
```

---

### 5. `BrainEdgeData`
Datos de la conexión entre dos conceptos, con soporte para los 4 puntos direccionales:
```typescript
export interface BrainEdgeData {
  id: string;                                           // Identificador único (ej: 'e-node1-node2')
  source: string;                                       // ID del nodo origen
  target: string;                                       // ID del nodo destino
  etiqueta?: string;                                    // Texto de la relación (ej: 'aplica a', 'es prerrequisito')
  sourceHandle?: 'top' | 'right' | 'bottom' | 'left';   // Punto de salida del nodo origen
  targetHandle?: 'top' | 'right' | 'bottom' | 'left';   // Punto de entrada del nodo destino
}
```

---

### 6. `FilterState`
Estado reactivo del panel de filtros superiores con soporte cronológico:
```typescript
export interface FilterState {
  busqueda: string;
  categoriaId: string | null;                           // null = 'todas'
  tipo: NodeType | 'todos';
  soloConectados: boolean;
  rangoFecha: 'todo' | 'hoy' | '7dias' | '30dias' | 'mes'; // Filtro cronológico
  ordenTemporal: 'reciente' | 'antiguo';                // Criterio de ordenación
}
```

---

## 🗄️ Estructura del Respaldo JSON (`backup.json`)

Al exportar una copia de seguridad mediante el botón de la barra superior, se genera un archivo descargable con el siguiente formato estandarizado:

```json
{
  "version": "1.0.0",
  "app": "Mi Segundo Cerebro",
  "fechaExportacion": "2026-09-18T18:00:00.000Z",
  "categories": [
    {
      "id": "ingles",
      "nombre": "Inglés",
      "color": "#3b82f6",
      "bgLight": "rgba(59, 130, 246, 0.15)",
      "borderColor": "rgba(59, 130, 246, 0.4)",
      "textColor": "#60a5fa"
    }
  ],
  "nodes": [
    {
      "id": "node-1",
      "position": { "x": 100, "y": 100 },
      "data": {
        "id": "node-1",
        "tipo": "enlace",
        "titulo": "Phrasal Verbs con 'Get'",
        "contenido": "https://www.instagram.com/reel/example",
        "categoriaId": "ingles",
        "etiquetas": ["grammar", "vocabulary", "speaking"],
        "fechaCreacion": "2026-09-18T10:00:00.000Z",
        "razonModo": "manual",
        "razonManual": "Diferencia entre get along, get over y get by para entrevistas en inglés.",
        "plataforma": "instagram"
      }
    }
  ],
  "edges": [
    {
      "id": "e-node1-node2",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "bottom",
      "targetHandle": "top",
      "label": "aplica en práctica a"
    }
  ]
}
```

---

## 🛡️ Validación en la Importación
Al cargar un archivo JSON mediante el selector de archivos:
1. Comprueba la presencia de las claves `nodes` y `categories`.
2. Sanitiza cada nodo para asegurar que contenga `id`, `position` y `data`.
3. Restaura las categorías personalizadas sin sobreescribir inadvertidamente el formato.
4. Actualiza inmediatamente el estado de React Flow y escribe en `localStorage`.
