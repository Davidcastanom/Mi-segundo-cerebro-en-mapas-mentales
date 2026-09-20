# 🧠 Mi Segundo Cerebro — Bitácora Visual de Aprendizaje

> **Lienzo interactivo de mapas conceptuales y organizador de conocimiento diseñado para recopilar, conectar y fijar aprendizajes provenientes de reels, videos, notas e imágenes, con generación de tarjetas Open Graph para Notion.**

---

## 📋 Tabla de Contenido
1. [Visión General y Filosofía](#-visión-general-y-filosofía)
2. [Características Principales](#-características-principales)
3. [Áreas de Conocimiento Integradas](#-áreas-de-conocimiento-integradas)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
6. [Guía de Inicio Rápido (Instalación y Uso Local)](#-guía-de-inicio-rápido)
7. [Guía de Uso Paso a Paso](#-guía-de-uso-paso-a-paso)
   - [Creación y Edición de Nodos](#1-creación-y-edición-de-nodos)
   - [Conexión con 4 Puntos Manuales y Reconexión en Vivo](#2-conexión-con-4-puntos-manuales-y-reconexión-en-vivo)
   - [Edición Manual de Puntos de Entrada y Salida](#3-edición-manual-de-puntos-de-entrada-y-salida)
   - [Manual de Instrucciones Integrado](#4-manual-de-instrucciones-integrado)
   - [Colapso y Expansión de Ramas de Estudio](#5-colapso-y-expansión-de-ramas-de-estudio)
   - [Búsqueda, Filtro por Materia y Filtro Temporal](#6-búsqueda-filtro-por-materia-y-filtro-temporal)
   - [Exportación y Previsualización para Notion (Open Graph)](#7-exportación-y-previsualización-para-notion-open-graph)
   - [Exportación Documental (.md / .html)](#8-exportación-documental-md--html)
   - [Auto-Organización (Auto-Layout)](#9-auto-organización-auto-layout)
   - [Copia de Seguridad y Restauración (JSON)](#10-copia-de-seguridad-y-restauración-json)
8. [El Método: Por qué funciona la "Razón de Aprendizaje"](#-el-método-por-qué-funciona-la-razón-de-aprendizaje)
9. [Scripts Disponibles](#-scripts-disponibles)
10. [Licencia](#-licencia)

---

## 💡 Visión General y Filosofía

A diario consumimos decenas de contenidos educativos en redes y plataformas (Instagram Reels, tutoriales de YouTube, hilos, artículos técnicos e infografías). Sin embargo, la mayor parte de esa información se pierde o queda acumulada en listas de "Guardados" que nunca volvemos a consultar.

**Mi Segundo Cerebro** resuelve este problema mediante tres pilares:
1. **Comprensión Activa vs. Guardado Pasivo**: Al registrar un recurso, te pide definir una **Razón de Aprendizaje** (por qué lo guardaste y cómo lo aplicarás).
2. **Pensamiento No Lineal en Red con Conexiones en 4 Direcciones**: El conocimiento no es una lista plana; es un grafo donde un concepto se ramifica libremente conectándose desde arriba, abajo o los costados con reconexión interactiva.
3. **Sinergia con Notion y Exportación Completa**: Generación instantánea de miniaturas optimizadas **Open Graph (1200 × 630 px)**, bloques de marcadores y dossiers completos en Markdown y HTML.

---

## ⚡ Características Principales

### 🌐 1. Lienzo de Grafo Interactivo con 4 Puntos de Conexión por Nodo
- Desarrollado sobre `@xyflow/react` (React Flow v12) con soporte para arrastrar, soltar, zoom infinito, navegación panorámica (*pan*) y minimapa visual.
- **4 Puntos de Conexión Direccionales por Cuadro**: Cada tarjeta dispone de conectores interactivos en **Arriba (Top)**, **Derecha (Right)**, **Abajo (Bottom)** e **Izquierda (Left)**.
- **Modo de Conexión Bidireccional (`ConnectionMode.Loose`)**: Permite enlazar cualquier lado de un nodo con cualquier lado de otro sin restricciones arbitrarias.
- **Reconexión Interactiva en Vivo (`onReconnect`)**: Arrastra los extremos de cualquier flecha existente directamente en el lienzo para reubicar su punto de entrada o salida.
- Controles de navegación y centrado automático con un clic.

### 🧩 2. Nodos Especializados por Tipo de Recurso
- **Reel / Video / Enlace**: Soporte directo para URLs de Instagram Reels, YouTube, TikTok y sitios web, con apertura directa del recurso en nueva pestaña.
- **Nota de Estudio**: Tarjeta con bloque de texto enriquecido para definiciones, sintaxis o reflexiones.
- **Imagen / Infografía**: Visualización de esquemas técnicos, atajos de teclado o capturas de referencia.

### 🔗 3. Conexiones Semánticas y Selector Manual de Lados
- Conecta nodos arrastrando desde cualquiera de los 4 círculos hacia otro.
- Haz clic en cualquier flecha para abrir el **Editor de Conexión**:
  - Selector manual interactivo de los lados de origen (Arriba/Derecha/Abajo/Izquierda) y destino.
  - Personalización de la etiqueta de relación (ej. *"se relaciona con"*, *"es prerrequisito de"*, *"aplica a"*, *"complemento fonético"*).
  - Eliminación directa de la conexión con un clic.

### 📖 4. Manual de Instrucciones y Guía de Uso Integrado
- Modal exhaustivo con 7 capítulos detallados accesible desde la cabecera (**"Manual de Uso"**) y desde un acceso flotante en el lienzo.
- Guías paso a paso de conexiones, creación de contenido, filosofía de aprendizaje, filtros, exportación, teoría de color 60-30-10 y atajos de teclado.

### 🌳 5. Plegado / Expansión Jerárquica de Ramas
- Botón interactivo en cada nodo padre para **contraer o expandir sus sub-ramas**.
- Permite estudiar un tema en profundidad sin saturar la vista global del mapa.

### 🎯 6. Sistema Dual de "Razón de Aprendizaje"
- **Modo Manual**: Campo dedicado para escribir una síntesis concisa recomendada de entre 140 y 160 caracteres (con contador visual interactivo).
- **Modo Automático**: Algoritmo inteligente que extrae las primeras frases del contenido recortando en la última coma o punto para nunca partir palabras.

### 🖼️ 7. Generador Open Graph para Notion (1200 × 630 px)
- Generación dinámica de tarjeta en formato SVG proporcional **1.91:1** estándar de redes sociales y web unfurl.
- Simulador visual en tiempo real de cómo se visualizará como **Notion Web Bookmark**.
- Copiado de URL en un clic, copiado de bloque Markdown para Notion y descarga directa de la tarjeta como imagen SVG.

### 📄 8. Exportación Documental Completa (Markdown y HTML)
- Descarga de fichas individuales de aprendizaje en formato `.md` o `.html` interactivo.
- Menú global de exportación en la barra superior para descargar toda la bitácora compilada en un único archivo Markdown o HTML estructurado con índice por categorías.

### 🔍 9. Filtros Rápidos, Cronología y Resaltado en Vivo
- **Buscador en tiempo real**: Resalta instantáneamente los nodos que coinciden por título, notas, razón o `#etiquetas`, atenuando con opacidad suave los demás.
- **Filtro por Categoría**: Píldoras con contador de nodos por materia para aislar temas de estudio.
- **Filtro Temporal**: Visualiza recursos creados Hoy, en los Últimos 7 Días, Últimos 30 Días o Este Mes, con alternador de ordenación reciente/antigua.

### 📊 10. Métricas y Estadísticas del Segundo Cerebro
- Cajón lateral (*Drawer*) con métricas en tiempo real:
  - Total de nodos y conexiones activas.
  - Distribución porcentual por categoría.
  - Ratio de densidad de interconexiones (conocimiento conectado vs. aislado).
  - Desglose por tipo de contenido y etiquetas más frecuentes.

### 💾 11. Persistencia Local y Respaldos JSON
- Todo tu mapa, posiciones, conexiones con sus puntos de entrada/salida y categorías se guardan automáticamente en `localStorage`.
- Herramienta de **Exportar Respaldo** en archivo JSON descargable.
- Herramienta de **Importar Respaldo** con validación para restaurar o transferir tu cerebro a cualquier dispositivo.

### 🎨 12. Sistema Visual 60-30-10 y Jerarquía Tipográfica Editorial
- **Regla 60% - 30% - 10% Matemática con `#001621` y `#FF4103`**:
  - **60% Dominante**: Lienzo base y atmósfera abisal (`#001621`) para máxima concentración y descanso visual.
  - **30% Secundario**: Variaciones tonales calculadas (`#022436`, `#0d4364`) para tarjetas, modales, cabecera superior y bordes.
  - **10% Acento**: Naranja fuego (`#FF4103`) reservado para interacción de alto impacto: botón principal `+ Nuevo Nodo`, aristas y halos luminosos.
- **Trío Tipográfico de Alta Legibilidad**:
  - **Vanguard**: Títulos destacados de marca, cabeceras de sección y métricas.
  - **Athelas**: Tipografía serif editorial para reflexiones, títulos de nodos y «¿Por qué lo guardé?».
  - **Arial**: Tipografía base para párrafos, campos de texto y metadatos.
- **Selector y Generador Dinámico**: Modal en barra superior para conmutar paletas o calcular la regla 60-30-10 a partir de cualquier par de colores.

---

## 📚 Áreas de Conocimiento Integradas

El proyecto viene precargado con ejemplos funcionales y categorizados en tus materias clave:

| Materia | Color Identificador | Temas de Ejemplo Incluidos |
| :--- | :---: | :--- |
| **Inglés** | `#3b82f6` (Azul) | Phrasal verbs comunes, fonética de la 'TH', conectores formales para redacción B2/C1. |
| **Photoshop 2022** | `#06b6d4` (Cian) | Máscaras de luminosidad, técnicas de Dodge & Burn, atajos esenciales de teclado. |
| **Programación** | `#10b981` (Esmeralda) | Flexbox vs CSS Grid, ciclo de vida y hooks en React, inmutabilidad del estado. |
| **Gestión Administrativa** | `#f59e0b` (Ámbar) | Matriz de Eisenhower (Urgente vs Importante), diseño de diagramas de flujo de procesos. |
| **Diseño UX/UI** | `#ec4899` (Rosa) | Jerarquía tipográfica y leyes de Gestalt en interfaces. |
| **Productividad Personal** | `#8b5cf6` (Púrpura) | Regla de los dos minutos, bloques de enfoque y revisión espaciada. |

> *Nota: Puedes crear y personalizar tantas categorías nuevas como desees desde el modal de creación de nodos.*

---

## 📂 Estructura del Proyecto

```text
/
├── index.html                  # Punto de entrada HTML y metadatos base
├── metadata.json               # Configuración de la applet y permisos
├── package.json                # Dependencias, scripts y configuración npm
├── tsconfig.json               # Configuración de compilador TypeScript
├── vite.config.ts              # Configuración de empaquetador Vite + Tailwind v4
└── src/
    ├── main.tsx                # Montaje de la aplicación React 19
    ├── App.tsx                 # Controlador principal del lienzo, estado y flujos
    ├── index.css               # Estilos globales y configuración @import "tailwindcss"
    ├── types.ts                # Modelos de datos TypeScript (BrainNode, Category, etc.)
    ├── components/
    │   ├── TopBar.tsx          # Barra superior con búsqueda, filtros y acciones
    │   ├── CustomNode.tsx      # Componente del nodo con 4 conectores y diseño temático
    │   ├── NodeEditorModal.tsx # Modal de creación y edición de nodos y categorías
    │   ├── EdgeEditorModal.tsx # Modal con selector manual de 4 lados (Arriba/Der/Abajo/Izq)
    │   ├── InstructionManualModal.tsx # Manual de uso interactivo con 7 capítulos
    │   ├── NotionPreviewModal.tsx # Generador Open Graph y simulador de Notion
    │   ├── NodeDetailModal.tsx # Ficha técnica con exportador Markdown y HTML
    │   ├── PaletteModal.tsx    # Gestor cromático con regla 60-30-10 y generador
    │   └── StatsDrawer.tsx     # Panel lateral de analíticas de conocimiento
    ├── data/
    │   └── initialData.ts      # Datos preconfigurados y categorías por defecto
    └── utils/
        └── textUtils.ts        # Algoritmos de recorte inteligente y utilidades de texto
```

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador**: [Vite 8](https://vitejs.dev/)
- **Motor de Grafos**: [@xyflow/react (React Flow v12)](https://reactflow.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Animaciones**: [Motion (Framer Motion)](https://motion.dev/)

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
- Gestor de paquetes `npm` (o `bun` / `pnpm`).

### Instalación y Puesta en Marcha

1. **Clonar el repositorio o ingresar a la carpeta del proyecto**:
   ```bash
   cd tu-directorio
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000` (o el puerto configurado).

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

5. **Verificar tipos y reglas de código**:
   ```bash
   npm run lint
   ```

---

## 📖 Guía de Uso Paso a Paso

### 1. Creación y Edición de Nodos
- Presiona el botón verde **"+ Nuevo Recurso"** en la barra superior.
- Selecciona el **Tipo de Recurso**:
  - 🎬 *Reel / Video / Enlace*
  - 📝 *Nota de Estudio*
  - 🖼️ *Imagen / Infografía*
- Asigna un **Título** claro y la **Materia / Categoría** correspondiente.
- Pega la URL del recurso o imagen.
- Selecciona tu modo de **Razón de Aprendizaje**:
  - *Automático*: La aplicación sintetiza las primeras oraciones.
  - *Manual*: Redacta tu motivo personal de consulta futura.
- Añade `#etiquetas` separadas por comas.
- Haz clic en **"Crear Recurso"**.

### 2. Conexión con 4 Puntos Manuales y Reconexión en Vivo
- Cada tarjeta dispone de **4 puntos interactivos circulares** ubicados en:
  - ⬆️ **Arriba** (`top`)
  - ➡️ **Derecha** (`right`)
  - ⬇️ **Abajo** (`bottom`)
  - ⬅️ **Izquierda** (`left`)
- **Crear Conexión**: Mantén presionado sobre cualquiera de los 4 puntos y arrastra hacia cualquier punto de otra tarjeta. Gracias al modo libre (`ConnectionMode.Loose`), puedes conectar cualquier lado con cualquier otro (ej. de Abajo a Arriba, de Derecha a Izquierda, o en diagonal).
- **Reconexión Interactiva en el Lienzo**: Haz clic sostenido en la punta o inicio de cualquier flecha existente y arrástrala a otro conector para cambiar su extremo sobre la marcha sin borrarla.

### 3. Edición Manual de Puntos de Entrada y Salida
- Haz clic sobre cualquier línea de conexión para abrir el **Editor de Relación**.
- **Selector Manual de Lados**: Puedes cambiar explícitamente el conector de salida del nodo origen y el conector de entrada del nodo destino eligiendo entre *Arriba*, *Derecha*, *Abajo* e *Izquierda*.
- **Etiqueta Semántica**: Escribe el significado de la relación o selecciona un atajo rápido (*"se relaciona con"*, *"es prerrequisito de"*, *"aplica a"*, *"ejemplo de"*, *"complementa a"*).
- **Eliminar Conexión**: Botón rojo para desvincular los dos conceptos al instante.

### 4. Manual de Instrucciones Integrado
- En cualquier momento puedes pulsar el botón **"Manual de Uso"** en la barra superior o en la insignia flotante inferior para abrir la guía interactiva.
- Incluye 7 módulos completos con explicaciones paso a paso de cada funcionalidad y buenas prácticas de estudio.

### 5. Colapso y Expansión de Ramas de Estudio
- Cuando un nodo tiene conexiones hijas salientes, mostrará un botón circular con el icono de carpeta o flecha y el número de hijos dependientes.
- Haz clic en ese botón para ocultar temporalmente esa rama y despejar tu espacio de trabajo. Vuelve a hacer clic para desplegarla.

### 6. Búsqueda, Filtro por Materia y Filtro Temporal
- **Buscador en Tiempo Real**: Escribe cualquier término para atenuar los nodos no relacionados e iluminar los coincidentes.
- **Filtro por Categoría**: Botones de materia (**Inglés**, **Photoshop**, **Programación**, etc.) para enfocar tu sesión en una sola disciplina.
- **Filtro Temporal**: Desplegable para revisar lo aprendido *Hoy*, en los *Últimos 7 días*, *Últimos 30 días* o *Este Mes*, con opción de ordenar del más reciente al más antiguo.

### 7. Exportación y Previsualización para Notion (Open Graph)
- Pasa el cursor por cualquier nodo y pulsa el icono de **Notion (Compartir)**.
- Se abrirá el modal con:
  1. **Simulador de Bookmark**: Muestra el encabezado, la categoría coloreada y la razón de guardado.
  2. **Tarjeta Open Graph (1200 × 630 px)**: Renderizada en alta resolución con formato 1.91:1.
- Opciones de exportación:
  - **Copiar Enlace**: Para pegarlo directamente en Notion y crear un bloque de marcador.
  - **Copiar Markdown**: Para insertarlo en notas de texto enriquecido.
  - **Descargar Tarjeta SVG**: Para guardarla como imagen y subirla como portada o recurso visual en Notion.

### 8. Exportación Documental (.md / .html)
- **Ficha Individual**: Haz doble clic en cualquier nodo (o pulsa el botón del ojo) para ver su ficha completa y descargar su documento en **Markdown (.md)** o **HTML interactivo (.html)**.
- **Dossier Completo**: En la barra superior, abre el menú **"Descargar"** para generar un informe consolidado de todos los recursos (o de la categoría filtrada) en un solo archivo `.md` o `.html` ordenado temáticamente.

### 9. Auto-Organización (Auto-Layout)
- Si tu mapa se desordena tras agregar muchos conceptos, haz clic en el botón de cuadrícula **"Auto-Organizar"** en la barra superior.
- La aplicación acomodará automáticamente los nodos en columnas organizadas por materia con espaciado uniforme respetando los filtros de fecha activos.

### 10. Copia de Seguridad y Restauración (JSON)
- **Exportar**: Haz clic en el botón de descarga en la barra superior para guardar un archivo `.json` con todos tus nodos, conexiones, puntos de acople y categorías.
- **Importar**: Haz clic en el botón de carga para restaurar un respaldo previo en cualquier navegador.

---

## 🧠 El Método: Por qué funciona la "Razón de Aprendizaje"

La regla de oro de este Segundo Cerebro es **nunca guardar por acumular**. Cada vez que guardas un reel de Instagram o un tutorial de YouTube, pregúntate:

$$\text{Valor del Recurso} = \text{Concepto Central} + \text{Caso de Aplicación Inmediata}$$

*Ejemplo clásico ineficaz:*
> "Guardar reel de Photoshop sobre máscaras." (Se olvida en 48 horas).

*Ejemplo con Mi Segundo Cerebro:*
> **Título**: Máscaras de Luminosidad en Photoshop 2022  
> **Razón de Guardado**: "Usar Ctrl+Alt+2 para seleccionar altas luces y bajar la exposición del fondo en mis fotografías de producto sin oscurecer al sujeto."

Al obligarte a sintetizar la razón en menos de 160 caracteres, tu cerebro realiza la fijación inicial del conocimiento antes de delegar la memoria al mapa visual.

---

## 📜 Scripts Disponibles

En el directorio raíz del proyecto puedes ejecutar:

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:3000` con recarga rápida. |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente la compilación de producción. |
| `npm run lint` | Ejecuta la verificación estática de tipos TypeScript con `tsc --noEmit`. |

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Siéntete libre de adaptarlo, modificarlo y expandirlo como tu centro neurálgico de aprendizaje y estudio personal.
