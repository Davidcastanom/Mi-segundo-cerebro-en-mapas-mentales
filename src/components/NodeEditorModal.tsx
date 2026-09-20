import React, { useState, useEffect } from 'react';
import { BrainNodeData, Category, NodeType, NodeStatus, ChecklistItem } from '../types';
import { generarRazonAutomatica, detectarPlataforma } from '../utils/textUtils';
import { 
  X, 
  Sparkles, 
  Instagram, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Check, 
  Tag,
  CheckSquare,
  Trash2,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

interface NodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeData: Partial<BrainNodeData>) => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  initialData?: BrainNodeData | null;
}

export const NodeEditorModal: React.FC<NodeEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  initialData,
}) => {
  const [tipo, setTipo] = useState<NodeType>('enlace');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id || 'ingles');
  const [estado, setEstado] = useState<NodeStatus>('por_aprender');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  
  // Razón / Motivo (Requisito 10 & 11)
  const [razonModo, setRazonModo] = useState<'manual' | 'automatico'>('manual');
  const [razonManual, setRazonManual] = useState('');

  // Nueva Categoría inline state
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#06b6d4');

  useEffect(() => {
    if (initialData) {
      setTipo(initialData.tipo);
      setTitulo(initialData.titulo);
      setContenido(initialData.contenido);
      setCategoriaId(initialData.categoriaId);
      setEstado(initialData.estado || 'por_aprender');
      setChecklist(initialData.checklist || []);
      setEtiquetas(initialData.etiquetas || []);
      setImagenUrl(initialData.imagenUrl || '');
      setRazonModo(initialData.razonModo || 'manual');
      setRazonManual(initialData.razonManual || '');
    } else {
      setTipo('enlace');
      setTitulo('');
      setContenido('');
      setCategoriaId(categories[0]?.id || 'ingles');
      setEstado('por_aprender');
      setChecklist([]);
      setEtiquetas([]);
      setImagenUrl('');
      setRazonModo('manual');
      setRazonManual('');
    }
    setShowNewCategory(false);
    setNewChecklistText('');
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  // Live reason preview
  const previewRazon = razonModo === 'manual' 
    ? (razonManual.trim() || '(Escribe el motivo por el que guardas este recurso...)')
    : generarRazonAutomatica(contenido);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (trimmed && !etiquetas.includes(trimmed)) {
      setEtiquetas([...etiquetas, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEtiquetas(etiquetas.filter(t => t !== tagToRemove));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      texto: newChecklistText.trim(),
      completado: false,
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completado: !item.completado } : item
      )
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const id = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCategory: Category = {
      id,
      nombre: newCatName.trim(),
      color: newCatColor,
      bgLight: 'bg-slate-900',
      borderColor: newCatColor,
      textColor: 'text-slate-100',
    };
    onAddCategory(newCategory);
    setCategoriaId(newCategory.id);
    setShowNewCategory(false);
    setNewCatName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const detectedPlatform = tipo === 'enlace' ? detectarPlataforma(contenido) : undefined;

    onSave({
      ...(initialData || {}),
      tipo,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      categoriaId,
      estado,
      checklist,
      etiquetas,
      imagenUrl: imagenUrl.trim() || undefined,
      plataforma: detectedPlatform,
      razonModo,
      razonManual: razonManual.trim(),
      fechaCreacion: initialData?.fechaCreacion || new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-arial">
      <div 
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 font-vanguard uppercase tracking-wider">
              {initialData ? 'Editar Recurso de Aprendizaje' : 'Nuevo Nodo en tu Segundo Cerebro'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-arial">
              Registra el conocimiento con pasos prácticos y la razón por la que te servirá.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Tipo de Nodo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tipo de Contenido
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipo('enlace')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  tipo === 'enlace'
                    ? 'bg-sky-500/10 border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Enlace / Reel</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo('nota')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  tipo === 'nota'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nota de Texto</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo('imagen')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  tipo === 'imagen'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Imagen de Apoyo</span>
              </button>
            </div>
          </div>

          {/* Estado de Dominio Cognitivo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Estado de Dominio Cognitivo</span>
              <span className="text-[10px] text-slate-500 font-normal">(Permite saber qué te falta repasar)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEstado('por_aprender')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  estado === 'por_aprender'
                    ? 'bg-rose-950/70 border-rose-600 text-rose-300 ring-1 ring-rose-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>○ Por Aprender</span>
              </button>

              <button
                type="button"
                onClick={() => setEstado('en_practica')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  estado === 'en_practica'
                    ? 'bg-amber-950/70 border-amber-600 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ En Práctica</span>
              </button>

              <button
                type="button"
                onClick={() => setEstado('dominado')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  estado === 'dominado'
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>✓ Dominado</span>
              </button>
            </div>
          </div>

          {/* Categoría Selector + Nueva Categoría */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Materia / Categoría
              </label>
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {showNewCategory ? 'Cancelar' : 'Añadir nueva materia'}
              </button>
            </div>

            {showNewCategory ? (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nombre de la materia (ej. Inglés, Negocios, Photoshop...)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-slate-900"
                    title="Color de la materia"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Guardar Materia
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoriaId(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      categoriaId === cat.id
                        ? 'ring-2 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    style={{
                      borderColor: categoriaId === cat.id ? cat.color : undefined,
                      boxShadow: categoriaId === cat.id ? `0 0 12px ${cat.color}30` : undefined,
                      backgroundColor: categoriaId === cat.id ? `${cat.color}20` : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Título del Recurso
            </label>
            <input
              type="text"
              required
              placeholder={
                tipo === 'enlace'
                  ? 'Ej: Reel: 5 Phrasal Verbs de Negocios en 45s'
                  : tipo === 'nota'
                  ? 'Ej: Truco de Curvas y Corrección de Color en Photoshop'
                  : 'Ej: Infografía: Paletas de color accesibles'
              }
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-athelas"
            />
          </div>

          {/* Contenido (URL, Markdown o Imagen) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{tipo === 'enlace' ? 'Enlace (URL del Reel / Web / YouTube)' : tipo === 'nota' ? 'Nota o Apunte de Estudio' : 'URL de la Imagen'}</span>
              {tipo === 'enlace' && (
                <span className="text-[11px] text-pink-400 font-normal">
                  Soporta reels de Instagram, videos y enlaces web
                </span>
              )}
            </label>

            {tipo === 'nota' ? (
              <textarea
                rows={4}
                required
                placeholder="Escribe tus apuntes, pasos del tutorial, atajos de teclado o fórmulas que no quieres olvidar..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-sans leading-relaxed"
              />
            ) : (
              <input
                type="url"
                required
                placeholder={
                  tipo === 'enlace'
                    ? 'https://www.instagram.com/reel/... o https://...'
                    : 'https://images.unsplash.com/... o enlace de imagen'
                }
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
              />
            )}
          </div>

          {/* Checklist de pasos prácticos accionables */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Pasos Accionables / Lista de Práctica (Opcional)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {checklist.filter((c) => c.completado).length}/{checklist.length} completados
              </span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ej: 1. Descargar presets de curvas, 2. Aplicar en foto de prueba..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Añadir Paso
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1.5 pt-1 max-h-32 overflow-y-auto">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/90 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className="flex items-center gap-2 text-left flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={item.completado}
                        onChange={() => {}}
                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span className={item.completado ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {item.texto}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Imagen de miniatura opcional para enlaces */}
          {tipo === 'enlace' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Miniatura o Imagen de Apoyo (Opcional)</span>
                <span className="text-[10px] text-slate-500 font-mono">URL de imagen</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-... (Opcional)"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* Razón / Motivo de guardado (Requisitos 10 & 11) */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Por qué lo guardé? (Razón de Aprendizaje)</span>
              </div>

              {/* Dual mode toggle */}
              <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setRazonModo('manual')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    razonModo === 'manual'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Modo Manual
                </button>
                <button
                  type="button"
                  onClick={() => setRazonModo('automatico')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    razonModo === 'automatico'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Automático (~140 palabras)
                </button>
              </div>
            </div>

            {razonModo === 'manual' ? (
              <div className="space-y-1">
                <textarea
                  rows={2}
                  placeholder="Ej: Técnica de dodge/burn con curvas que quiero probar en el retrato del proyecto final."
                  value={razonManual}
                  onChange={(e) => setRazonManual(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Recomendado para Notion: 140–160 caracteres</span>
                  <span className={razonManual.length > 160 ? 'text-amber-400 font-bold' : ''}>
                    {razonManual.length}/160
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">
                  Vista previa de la razón extraída automáticamente de la nota:
                </div>
                <p className="italic text-slate-300">"{previewRazon}"</p>
              </div>
            )}
          </div>

          {/* Etiquetas / Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Etiquetas (Tags de búsqueda rápida)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe una etiqueta y presiona Enter (ej: #vocabulario, #atajo)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
              >
                Agregar
              </button>
            </div>

            {etiquetas.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {etiquetas.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-red-400 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 sm:px-5 py-2 text-xs font-semibold rounded-xl text-white transition-all shadow-lg flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
          >
            <Check className="w-4 h-4" />
            {initialData ? 'Actualizar Nodo' : 'Crear en el Mapa'}
          </button>
        </div>
      </div>
    </div>
  );
};
