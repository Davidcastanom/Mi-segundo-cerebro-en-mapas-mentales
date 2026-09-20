import React from 'react';
import { BrainNodeData, Category, BrainEdgeData } from '../types';
import { 
  X, 
  Brain, 
  Instagram, 
  FileText, 
  Image as ImageIcon, 
  Network, 
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: BrainNodeData[];
  edges: BrainEdgeData[];
  categories: Category[];
  onFilterCategory: (catId: string | null) => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  categories,
  onFilterCategory,
}) => {
  if (!isOpen) return null;

  const totalNodes = nodes.length;
  const reelsCount = nodes.filter(n => n.tipo === 'enlace').length;
  const notesCount = nodes.filter(n => n.tipo === 'nota').length;
  const imagesCount = nodes.filter(n => n.tipo === 'imagen').length;
  const connectionsCount = edges.length;

  // Category counts
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: nodes.filter(n => n.categoriaId === cat.id).length,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 font-arial">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 font-vanguard uppercase tracking-wider">
                Estado de tu Segundo Cerebro
              </h2>
              <p className="text-xs text-slate-400 font-arial">
                Métricas de tu mapa de aprendizaje y conexiones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-arial">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-arial">Nodos Totales</span>
              <div className="text-3xl font-bold text-slate-100 mt-1 font-vanguard tracking-wide">{totalNodes}</div>
              <span className="text-[10px] text-slate-500">Recursos en tu lienzo</span>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-arial">Conexiones Activas</span>
              <div className="text-3xl font-bold text-sky-400 mt-1 font-vanguard tracking-wide">{connectionsCount}</div>
              <span className="text-[10px] text-slate-500">Ramas neuronales</span>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-vanguard">
              Distribución por Formato
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Reels & Enlaces</span>
                </div>
                <span className="font-semibold text-slate-100 text-xs bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                  {reelsCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Notas & Apuntes de texto</span>
                </div>
                <span className="font-semibold text-slate-100 text-xs bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                  {notesCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Imágenes de Referencia</span>
                </div>
                <span className="font-semibold text-slate-100 text-xs bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                  {imagesCount}
                </span>
              </div>
            </div>
          </div>

          {/* Topics & Categories Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Temas de Estudio
            </h3>
            <div className="space-y-2">
              {categoryCounts.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onFilterCategory(cat.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 bg-slate-950/50 hover:bg-slate-800/50 rounded-xl border border-slate-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="text-xs font-medium text-slate-200 group-hover:text-slate-100">
                      {cat.nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      {cat.count} {cat.count === 1 ? 'nodo' : 'nodos'}
                    </span>
                    <span className="text-[11px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Filtrar →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Tip */}
          <div className="p-3.5 bg-sky-950/30 border border-sky-800/40 rounded-xl text-xs text-sky-200/90 leading-relaxed">
            <strong className="text-sky-300 block mb-1">Filosofía de tu Segundo Cerebro:</strong>
            Al registrar por qué guardas un recurso y conectarlo a tus notas o imágenes, conviertes información dispersa en conocimiento permanente.
          </div>
        </div>
      </div>
    </div>
  );
};
