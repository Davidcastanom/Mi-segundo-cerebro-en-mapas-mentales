# 📖 Manual de Usuario y Guía Práctica

Esta guía explica en detalle cada una de las funcionalidades de **Mi Segundo Cerebro**.

---

## 🚀 1. Flujo de Captura Ultrarrápida (Zero-Friction)

### Pegado Directo con `Ctrl + V`
- Cuando estés navegando y encuentres un Reel educativo de Instagram, video de YouTube, artículo o nota:
  1. Copia el enlace o texto en tu navegador (`Ctrl + C`).
  2. Abre la pestaña de tu Segundo Cerebro.
  3. Presiona **`Ctrl + V`** directamente sobre el lienzo (sin hacer clic en ningún campo).
  4. El sistema detecta automáticamente la plataforma (Instagram, YouTube o web), crea una tarjeta en el lienzo, genera un extracto cognitivo y te muestra un aviso de confirmación.

### Command Palette (`Ctrl + K`)
- Presiona **`Ctrl + K`** o haz clic en el botón **Comandos (Ctrl+K)** para:
  - Buscar cualquier recurso por título, etiqueta, categoría o razón de aprendizaje en milisegundos.
  - Navegar con las flechas `↑` y `↓` y presionar `Enter` para saltar y centrar la cámara del lienzo directamente en ese nodo.
  - Ejecutar acciones rápidas: crear nuevo recurso, abrir repaso activo, sincronizar en Google Drive o auto-organizar las columnas.

---

## 🎯 2. Semáforo Cognitivo y Checklists de Práctica

Cada nodo en tu cerebro visual cuenta con un ciclo de dominio:
1. **❓ Por Aprender (Rojo)**: Recurso recién guardado que aún no has estudiado o puesto a prueba.
2. **⚡ En Práctica (Ámbar)**: En proceso de asimilación, ejercicios o aplicación práctica.
3. **🏆 Dominado (Verde)**: Conocimiento consolidado y retenido.

### Cómo cambiar el estado:
- Haz clic directamente sobre la insignia de estado en la cabecera de la tarjeta en el lienzo para ciclar su estado (`Por Aprender → En Práctica → Dominado`).
- O edita el nodo para marcarlo con el selector detallado.

### Checklists Accionables
- Al crear o editar un nodo, puedes añadir **puntos de control o pasos prácticos** (ej: *"Instalar librería"*, *"Hacer ejercicio de pronunciación"*, *"Probar en proyecto real"*).
- En el lienzo puedes marcar cada casilla directamente con un clic, viendo el contador de progreso en tiempo real (ej: `2/3`).

---

## 🧠 3. Modo Repaso Activo (Flashcards de Estudio)

Para evitar la curva del olvido, haz clic en **Repaso Activo** en la barra superior:
- Se abrirá un visor interactivo estilo tarjeta mnemotécnica (*flashcard*).
- **Frente**: Muestra la pregunta reflexiva central: *"¿Por qué guardaste este recurso?"* y su categoría.
- **Vuelta (Voltear tarjeta)**: Revela la nota de estudio, enlace multimedia, checklists y razones detalladas.
- **Calificación Inmediata**: Califica tu retención con un solo clic:
  - *"Necesito Repasar"* (lo devuelve a estado **Por Aprender**).
  - *"En Progreso"* (lo mantiene en **En Práctica**).
  - *"¡Lo Domino!"* (lo asciende a **Dominado**).
- Puedes filtrar por materia específica para sesiones de estudio enfocadas.

---

## ☁️ 4. Sincronización en la Nube con Google Drive

Tu conocimiento está seguro ante cierres de navegador o cambio de dispositivo:
1. Haz clic en el botón **Google Drive** en la barra superior.
2. Pulsa **Iniciar Sesión con Google** para autorizar el acceso seguro mediante tu cuenta.
3. **Guardar en Google Drive**:
   - Presiona *"Subir Copia a Google Drive"*.
   - El sistema guardará un archivo `segundo_cerebro_backup.json` en tu carpeta raíz de Google Drive con todas tus materias, nodos, posiciones y flechas semánticas.
4. **Restaurar desde Google Drive**:
   - Puedes ver la fecha y tamaño del último respaldo guardado en tu Drive.
   - Pulsa *"Restaurar este Respaldo"* para cargar tus notas en cualquier dispositivo.
5. **Cerrar Sesión**:
   - El token OAuth se mantiene en memoria segura y se revoca limpiamente al pulsar *"Cerrar Sesión"*.

---

## 🔗 5. Conexiones Semánticas con 4 Puntos de Contacto

- Cada tarjeta dispone de 4 puntos magnéticos: **Arriba, Derecha, Abajo e Izquierda**.
- **Conexión**: Arrastra desde un círculo hacia cualquier círculo de otro nodo.
- **Reconexión Interactiva**: Arrastra la punta o la cola de una flecha existente en el lienzo para reubicar su punto de anclaje.
- **Edición**: Haz clic en el texto de una flecha para cambiar su etiqueta de relación semántica o cambiar los lados de origen y destino desde el editor modal.

---

## 🎨 6. Paleta 60-30-10 y Exportación

- **Paleta 60-30-10**: Haz clic en el selector de colores para cambiar el tema visual respetando la proporción armónica (60% fondo base, 30% superficies secundarias, 10% acento vibrante).
- **Dossiers**: En el menú **Descargar**, genera un dossier consolidado en formato Markdown (.md) o HTML interactivo (.html) para imprimir o adjuntar como informe académico.
