import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2,
  Calendar,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { BrainNodeData, Category } from '../types';
import { obtenerRazonEfectiva } from '../utils/textUtils';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: BrainNodeData[];
  categories: Category[];
  onSelectNode: (nodeId: string) => void;
  onNewNode: () => void;
  onOpenStudyReview: () => void;
  onOpenGoogleDrive: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  nodes,
  categories,
  onSelectNode,
  onNewNode,
  onOpenStudyReview,
  onOpenGoogleDrive,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  // Acciones fijas rápidas
  const quickActions = [
    {
      id: 'action-new',
      titulo: 'Crear Nuevo Recurso...',
      descripcion: 'Registrar un enlace, nota o imagen en el mapa mental',
      icon: <Sparkles className="w-4 h-4 text-orange-400" />,
      run: () => {
        onClose();
        onNewNode();
      },
    },
    {
      id: 'action-review',
      titulo: 'Iniciar Repaso Activo (Flashcards)',
      descripcion: 'Entrena tu memoria y pon a prueba tu retención',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      run: () => {
        onClose();
        onOpenStudyReview();
      },
    },
    {
      id: 'action-drive',
      titulo: 'Sincronizar con Google Drive',
      descripcion: 'Respaldar o restaurar tu Segundo Cerebro en la nube',
      icon: <CheckCircle2 className="w-4 h-4 text-sky-400" />,
      run: () => {
        onClose();
        onOpenGoogleDrive();
      },
    },
  ];

  // Filtrar nodos por título, contenido, razón o etiquetas
  const cleanQ = query.trim().toLowerCase();
  const matchedNodes = cleanQ
    ? nodes.filter((node) => {
        const cat = categoryMap.get(node.categoriaId);
        const effectiveReason = obtenerRazonEfectiva(node);
        return (
          node.titulo.toLowerCase().includes(cleanQ) ||
          node.contenido.toLowerCase().includes(cleanQ) ||
          effectiveReason.toLowerCase().includes(cleanQ) ||
          cat?.nombre.toLowerCase().includes(cleanQ) ||
          (node.etiquetas || []).some((t) => t.toLowerCase().includes(cleanQ))
        );
      })
    : nodes.slice(0, 8); // Primeros 8 como sugerencia inicial

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, matchedNodes.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedNodes[selectedIndex]) {
        onSelectNode(matchedNodes[selectedIndex].id);
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden font-arial flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe para buscar un concepto o saltar a un nodo... (Esc para salir)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </span>
        </div>

        {/* List Content */}
        <div className="p-3 overflow-y-auto space-y-3">
          {/* Quick Actions if query is empty */}
          {!cleanQ && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Acciones Rápidas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={action.run}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-600 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      {action.icon}
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {action.titulo}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {action.descripcion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Nodes */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              {cleanQ ? `Coincidencias (${matchedNodes.length})` : 'Conceptos Recientes'}
            </span>

            {matchedNodes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No se encontraron nodos con "{query}".
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                {matchedNodes.map((node, idx) => {
                  const cat = categoryMap.get(node.categoriaId);
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        onSelectNode(node.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-slate-600 text-white'
                          : 'bg-slate-900/40 border-transparent hover:bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                          {node.tipo === 'enlace' ? (
                            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                          ) : node.tipo === 'imagen' ? (
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-100 truncate">
                              {node.titulo}
                            </span>
                            {cat && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[10px] font-medium shrink-0"
                                style={{
                                  backgroundColor: `${cat.color}20`,
                                  color: cat.color,
                                }}
                              >
                                {cat.nombre}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate italic font-athelas">
                            "{obtenerRazonEfectiva(node)}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {node.estado && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            node.estado === 'dominado'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : node.estado === 'en_practica'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {node.estado === 'dominado' ? '✓ Dominado' : node.estado === 'en_practica' ? '⚡ En Práctica' : '○ Por Aprender'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                          Saltar ↵
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para seleccionar</span>
            <span>ESC para cerrar</span>
          </div>
          <span>Atajo global: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
