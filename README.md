# 🧠 Mi Segundo Cerebro — Bitácora Visual de Aprendizaje

> **Lienzo interactivo de mapas conceptuales y organizador de conocimiento diseñado para recopilar, conectar y fijar aprendizajes provenientes de reels, videos, notas e imágenes, con sincronización en la nube con Google Drive, modo de estudio con Flashcards, captura rápida con Ctrl+V y generación de tarjetas Open Graph para Notion.**

---

## 📋 Tabla de Contenido
1. [Visión General y Filosofía](#-visión-general-y-filosofía)
2. [Novedades y Nuevas Funcionalidades](#-novedades-clave)
3. [Características Principales](#-características-principales)
4. [Áreas de Conocimiento Integradas](#-áreas-de-conocimiento-integradas)
5. [Estructura del Proyecto y Documentación](#-estructura-del-proyecto-y-documentación)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
7. [Guía de Inicio Rápido (Instalación y Uso Local)](#-guía-de-inicio-rápido)
8. [Guía de Uso Paso a Paso](#-guía-de-uso-paso-a-paso)
   - [Captura Instantánea por Portapapeles (Ctrl+V)](#1-captura-instantánea-por-portapapeles-ctrlv)
   - [Paleta de Comandos Universal (Ctrl+K)](#2-paleta-de-comandos-universal-ctrlk)
   - [Semáforo Cognitivo y Checklists de Práctica](#3-semáforo-cognitivo-y-checklists-de-práctica)
   - [Modo de Repaso Activo (Flashcards de Estudio)](#4-modo-de-repaso-activo-flashcards-de-estudio)
   - [Sincronización en la Nube con Google Drive](#5-sincronización-en-la-nube-con-google-drive)
   - [Conexión con 4 Puntos Manuales y Reconexión en Vivo](#6-conexión-con-4-puntos-manuales-y-reconexión-en-vivo)
   - [Exportación y Previsualización para Notion (Open Graph)](#7-exportación-y-previsualización-para-notion-open-graph)
   - [Exportación Documental (.md / .html)](#8-exportación-documental-md--html)
9. [Carpeta de Documentación `/doc`](#-carpeta-de-documentación-doc)
10. [Licencia](#-licencia)

---

## 💡 Visión General y Filosofía

A diario consumimos decenas de contenidos educativos en redes y plataformas (Instagram Reels, tutoriales de YouTube, hilos, artículos técnicos e infografías). Sin embargo, la mayor parte de esa información se pierde o queda acumulada en listas de "Guardados" que nunca volvemos a consultar.

**Mi Segundo Cerebro** resuelve este problema mediante cuatro pilares:
1. **Captura Sin Fricción**: Guarda recursos de inmediato pegando enlaces o texto directamente en el lienzo con `Ctrl + V`.
2. **Comprensión Activa y Semáforo Cognitivo**: Define una **Razón de Aprendizaje** y monitorea tu progreso (*Por Aprender → En Práctica → Dominado*).
3. **Pensamiento en Red con Conexiones en 4 Direcciones**: Conecta conceptos con flechas semánticas arrastrables y reconectables en vivo.
4. **Retención Espaciada y Nube**: Practica con tarjetas Flashcards integradas y respalda todo tu conocimiento directamente en tu propia cuenta de **Google Drive**.

---

## ⚡ Novedades Clave

- ☁️ **Sincronización con Google Drive API v3**: Respaldo y restauración directa en la nube de Google Drive mediante autenticación OAuth 2.0 segura con Firebase Auth (`drive.file`).
- 🎓 **Repaso Activo & Tarjetas de Estudio (Flashcards)**: Módulo interactivo con giro de tarjeta para auto-evaluar la retención y actualizar el nivel de dominio.
- ⚡ **Captura Rápida (`Ctrl + V`)**: Pega cualquier enlace de Instagram Reel, YouTube o nota en el lienzo sin abrir formularios.
- ⌨️ **Command Palette (`Ctrl + K`)**: Buscador instantáneo y ejecutor de acciones rápidas con teclado.
- 🚦 **Semáforo Cognitivo**: Filtros e indicadores visuales de dominio (*Por Aprender*, *En Práctica*, *Dominado*) en cada tarjeta.
- ✅ **Checklists Accionables**: Lista de verificación interactiva dentro de cada nodo para registrar pasos de práctica.

---

## 🧩 Características Principales

### 🌐 1. Lienzo de Grafo Interactivo con 4 Puntos de Conexión por Nodo
- Desarrollado sobre `@xyflow/react` (React Flow v12) con soporte para arrastrar, soltar, zoom infinito, navegación panorámica (*pan*) y minimapa visual.
- **4 Puntos de Conexión Direccionales por Cuadro**: Cada tarjeta dispone de conectores interactivos en **Arriba (Top)**, **Derecha (Right)**, **Abajo (Bottom)** e **Izquierda (Left)**.
- **Reconexión Interactiva en Vivo**: Arrastra los extremos de cualquier flecha existente directamente en el lienzo para reubicar su punto de anclaje.

### 🔗 2. Conexiones Semánticas
- Haz clic en cualquier flecha para abrir el **Editor de Conexión**: personaliza etiquetas como *"se relaciona con"*, *"es prerrequisito de"*, *"aplica a"* o reasigna los lados de origen y destino.

### 🖼️ 3. Generador Open Graph para Notion (1200 × 630 px)
- Generación dinámica de tarjeta en formato SVG proporcional **1.91:1** estándar de redes sociales y web unfurl.
- Simulador visual en tiempo real de cómo se visualizará como **Notion Web Bookmark**.

### 📄 4. Exportación Documental Completa (Markdown y HTML)
- Descarga de fichas individuales y dossiers completos con índice general de materias en formato `.md` o `.html` listo para imprimir.

### 🎨 5. Teoría de Color Armónica 60-30-10
- Paleta estructurada en 60% color dominante de lienzo, 30% superficies funcionales y 10% acento vibrante, con modal de personalización en vivo.

---

## 📁 Carpeta de Documentación `/doc`

Para consultar detalles específicos de implementación y uso, visita la carpeta `/doc`:
- [**`/doc/manual_usuario.md`**](./doc/manual_usuario.md): Guía paso a paso para estudiantes y usuarios finales.
- [**`/doc/arquitectura_y_viabilidad.md`**](./doc/arquitectura_y_viabilidad.md): Análisis de viabilidad, arquitectura en capas y decisiones técnicas.
- [**`/doc/integracion_google_drive.md`**](./doc/integracion_google_drive.md): Especificación técnica del protocolo Google Drive API v3 y OAuth.
- [**`/doc/repaso_activo_y_flashcards.md`**](./doc/repaso_activo_y_flashcards.md): Metodología de evocación activa y repetición espaciada.

---

## 🚀 Guía de Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en puerto 3000
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 📄 Licencia

Proyecto de código abierto desarrollado para el aprendizaje activo y la organización del conocimiento.
