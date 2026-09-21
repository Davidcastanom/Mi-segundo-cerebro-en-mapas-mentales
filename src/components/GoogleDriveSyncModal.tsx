import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  UploadCloud, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  LogOut, 
  LogIn,
  HardDrive,
  Clock,
  ShieldCheck,
  Tag,
  CheckSquare
} from 'lucide-react';
import { User } from 'firebase/auth';
import { BrainNodeData, BrainEdgeData, Category } from '../types';
import { CanvasNodeItem } from '../data/initialData';
import { 
  googleSignIn, 
  googleSignOut, 
  getAccessToken 
} from '../services/authService';
import { 
  findDriveBackupFile, 
  saveToGoogleDrive, 
  loadFromGoogleDrive, 
  DriveFileInfo, 
  DriveBackupPayload 
} from '../services/driveService';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: BrainNodeData[];
  canvasNodes?: CanvasNodeItem[];
  edges: BrainEdgeData[];
  categories: Category[];
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
  onRestoreBackup: (payload: DriveBackupPayload) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  nodes,
  canvasNodes,
  edges,
  categories,
  currentUser,
  onAuthChange,
  onRestoreBackup,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [driveFile, setDriveFile] = useState<DriveFileInfo | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Cálculo de estadísticas de etiquetas y checklists listos para persistir
  const totalTags = React.useMemo(() => {
    const set = new Set<string>();
    nodes.forEach((n) => {
      (n.etiquetas || []).forEach((t) => set.add(t));
    });
    return set.size;
  }, [nodes]);

  const totalChecklistItems = React.useMemo(() => {
    return nodes.reduce((acc, n) => acc + (n.checklist?.length || 0), 0);
  }, [nodes]);

  const nodesWithChecklist = React.useMemo(() => {
    return nodes.filter((n) => (n.checklist?.length || 0) > 0).length;
  }, [nodes]);

  // Al abrir y tener usuario autenticado, buscar respaldo en Drive
  useEffect(() => {
    if (isOpen && currentUser) {
      checkExistingBackup();
    } else {
      setDriveFile(null);
      setStatusMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const checkExistingBackup = async () => {
    try {
      setIsSearching(true);
      const token = await getAccessToken();
      if (!token) {
        setStatusMessage({
          type: 'info',
          text: 'Inicia sesión con tu cuenta de Google para verificar tus respaldos en Google Drive.',
        });
        return;
      }
      const file = await findDriveBackupFile(token);
      setDriveFile(file);
      if (file) {
        setStatusMessage({
          type: 'success',
          text: `Se encontró un respaldo existente en tu Google Drive creado o modificado el ${new Date(file.modifiedTime).toLocaleString()}.`,
        });
      } else {
        setStatusMessage({
          type: 'info',
          text: 'No se encontró ningún respaldo previo. Puedes crear tu primera copia en la nube ahora.',
        });
      }
    } catch (err: any) {
      console.error('Error buscando archivo en Drive:', err);
      setStatusMessage({
        type: 'error',
        text: `Error al consultar Google Drive: ${err.message}`,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setStatusMessage(null);
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user);
        setStatusMessage({
          type: 'success',
          text: `¡Bienvenido, ${res.user.displayName || res.user.email}! Verificando Drive...`,
        });
        // Comprobar archivo en Drive
        const file = await findDriveBackupFile(res.accessToken);
        setDriveFile(file);
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión con Google:', err);
      setStatusMessage({
        type: 'error',
        text: `Error de autenticación: ${err.message}`,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleSignOut();
      onAuthChange(null);
      setDriveFile(null);
      setStatusMessage({
        type: 'info',
        text: 'Sesión cerrada correctamente.',
      });
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleSaveToDrive = async () => {
    try {
      setIsSaving(true);
      setStatusMessage(null);
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Token no disponible. Por favor vuelve a iniciar sesión con Google.');
      }

      // Aseguramos serialización completa de posiciones, etiquetas y checklists
      const payloadNodes = (canvasNodes && canvasNodes.length > 0)
        ? canvasNodes.map((n) => ({
            id: n.id,
            position: n.position,
            data: {
              ...n.data,
              etiquetas: Array.isArray(n.data.etiquetas) ? [...n.data.etiquetas] : [],
              checklist: Array.isArray(n.data.checklist)
                ? n.data.checklist.map((item) => ({
                    id: item.id || `chk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    texto: item.texto || '',
                    completado: Boolean(item.completado),
                  }))
                : [],
              estado: n.data.estado || 'por_aprender',
            },
          }))
        : nodes.map((n, idx) => ({
            id: n.id,
            position: { x: 200 + (idx % 4) * 360, y: 120 + Math.floor(idx / 4) * 340 },
            data: {
              ...n,
              etiquetas: Array.isArray(n.etiquetas) ? [...n.etiquetas] : [],
              checklist: Array.isArray(n.checklist)
                ? n.checklist.map((item) => ({
                    id: item.id || `chk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    texto: item.texto || '',
                    completado: Boolean(item.completado),
                  }))
                : [],
              estado: n.estado || 'por_aprender',
            },
          }));

      const payload: DriveBackupPayload = {
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        app: 'Mi Segundo Cerebro',
        nodes: payloadNodes,
        edges,
        categories,
      };

      const result = await saveToGoogleDrive(token, payload, driveFile?.id);
      setDriveFile(result);
      setStatusMessage({
        type: 'success',
        text: `¡Copia de seguridad guardada con éxito en Google Drive! Sincronizados ${nodes.length} recursos con sus posiciones, ${totalTags} etiquetas y ${totalChecklistItems} pasos accionables.`,
      });
    } catch (err: any) {
      console.error('Error al guardar en Drive:', err);
      setStatusMessage({
        type: 'error',
        text: `No se pudo guardar en Google Drive: ${err.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreFromDrive = async () => {
    if (!driveFile) return;
    const confirmRestore = window.confirm(
      '¿Deseas restaurar tu mapa mental desde Google Drive? Esto actualizará tus nodos y conexiones actuales con los datos guardados en la nube.'
    );
    if (!confirmRestore) return;

    try {
      setIsLoadingFile(true);
      setStatusMessage(null);
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Token no disponible.');
      }

      const payload = await loadFromGoogleDrive(token, driveFile.id);
      if (payload && Array.isArray(payload.nodes) && Array.isArray(payload.categories)) {
        onRestoreBackup(payload);
        setStatusMessage({
          type: 'success',
          text: `¡Restauración exitosa! Se cargaron ${payload.nodes.length} recursos y ${payload.edges?.length || 0} conexiones desde Google Drive.`,
        });
      } else {
        throw new Error('El archivo descargado no tiene el formato esperado del Segundo Cerebro.');
      }
    } catch (err: any) {
      console.error('Error al restaurar desde Drive:', err);
      setStatusMessage({
        type: 'error',
        text: `Error al restaurar desde Drive: ${err.message}`,
      });
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] rounded-2xl border shadow-2xl overflow-y-auto font-arial flex flex-col"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-vanguard tracking-wide flex items-center gap-2">
                Sincronización con Google Drive
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Respalda y restaura tu cerebro digital directamente en tu cuenta de Google
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* User connection status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Usuario'}
                  className="w-10 h-10 rounded-full border border-sky-500/40 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                  {currentUser?.email ? currentUser.email[0].toUpperCase() : <HardDrive className="w-5 h-5" />}
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  {currentUser ? currentUser.displayName || currentUser.email : 'No conectado'}
                  {currentUser && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.2 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Conectado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {currentUser
                    ? 'Tu cuenta tiene acceso seguro a crear y actualizar su copia en Drive'
                    : 'Inicia sesión para sincronizar automáticamente entre tus dispositivos'}
                </p>
              </div>
            </div>

            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Conectar con Google</span>
              </button>
            )}
          </div>

          {/* Status feedback message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                  : 'bg-sky-950/40 border-sky-800/80 text-sky-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <Cloud className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Cloud Actions Panel */}
          {currentUser ? (
            <div className="space-y-4">
              {/* Tarjeta Informativa: Contenido preparado para almacenar en la nube */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Contenido verificado y listo para almacenar en la nube:
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                    ✓ 100% Preparado
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Módulos</span>
                    <span className="font-bold text-slate-100 text-sm">{nodes.length}</span>
                    <span className="text-[10px] text-slate-400 block">con posiciones</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-sky-400" /> Etiquetas
                    </span>
                    <span className="font-bold text-sky-400 text-sm">{totalTags}</span>
                    <span className="text-[10px] text-slate-400 block">tags activas</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
                      <CheckSquare className="w-2.5 h-2.5 text-emerald-400" /> Pasos / Checklist
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">{totalChecklistItems}</span>
                    <span className="text-[10px] text-slate-400 block">({nodesWithChecklist} módulos)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Conexiones</span>
                    <span className="font-bold text-indigo-400 text-sm">{edges.length}</span>
                    <span className="text-[10px] text-slate-400 block">{categories.length} materias</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload / Save */}
                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isSaving}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-sky-600/40 bg-sky-950/30 hover:bg-sky-900/40 text-sky-200 transition-all text-center space-y-2 group disabled:opacity-50"
                >
                  <div className="p-3 rounded-full bg-sky-500/20 text-sky-300 group-hover:scale-110 transition-transform">
                    {isSaving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-white">
                      {driveFile ? 'Actualizar Copia en Drive' : 'Subir Respaldo a Drive'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sincroniza tus {nodes.length} recursos y {edges.length} conexiones actuales
                    </span>
                  </div>
                </button>

                {/* Download / Restore */}
                <button
                  type="button"
                  onClick={handleRestoreFromDrive}
                  disabled={isLoadingFile || !driveFile}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center space-y-2 group ${
                    driveFile
                      ? 'border-emerald-600/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                    {isLoadingFile ? <RefreshCw className="w-6 h-6 animate-spin" /> : <DownloadCloud className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-white">
                      Restaurar desde Drive
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {driveFile ? 'Cargar datos de la nube al lienzo' : 'No hay archivo previo en Drive'}
                    </span>
                  </div>
                </button>
              </div>

              {/* File Info Card if exists */}
              {driveFile && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Último respaldo en Drive:</span>
                    <strong className="text-slate-200">
                      {new Date(driveFile.modifiedTime).toLocaleString()}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={checkExistingBackup}
                    disabled={isSearching}
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSearching ? 'animate-spin' : ''}`} />
                    <span>Refrescar</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/30 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">Almacenamiento Privado y Seguro</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Tus datos nunca pasan por servidores de terceros. El archivo de respaldo se almacena
                directamente en la carpeta de tu Google Drive personal con el alcance exclusivo de esta aplicación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
