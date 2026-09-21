import React from 'react';
import {
  X,
  GraduationCap,
  Cloud,
  BarChart2,
  LayoutGrid,
  Palette,
  BookOpen,
  FileDown,
  Upload,
  RotateCcw,
  Search,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface AspectsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
  onOpenReviewModal: () => void;
  onOpenDriveModal: () => void;
  onOpenStats: () => void;
  onAutoLayout: () => void;
  onOpenPalette?: () => void;
  onOpenManual?: () => void;
  onOpenCommandPalette?: () => void;
  onExportDocument?: (format: 'md' | 'html') => void;
  onExportJSON: () => void;
  onTriggerImport: () => void;
  onResetDemo: () => void;
  totalNodes: number;
}

export const AspectsHubModal: React.FC<AspectsHubModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal,
  onOpenReviewModal,
  onOpenDriveModal,
  onOpenStats,
  onAutoLayout,
  onOpenPalette,
  onOpenManual,
  onOpenCommandPalette,
  onExportDocument,
  onExportJSON,
  onTriggerImport,
  onResetDemo,
  totalNodes,
}) => {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-arial animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top stripe */}
        <div 
          className="h-1.5 w-full shrink-0" 
          style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }} 
        />

        {/* Header */}
        <div 
          className="px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0 bg-slate-950/50"
          style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{
                backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
              }}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-vanguard tracking-wide uppercase">
                Segundo Cerebro • Centro de Aspectos
              </h2>
              <p className="text-xs text-slate-300">
                Organiza enlaces, reels, notas y conecta ramas de aprendizaje ({totalNodes} recursos)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid with Aspect Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* PWA Mobile App Download Card */}
          <PWAInstallButton variant="banner" />

          {/* Quick Primary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nuevo Nodo */}
            <button
              onClick={() => handleAction(onOpenCreateModal)}
              className="p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all hover:scale-[1.01] active:scale-98 group"
              style={{
                backgroundColor: 'var(--color-dom-60-base, #001621)',
                borderColor: 'var(--color-acc-10-primary, #FF4103)',
              }}
            >
              <div 
                className="p-2 rounded-lg text-white shadow-md shrink-0"
                style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white group-hover:text-[var(--color-acc-10-primary,#FF4103)] flex items-center justify-between">
                  <span>+ Nuevo Recurso</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Añade un reel, enlace, apunte de texto o imagen con checklist de práctica.
                </p>
              </div>
            </button>

            {/* Repaso Activo */}
            <button
              onClick={() => handleAction(onOpenReviewModal)}
              className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-950/50 text-left flex items-start gap-3 transition-all hover:scale-[1.01] active:scale-98 group"
            >
              <div className="p-2 rounded-lg bg-purple-600 text-white shadow-md shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-purple-200 group-hover:text-white flex items-center justify-between">
                  <span>Repaso Activo (Flashcards)</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  Estudia conceptos con tarjetas de memoria mnemotécnica y evalúa tu retención.
                </p>
              </div>
            </button>
          </div>

          {/* Section: Aspectos de Gestión y Nube */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-vanguard flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Sincronización y Diagnóstico</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Drive */}
              <button
                onClick={() => handleAction(onOpenDriveModal)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/80 shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                    Sincronización Google Drive
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Respalda y restaura tu cerebro en la nube
                  </p>
                </div>
              </button>

              {/* Métricas */}
              <button
                onClick={() => handleAction(onOpenStats)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/80 shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                    Métricas de Conocimiento
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Total de ramas, nodos y estados cognitivos
                  </p>
                </div>
              </button>

              {/* Auto-Organizar */}
              <button
                onClick={() => handleAction(onAutoLayout)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 shrink-0">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    Auto-Organizar Lienzo
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Distribuye columnas ordenadas por tema
                  </p>
                </div>
              </button>

              {/* Buscar / Command Palette */}
              <button
                onClick={() => handleAction(onOpenCommandPalette || (() => {}))}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/80 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    Búsqueda Global (Ctrl+K)
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Localiza conceptos por etiquetas o contenido
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Documentación y Personalización */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-vanguard flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Personalización y Guía</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Paleta 60-30-10 */}
              <button
                onClick={() => handleAction(onOpenPalette || (() => {}))}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-pink-950 text-pink-400 border border-pink-800/80 shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-pink-300">
                    Paleta Armónica (60-30-10)
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Personaliza contrastes y colores del mapa
                  </p>
                </div>
              </button>

              {/* Manual */}
              <button
                onClick={() => handleAction(onOpenManual || (() => {}))}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-orange-950 text-orange-400 border border-orange-800/80 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-orange-300">
                    Manual de Instrucciones
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Guía de atajos, gestos y recomendaciones
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Exportación y Respaldos */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-vanguard flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar y Respaldar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Export Dossier Markdown */}
              <button
                onClick={() => handleAction(() => onExportDocument?.('md'))}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 shrink-0">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                    Dossier en Markdown (.md)
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Documento estructurado listo para Notion u Obsidian
                  </p>
                </div>
              </button>

              {/* Export Dossier Web HTML */}
              <button
                onClick={() => handleAction(() => onExportDocument?.('html'))}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/80 shrink-0">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-teal-300">
                    Dossier Web Imprimible (.html)
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Reporte web completo con formato y enlaces
                  </p>
                </div>
              </button>

              {/* Export JSON backup */}
              <button
                onClick={() => handleAction(onExportJSON)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/80 shrink-0">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                    Descargar Respaldo JSON
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Archivo de copia de seguridad completa
                  </p>
                </div>
              </button>

              {/* Import JSON backup */}
              <button
                onClick={() => handleAction(onTriggerImport)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/80 shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                    Restaurar desde JSON
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Cargar archivo de respaldo previo
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Reset Demo footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">¿Quieres recargar los temas de prueba?</span>
            <button
              onClick={() => handleAction(onResetDemo)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Ejemplo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
