import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Check, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft,
  Sparkles,
  Link2
} from 'lucide-react';

export type HandleDirection = 'top' | 'right' | 'bottom' | 'left';

interface EdgeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  edgeId: string | null;
  initialLabel?: string;
  sourceNodeTitle?: string;
  targetNodeTitle?: string;
  initialSourceHandle?: string;
  initialTargetHandle?: string;
  onSaveEdge?: (edgeId: string, label: string, sourceHandle: string, targetHandle: string) => void;
  onSaveLabel?: (edgeId: string, label: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

const COMMON_LABELS = [
  'se relaciona con',
  'es prerequisito de',
  'ejemplo práctico de',
  'aplica en',
  'complemento de',
  'técnica derivada de',
  'recurso recomendado para',
];

const HANDLE_OPTIONS: { id: HandleDirection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'top', label: 'Arriba', icon: ArrowUp },
  { id: 'right', label: 'Derecha', icon: ArrowRight },
  { id: 'bottom', label: 'Abajo', icon: ArrowDown },
  { id: 'left', label: 'Izquierda', icon: ArrowLeft },
];

export const EdgeEditorModal: React.FC<EdgeEditorModalProps> = ({
  isOpen,
  onClose,
  edgeId,
  initialLabel = '',
  sourceNodeTitle = 'Nodo Origen',
  targetNodeTitle = 'Nodo Destino',
  initialSourceHandle = 'bottom',
  initialTargetHandle = 'top',
  onSaveEdge,
  onSaveLabel,
  onDeleteEdge,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [sourceHandle, setSourceHandle] = useState<HandleDirection>(
    (initialSourceHandle as HandleDirection) || 'bottom'
  );
  const [targetHandle, setTargetHandle] = useState<HandleDirection>(
    (initialTargetHandle as HandleDirection) || 'top'
  );

  useEffect(() => {
    setLabel(initialLabel || '');
    setSourceHandle((initialSourceHandle as HandleDirection) || 'bottom');
    setTargetHandle((initialTargetHandle as HandleDirection) || 'top');
  }, [initialLabel, initialSourceHandle, initialTargetHandle, isOpen]);

  if (!isOpen || !edgeId) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveEdge) {
      onSaveEdge(edgeId, label.trim(), sourceHandle, targetHandle);
    } else if (onSaveLabel) {
      onSaveLabel(edgeId, label.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    onDeleteEdge(edgeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-arial">
      <div 
        className="relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        <div 
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
            >
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-vanguard">
              Editar Conexión y Puntos de Salida / Conexión
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Node relationship preview */}
          <div 
            className="p-3.5 rounded-xl border space-y-2 text-xs"
            style={{
              backgroundColor: 'var(--color-dom-60-base, #001621)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
            }}
          >
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Relación entre Nodos</span>
              <span className="text-[10px] text-slate-400 font-normal">
                También puedes reconectar arrastrando los extremos en el lienzo
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-slate-200 py-1">
              <div className="flex flex-col min-w-0 max-w-[170px]">
                <span className="text-[10px] text-slate-400">Desde (Origen):</span>
                <span className="font-semibold truncate text-white">{sourceNodeTitle}</span>
                <span className="text-[10px] text-sky-400 font-mono">Punto: {sourceHandle}</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight 
                  className="w-4 h-4" 
                  style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} 
                />
                <span className="text-[9px] text-slate-400 italic">
                  {label ? `«${label}»` : 'conecta'}
                </span>
              </div>
              <div className="flex flex-col items-end min-w-0 max-w-[170px] text-right">
                <span className="text-[10px] text-slate-400">Hacia (Destino):</span>
                <span className="font-semibold truncate text-white">{targetNodeTitle}</span>
                <span className="text-[10px] text-sky-400 font-mono">Punto: {targetHandle}</span>
              </div>
            </div>
          </div>

          {/* 4 Connection Points Selectors */}
          <div 
            className="p-4 rounded-xl border space-y-3.5"
            style={{
              backgroundColor: 'rgba(0, 22, 33, 0.6)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
              <span>Cambiar Puntos de Salida y Llegada (4 Puntos por Cuadro)</span>
            </div>

            {/* Source Handle Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                <span>Punto de Salida en <strong className="text-white">"{sourceNodeTitle}"</strong>:</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{sourceHandle}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {HANDLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = sourceHandle === opt.id;
                  return (
                    <button
                      key={`source-${opt.id}`}
                      type="button"
                      onClick={() => setSourceHandle(opt.id)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all active:scale-95 ${
                        isSelected 
                          ? 'border-transparent text-white font-bold shadow-md' 
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-acc-10-primary, #FF4103)' : undefined,
                        boxShadow: isSelected ? '0 2px 8px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))' : undefined,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Handle Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                <span>Punto de Llegada en <strong className="text-white">"{targetNodeTitle}"</strong>:</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{targetHandle}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {HANDLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = targetHandle === opt.id;
                  return (
                    <button
                      key={`target-${opt.id}`}
                      type="button"
                      onClick={() => setTargetHandle(opt.id)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border flex flex-col items-center gap-1 transition-all active:scale-95 ${
                        isSelected 
                          ? 'border-transparent text-white font-bold shadow-md' 
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-acc-10-primary, #FF4103)' : undefined,
                        boxShadow: isSelected ? '0 2px 8px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))' : undefined,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Label input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Etiqueta de la Conexión (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: se relaciona con, es prerequisito de, aplica en..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-medium">
              Sugerencias rápidas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_LABELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLabel(item)}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div 
            className="flex items-center justify-between pt-3 border-t"
            style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}
          >
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-medium rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-transparent hover:border-red-900/50 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar Conexión
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                style={{
                  backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                  boxShadow: '0 4px 12px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
                }}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Guardar Conexión
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
