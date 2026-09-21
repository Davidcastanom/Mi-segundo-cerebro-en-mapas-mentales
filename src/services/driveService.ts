import { BrainNodeData, BrainEdgeData, Category } from '../types';

export interface DriveCanvasNodeItem {
  id: string;
  position: { x: number; y: number };
  data: BrainNodeData;
}

export interface DriveBackupPayload {
  version: string;
  timestamp: string;
  app: string;
  nodes: (DriveCanvasNodeItem | BrainNodeData)[];
  edges: BrainEdgeData[];
  categories: Category[];
}

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
}

const BACKUP_FILE_NAME = 'segundo_cerebro_backup.json';

/**
 * Busca si ya existe un archivo de respaldo de Segundo Cerebro en Google Drive
 */
export async function findDriveBackupFile(accessToken: string): Promise<DriveFileInfo | null> {
  const query = encodeURIComponent(`name = '${BACKUP_FILE_NAME}' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)&spaces=drive`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al buscar en Google Drive: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0];
  }
  return null;
}

/**
 * Guarda o actualiza el respaldo del Segundo Cerebro en Google Drive
 */
export async function saveToGoogleDrive(
  accessToken: string,
  payload: DriveBackupPayload,
  existingFileId?: string
): Promise<DriveFileInfo> {
  const content = JSON.stringify(payload, null, 2);
  const blob = new Blob([content], { type: 'application/json' });

  if (existingFileId) {
    // Actualizar archivo existente (PATCH)
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: blob,
    });

    if (!updateRes.ok) {
      throw new Error(`Error al actualizar respaldo en Google Drive: ${updateRes.statusText}`);
    }

    const updatedData = await updateRes.json();
    return {
      id: existingFileId,
      name: BACKUP_FILE_NAME,
      modifiedTime: new Date().toISOString(),
      size: String(blob.size),
    };
  }

  // Crear archivo nuevo usando upload multipart
  const metadata = {
    name: BACKUP_FILE_NAME,
    mimeType: 'application/json',
    description: 'Copia de seguridad del mapa mental Mi Segundo Cerebro',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', blob);

  const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime,size';
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!createRes.ok) {
    const errorMsg = await createRes.text();
    throw new Error(`Error al crear archivo en Google Drive: ${createRes.status} ${errorMsg}`);
  }

  const createdData = await createRes.json();
  return createdData;
}

/**
 * Descarga y lee el contenido del respaldo desde Google Drive
 */
export async function loadFromGoogleDrive(
  accessToken: string,
  fileId: string
): Promise<DriveBackupPayload> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al descargar respaldo de Google Drive: ${response.statusText}`);
  }

  const data = await response.json();
  return data as DriveBackupPayload;
}
