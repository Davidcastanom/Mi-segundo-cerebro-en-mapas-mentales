import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { BrainNodeData, Category, NodeStatus } from '../types';
import { obtenerRazonEfectiva } from '../utils/textUtils';

interface StudyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: BrainNodeData[];
  categories: Category[];
  onUpdateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  onFocusNode: (nodeId: string) => void;
}

export const StudyReviewModal: React.FC<StudyReviewModalProps> = ({
  isOpen,
  onClose,
  nodes,
  categories,
  onUpdateNodeStatus,
  onFocusNode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');

  if (!isOpen) return null;

  // Filtrar nodos aptos para repasar
  const reviewPool = nodes.filter((n) => {
    if (selectedCategoryFilter !== 'todos' && n.categoriaId !== selectedCategoryFilter) {
      return false;
    }
    return true;
  });

  const currentNode = reviewPool[currentIndex] || null;
  const currentCategory = currentNode
    ? categories.find((c) => c.id === currentNode.categoriaId)
    : null;
  const effectiveReason = currentNode ? obtenerRazonEfectiva(currentNode) : '';

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < reviewPool.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // ciclo
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(reviewPool.length - 1);
    }
  };

  const handleSetStatus = (status: NodeStatus) => {
    if (!currentNode) return;
    onUpdateNodeStatus(currentNode.id, status);
    // Avanzar a la siguiente automáticamente tras marcar
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl border shadow-2xl overflow-y-auto flex flex-col font-arial"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div 
              className="p-2 rounded-xl text-white shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-vanguard tracking-wide">
                Sesión de Repaso Activo (Flashcards)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Pon a prueba tu retención: recuerda el concepto antes de voltear la tarjeta
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="todos">Todas las materias ({nodes.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px]">
          {reviewPool.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-medium">No hay recursos en esta categoría para repasar.</p>
              <p className="text-xs text-slate-500">Crea nuevos nodos o cambia el filtro de materia.</p>
            </div>
          ) : currentNode ? (
            <div className="w-full space-y-5">
              {/* Progress counter & Category Badge */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  Concepto {currentIndex + 1} de {reviewPool.length}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: `${currentCategory?.color || '#64748b'}20`,
                      borderColor: `${currentCategory?.color || '#64748b'}50`,
                      color: currentCategory?.color || '#64748b',
                    }}
                  >
                    {currentCategory?.nombre || 'General'}
                  </span>
                  
                  {/* Current Status Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    currentNode.estado === 'dominado' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : currentNode.estado === 'en_practica'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentNode.estado === 'dominado' ? '✓ Dominado' : currentNode.estado === 'en_practica' ? '⚡ En Práctica' : '○ Por Aprender'}
                  </span>
                </div>
              </div>

              {/* Flip Card Container */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full min-h-[260px] rounded-2xl p-6 border border-slate-700/80 cursor-pointer shadow-2xl transition-all duration-300 hover:border-slate-500 flex flex-col justify-between select-none"
                style={{
                  backgroundColor: isFlipped ? 'var(--color-dom-60-base, #001621)' : 'var(--color-sec-30-surface, #022436)',
                }}
              >
                {/* Front Side: Question / Concept Title */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      {isFlipped ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Respuesta & Razón de Aprendizaje</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-sky-400" />
                          <span>Concepto a Recordar</span>
                        </>
                      )}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      Clic para {isFlipped ? 'ver pregunta' : 'voltear'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-athelas leading-snug">
                    {currentNode.titulo}
                  </h3>

                  {/* Flipped side content */}
                  {isFlipped ? (
                    <div className="space-y-3 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                          ¿Por qué lo guardaste y cómo se aplica?
                        </span>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-athelas italic bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90">
                          "{effectiveReason}"
                        </p>
                      </div>

                      {currentNode.contenido && currentNode.tipo === 'nota' && (
                        <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-lg max-h-24 overflow-y-auto whitespace-pre-line">
                          {currentNode.contenido}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-slate-400 italic">
                      ¿Qué aprendiste de este recurso y cómo prometiste aplicarlo en tu vida o proyectos?
                    </div>
                  )}
                </div>

                {/* Footer of the card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {currentNode.tipo === 'enlace' && (
                      <a
                        href={currentNode.contenido}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <span>Abrir enlace</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocusNode(currentNode.id);
                      onClose();
                    }}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    Ver en el lienzo
                  </button>
                </div>
              </div>

              {/* Status Self-Evaluation Buttons */}
              <div className="space-y-2">
                <div className="text-center text-xs text-slate-400">
                  ¿Cómo sientes este conocimiento? Califica tu dominio para actualizar el mapa:
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSetStatus('por_aprender')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold transition-all"
                  >
                    <span>○ Por Repasar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetStatus('en_practica')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300 text-xs font-bold transition-all"
                  >
                    <span>⚡ En Práctica</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetStatus('dominado')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>✓ Dominado</span>
                  </button>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-medium transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isFlipped ? 'Ocultar Razón' : 'Revelar Razón'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
