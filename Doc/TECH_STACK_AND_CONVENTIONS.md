# 🛠️ Stack Tecnológico, Convenciones y Guía de Extensión

Este documento describe las tecnologías utilizadas, sus versiones, las directrices de código y las instrucciones para extender **Mi Segundo Cerebro**.

---

## 📦 Stack Tecnológico y Dependencias

| Paquete | Versión | Propósito en el Proyecto |
| :--- | :--- | :--- |
| **`react`** | `^19.0.1` | Librería principal de interfaz de usuario con componentes funcionales y hooks. |
| **`react-dom`** | `^19.0.1` | Renderizado del DOM en React 19. |
| **`@xyflow/react`** | `^12.11.6` | Motor de lienzo de mapas conceptuales, grafos y nodos interactivos (React Flow v12). |
| **`tailwindcss`** | `^4.3.3` | Framework de diseño utilitario (configurado mediante `@tailwindcss/vite`). |
| **`lucide-react`** | `^0.546.0` | Paquete oficial de iconos SVG para toda la interfaz (prohibido crear SVG manuales sueltos). |
| **`motion`** | `^12.23.24` | Animaciones fluidas para modales, paneles desplegables y transiciones. |
| **`vite`** | `^8.3.0` | Empaquetador y servidor de desarrollo ultrarrápido configurado en puerto `3000`. |
| **`typescript`** | `^7.0.2` | Verificación estática de tipos estricta (`tsc --noEmit`). |

---

## 🎨 Convenciones de Diseño, Tipografía y Paleta 60-30-10

1. **Jerarquía Tipográfica**:
   - **`Vanguard` (`font-vanguard`)**: Tipografía condensada de alto impacto para títulos principales de la aplicación, números de métricas, y encabezados de sección.
   - **`Athelas` (`font-athelas`)**: Tipografía con serifa editorial refinada para títulos de nodos de aprendizaje, citas, y los bloques de «¿Por qué lo guardé? / Razón de Aprendizaje».
   - **`Arial` (`font-arial` / base)**: Tipografía sans-serif para todo el texto normal, párrafos, etiquetas, campos de formulario, tablas y metadatos.

2. **Sistema de Color con Regla 60% - 30% - 10% (Colores Oficiales: `#001621` y `#FF4103`)**:
   - **60% Dominante**: Base del lienzo y atmósfera nocturna abisal (`--color-dom-60-base`, `#001621`), cubriendo el 60% del espacio visual de la pantalla.
   - **30% Secundario**: Variaciones tonales elevadas para superficies estructurales, tarjetas de nodo, cabecera superior, cajones laterales, modales y bordes (`--color-sec-30-surface`, `#022436`, `--color-sec-30-border`, `#0d4364`).
   - **10% Acento**: Naranja fuego de alta intensidad (`--color-acc-10-primary`, `#FF4103`) reservado exclusivamente para interacción crítica: botón principal `+ Nuevo Nodo`, aristas y nodos seleccionados, halo de resplandor (`rgba(255, 65, 3, 0.4)`), y títulos de razones de estudio.
   - Incluye selector en barra superior con presets y generador dinámico a partir de 2 colores personalizados.

3. **Botones e Interacciones**:
   - Padding horizontal exactamente el doble del vertical (e.g. `px-4 py-2` o `px-3 py-1.5`).
   - Estados de cursor y hover obligatorios (`hover:bg-slate-800`, `transition-colors duration-150`).
   - Bordes redondeados sutiles (`rounded-xl` para tarjetas, `rounded-lg` para controles internos).
4. **Iconos**:
   - Todos los iconos se importan directamente desde `lucide-react`.

---

## ⚙️ Reglas de TypeScript y Compatibilidad con React Flow

1. **Casteo de Nodos en React Flow**:
   React Flow v12 tipifica la propiedad `data` del nodo como `Record<string, unknown>`.
   Para evitar errores de TypeScript:
   ```typescript
   // Al inicializar o crear nodos:
   data: n.data as unknown as Record<string, unknown>
   
   // Al leer datos del nodo:
   const data = node.data as unknown as BrainNodeData;
   ```

2. **Convención de 4 Puntos de Conexión y Modo Libre (`ConnectionMode.Loose`)**:
   - Cada nodo debe declarar 4 elementos `<Handle>` con identificadores fijos: `'top'`, `'right'`, `'bottom'`, `'left'`.
   - Ambos extremos deben admitir conexiones libres activando `connectionMode={ConnectionMode.Loose}` en el componente `<ReactFlow>`.
   - En las aristas (`Edge`), almacenar siempre `sourceHandle` y `targetHandle` de tipo `'top' | 'right' | 'bottom' | 'left'` para preservar la orientación espacial.

3. **Reconexión Interactiva de Aristas (`onReconnect`)**:
   - Utilizar las propiedades `edgesReconnectable={true}` y `reconnectRadius={25}` en `<ReactFlow>`.
   - Implementar el callback `onReconnect: (oldEdge: Edge, newConnection: Connection) => void` utilizando el helper nativo `reconnectEdge(oldEdge, newConnection, edges)` de `@xyflow/react`.

4. **Importaciones**:
   - Todas las importaciones deben estar en la parte superior del archivo.
   - Usar importaciones con nombre explícito (`import { Node, Edge, ConnectionMode, reconnectEdge } from '@xyflow/react'`).

5. **Evitar Re-renders Infinitos**:
   - No instanciar funciones complejas o colecciones sin `useCallback` o `useMemo` en los controladores del grafo.
   - Memorizar la definición de `nodeTypes` para que el canvas de React Flow no desmonte los nodos en cada render.

---

## 🚀 Cómo Extender el Sistema

### 1. ¿Cómo agregar un nuevo tipo de recurso?
1. En `src/types.ts`, actualiza la unión de tipos:
   ```typescript
   export type NodeType = 'enlace' | 'nota' | 'imagen' | 'audio';
   ```
2. En `src/components/CustomNode.tsx`, agrega el icono correspondiente en el renderizador de encabezado:
   ```typescript
   case 'audio': return <Headphones className="w-4 h-4 text-amber-400" />;
   ```
3. En `src/components/NodeEditorModal.tsx`, añade el botón selector en la pestaña de tipos de recurso.

### 2. ¿Cómo añadir una nueva materia por defecto?
1. Edita `src/data/initialData.ts`.
2. Añade la materia al arreglo `INITIAL_CATEGORIES`:
   ```typescript
   {
     id: 'marketing',
     nombre: 'Marketing Digital',
     color: '#f97316',
     bgLight: 'rgba(249, 115, 22, 0.15)',
     borderColor: 'rgba(249, 115, 22, 0.4)',
     textColor: '#fb923c'
   }
   ```

### 3. ¿Cómo añadir un nuevo método de exportación (e.g. Obsidian / Markdown)?
- Los datos de cada nodo ya están serializados en `BrainNodeData`.
- Puedes crear un convertidor en `src/utils/textUtils.ts` que transforme la lista de nodos en archivos individuales de Markdown con encabezados Frontmatter YAML para carpetas de Obsidian.
