# 🧠 Repaso Activo y Repetición Espaciada

Este documento explica los fundamentos pedagógicos y el funcionamiento del módulo de **Repaso Activo** en Mi Segundo Cerebro.

---

## 1. El Problema: La Curva del Olvido de Ebbinghaus

Cuando un estudiante guarda un tip valioso de programación, un atajo de Photoshop o una estructura gramatical en inglés:
- A las 24 horas ha olvidado más del 60% del contenido si no hubo evocación activa.
- A los 7 días sólo retiene una fracción insignificante.

---

## 2. Metodología Implementada: Evocación Activa (*Active Recall*)

En lugar de releer pasivamente notas extensas, el módulo de **Repaso Activo**:
1. Presenta al estudiante el estímulo inicial: el título del recurso y la pregunta clave:
   > *"¿Por qué guardaste este recurso? Intenta recordarlo antes de voltear la tarjeta."*
2. El estudiante hace el esfuerzo mental de reconstruir la utilidad del concepto.
3. Voltea la tarjeta digital con un clic para cotejar su memoria contra la razón y notas reales.
4. Valora su nivel de dominio en tres niveles que alteran el semáforo cognitivo:
   - **Por Aprender (Rojo)**: Requiere reestudio y volverá a aparecer en las primeras posiciones del mazo.
   - **En Práctica (Ámbar)**: En asimilación activa.
   - **Dominado (Verde)**: Consolidado en la memoria de largo plazo.

---

## 3. Integración con el Lienzo de Conocimiento

- Al cambiar de estado dentro del modal de repaso, el lienzo visual de React Flow actualiza la tarjeta correspondiente en tiempo real con su borde, fondo y medalla de dominio.
- El estudiante puede presionar el botón **"Centrar en el Lienzo"** para que la cámara del grafo vuele automáticamente hacia el nodo examinado y muestre sus ramificaciones circundantes.
