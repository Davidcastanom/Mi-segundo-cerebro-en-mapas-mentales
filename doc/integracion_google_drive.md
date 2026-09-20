# ☁️ Integración con Google Drive API v3

Este documento detalla la arquitectura de autenticación y sincronización en la nube con Google Drive implementada en la aplicación.

---

## 1. Objetivos del Sistema Cloud

- Proporcionar persistencia duradera en la nube propiedad del usuario.
- Eliminar el riesgo de pérdida de datos por borrado de caché local o cambio de equipo.
- Respetar la privacidad y seguridad: el usuario guarda sus archivos en su propia unidad de Google Drive.

---

## 2. Alcance OAuth y Principio de Privilegio Mínimo

- **Alcance solicitado**: `https://www.googleapis.com/auth/drive.file`
- **¿Qué permite este alcance?**:
  - Permite a la aplicación crear, leer y actualizar **únicamente** los archivos que han sido creados por la misma aplicación en Google Drive.
  - **No** tiene acceso a otros documentos personales, fotos, hojas de cálculo o carpetas ajenas del usuario.

---

## 3. Flujo de Autenticación con Firebase Auth & Google Identity

1. **Cliente Web SPA**:
   - Inicializa el SDK de Firebase mediante `src/services/authService.ts`.
   - Se emplea `GoogleAuthProvider` con el alcance `drive.file`.
2. **Ventana Emergente (Popup)**:
   - Al pulsar *"Iniciar Sesión con Google"*, se invoca `signInWithPopup(auth, provider)`.
   - Se extrae el `accessToken` OAuth de corta duración retornado en la credencial.
3. **Caché en Memoria**:
   - Por normativas de seguridad, el token de acceso OAuth se almacena estrictamente **en memoria volátil** (`cachedAccessToken`), nunca en `localStorage`.
   - Si el usuario recarga la página o cierra sesión, el token se destruye limpiamente.

---

## 4. Endpoints de Google Drive API v3 Consumidos

### Búsqueda de Respaldo Existente
```http
GET https://www.googleapis.com/drive/v3/files?q=name='segundo_cerebro_backup.json' and trashed=false&fields=files(id,name,modifiedTime,size)&spaces=drive
Authorization: Bearer <ACCESS_TOKEN>
```

### Creación de Nuevo Respaldo (Multipart Upload)
```http
POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/related; boundary=...
```

### Actualización de Respaldo Existente (Resumable/Media Update)
```http
PATCH https://www.googleapis.com/upload/drive/v3/files/<FILE_ID>?uploadType=media
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### Descarga de Respaldo
```http
GET https://www.googleapis.com/drive/v3/files/<FILE_ID>?alt=media
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 5. Estructura del Respaldo JSON

```json
{
  "version": "1.2.0",
  "timestamp": "2026-09-20T04:45:00.000Z",
  "app": "Mi Segundo Cerebro",
  "categories": [ ... ],
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

Al restaurar, el sistema valida la estructura y posicionamiento, actualizando el lienzo y ajustando la vista centrada (`fitView`).
