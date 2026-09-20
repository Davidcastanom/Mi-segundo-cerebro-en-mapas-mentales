# 🏗️ Arquitectura del Sistema y Análisis de Viabilidad

Documento técnico que describe la arquitectura integral de **Mi Segundo Cerebro — Bitácora Visual de Aprendizaje** y su análisis de viabilidad para usuarios activos.

---

## 1. Diagnóstico y Viabilidad

Para que una aplicación de "Segundo Cerebro" sea verdaderamente útil en la vida diaria de una persona (estudiante o profesional), debe superar 4 barreras críticas de adopción:
1. **Fricción de Captura**: Si guardar un contenido toma más de 5 segundos, el usuario dejará de usar la herramienta y volverá a guardar en bookmarks de navegador o WhatsApp.
   - *Solución implementada*: Captura instantánea por portapapeles global con `Ctrl + V` y Command Palette global con `Ctrl + K`.
2. **Cementerio de Información**: Guardar sin repasar es inútil.
   - *Solución implementada*: Semáforo cognitivo (Por Aprender, En Práctica, Dominado), checklists accionables integradas y módulo de Flashcards de Repaso Activo.
3. **Persistencia y Confianza**: La dependencia exclusiva de `localStorage` genera miedo a perder semanas de notas.
   - *Solución implementada*: Sincronización oficial con Google Drive API v3 privada (`drive.file`) y exportación documental completa en Markdown y HTML.
4. **Claridad Visual**: Grafo flexible y navegable.
   - *Solución implementada*: 4 puntos de anclaje por nodo con reconexión interactiva en vivo, auto-organización por columnas temáticas y paleta cromática 60-30-10.

---

## 2. Diagrama de Arquitectura de Capas

```
┌────────────────────────────────────────────────────────┐
│                   Capa de Presentación                 │
│  - React Flow Canvas (Grafos interactivos bidireccionales)│
│  - Command Palette (Búsqueda global y acciones rápidas)│
│  - Modal de Repaso Activo (Flashcards y auto-evaluación) │
│  - TopBar (Filtrado multidimensional por materia/estado)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Capa de Lógica & Estado             │
│  - Estado de nodos & aristas ReactFlow                  │
│  - Semáforo de dominio (por_aprender, en_practica, dominado)│
│  - Sistema de checklists paso a paso                    │
│  - Algoritmos de auto-layout columnar y ordenamiento   │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   Persistencia Local      │ │    Capa Cloud (Google)   │
│ - LocalStorage Serialized │ │ - Firebase Auth Popup    │
│ - Auto-recovery en arranque│ │ - Google Drive API v3    │
│ - Copias .JSON descargables│ │ - Formato Multipart JSON │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 3. Pila Tecnológica

- **Framework**: React 19 + TypeScript + Vite.
- **Visualización de Grafos**: `@xyflow/react` (React Flow v12).
- **Iconografía**: `lucide-react`.
- **Animaciones**: `motion/react`.
- **Autenticación**: Firebase Auth v11 (`GoogleAuthProvider` client-side).
- **Almacenamiento Cloud**: Google Drive REST API v3 (`drive.file` scope).
- **Estilos**: Tailwind CSS 4 con variables CSS dinámicas para paletas 60-30-10.
