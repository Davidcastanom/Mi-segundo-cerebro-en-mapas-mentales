# 🧭 Master Index & Guía Rápida para IA y Desarrolladores

> **Acceso ultrarrápido para agentes de IA y desarrolladores**: Este índice y la carpeta `/Doc` contienen toda la información contextual, arquitectura, componentes, modelos de datos y flujos de **Mi Segundo Cerebro**, permitiendo comprender y modificar el proyecto sin necesidad de inspeccionar individualmente cada archivo fuente.

---

## 🗂️ Mapa de Archivos de Documentación

| Archivo | Contenido Clave | ¿Cuándo Consultar? |
| :--- | :--- | :--- |
| **[INDEX.md](./INDEX.md)** | Visión ejecutiva, mapa mental del proyecto y resumen instantáneo. | Al iniciar una consulta o retomar contexto general. |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitectura global, ciclo de vida del estado, persistencia en `localStorage` y grafo React Flow. | Para entender cómo viajan los datos entre canvas, modales y almacenamiento. |
| **[COMPONENTS.md](./COMPONENTS.md)** | Catálogo de componentes (`TopBar`, `CustomNode`, `NodeEditorModal`, etc.), props y eventos. | Al agregar botones, cambiar interfaces o manipular vistas. |
| **[DATA_MODELS.md](./DATA_MODELS.md)** | Interfaces TypeScript (`BrainNodeData`, `Category`, `BrainEdgeData`, `FilterState`), esquemas y JSON. | Al modificar propiedades de nodos, tipos de recursos o categorías. |
| **[FEATURES_AND_FLOWS.md](./FEATURES_AND_FLOWS.md)** | Algoritmos de recorte de texto, auto-organización, colapso de ramas jerárquicas y exportación a Notion. | Para ajustar lógica de negocio, búsquedas o generación de tarjetas SVG. |
| **[TECH_STACK_AND_CONVENTIONS.md](./TECH_STACK_AND_CONVENTIONS.md)** | Versiones de librerías, Tailwind v4, `@xyflow/react` v12, reglas de TypeScript y extensiones. | Antes de compilar, editar estilos o añadir librerías. |

---

## ⚡ Resumen Ejecutivo del Sistema (Cheat Sheet de 30 Segundos)

- **Nombre**: Mi Segundo Cerebro (Bitácora Visual de Aprendizaje).
- **Propósito**: Mapa mental interactivo para guardar y conectar reels de Instagram, notas de estudio, videos e imágenes organizados por materia, con 4 puntos de conexión direccionales (Arriba, Derecha, Abajo, Izquierda), reconexión en vivo, generación de tarjetas Open Graph (1200 × 630 px) optimizadas para Notion, y exportación documental en Markdown y HTML.
- **Tecnologías**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + `@xyflow/react` (React Flow v12) + `lucide-react` + `motion`.
- **Estructura Clave**:
  - `src/App.tsx`: Estado principal de nodos, aristas, filtros, reconexión de aristas y orquestación de modales.
  - `src/types.ts`: Tipado TypeScript unificado (incluye `sourceHandle` y `targetHandle` direccionales).
  - `src/components/CustomNode.tsx`: Componente de nodo en React Flow con 4 conectores interactivos (`top`, `right`, `bottom`, `left`), modo libre bidireccional, visualización temática y acciones.
  - `src/components/TopBar.tsx`: Barra superior con búsqueda en vivo, filtros por materia, filtro cronológico, manual de instrucciones, paleta 60-30-10 y exportación.
  - `src/components/EdgeEditorModal.tsx`: Modal con selector visual interactivo de lados de origen y destino (Arriba/Der/Abajo/Izq), etiquetado y eliminación.
  - `src/components/InstructionManualModal.tsx`: Manual de instrucciones completo y guía de uso con 7 capítulos detallados.
  - `src/components/NodeEditorModal.tsx`: Creación y edición de recursos y categorías.
  - `src/components/NodeDetailModal.tsx`: Ficha individual exhaustiva con generación y descarga directa de archivos `.md` y `.html`.
  - `src/components/PaletteModal.tsx`: Gestor cromático con regla 60-30-10 (`#001621` y `#FF4103`) y generador armónico.
  - `src/components/NotionPreviewModal.tsx`: Simulador de Notion Bookmark y generador SVG Open Graph (1200x630).
  - `src/components/StatsDrawer.tsx`: Cajón lateral con analíticas y métricas de interconexión.
  - `src/utils/textUtils.ts`: Algoritmos de recorte inteligente (corte por puntuación sin romper palabras) y generador de SVG/Markdown/HTML.
  - `src/data/initialData.ts`: 6 categorías y nodos iniciales preconfigurados con conexiones dirigidas multimanerales.

---

## 🎯 Reglas Críticas para Agentes de IA

1. **Persistencia Local**: El estado persiste bajo las claves `segundo_cerebro_nodes`, `segundo_cerebro_edges` (incluyendo `sourceHandle` y `targetHandle`) y `segundo_cerebro_categories` en `localStorage`.
2. **Conexiones y 4 Puntos de Acople**: Cada nodo expone 4 conectores identificados como `'top'`, `'right'`, `'bottom'` y `'left'`. El lienzo opera con `connectionMode={ConnectionMode.Loose}`, permitiendo conectar libremente cualquier lado y reconectar aristas sobre el lienzo mediante `onReconnect` (`reconnectEdge`).
3. **Compatibilidad de Tipos React Flow**: Los nodos de `@xyflow/react` esperan `data: Record<string, unknown>`. En TypeScript se realiza el casteo seguro con `data: n.data as unknown as Record<string, unknown>` y en lectura con `node.data as unknown as BrainNodeData`.
4. **Razón de Aprendizaje Dual**:
   - `razonModo: 'manual'`: Usa `razonManual` respetando el límite de 140-160 caracteres.
   - `razonModo: 'automatico'`: Invoca `obtenerRazonEfectiva(node)` que corta el texto en el último punto o coma antes de las ~28 palabras sin truncar palabras intermedias.
5. **Relaciones entre Nodos**: Las aristas son dirigidas (`source` -> `target`), admiten etiquetas personalizadas (`etiqueta`), puntos de acople (`sourceHandle`, `targetHandle`) y soportan colapso recursivo de ramas mediante DFS (oculta nodos hijos si el nodo padre tiene `isCollapsed: true`).
6. **Estilos y Paleta**: Todo el estilizado es mediante clases utilitarias de **Tailwind CSS v4** (`@import "tailwindcss";` en `src/index.css`) bajo la regla 60-30-10 con base abisal `#001621` y acento `#FF4103`. No se deben crear archivos `.css` adicionales ni usar CSS inline.
