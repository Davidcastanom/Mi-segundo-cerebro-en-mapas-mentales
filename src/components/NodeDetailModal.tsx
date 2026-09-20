import React, { useState } from 'react';
import { BrainNodeData, Category } from '../types';
import { 
  formatearFechaCompleta, 
  formatearFechaLegible, 
  tiempoRelativo, 
  obtenerRazonEfectiva,
  generarDocumentoMarkdown,
  generarDocumentoHTML,
  descargarArchivo,
  ConnectedNodeInfo
} from '../utils/textUtils';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  ExternalLink, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  Share2, 
  Edit3, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Instagram, 
  Youtube, 
  Globe, 
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Layers,
  Printer
} from 'lucide-react';

interface NodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: BrainNodeData | null;
  category?: Category;
  allNodes: BrainNodeData[];
  categories: Category[];
  connectedNodes: ConnectedNodeInfo[];
  onSelectNode: (node: BrainNodeData) => void;
  onEditNode: (node: BrainNodeData) => void;
  onOpenNotionModal: (node: BrainNodeData) => void;
  onFilterByCategory: (categoryId: string) => void;
  onFilterByTag: (tag: string) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  isOpen,
  onClose,
  node,
  category,
  allNodes,
  categories,
  connectedNodes,
  onSelectNode,
  onEditNode,
  onOpenNotionModal,
  onFilterByCategory,
  onFilterByTag,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen || !node) return null;

  const categoryColor = category?.color || '#38bdf8';
  const effectiveReason = obtenerRazonEfectiva(node);
  const formattedFullDate = formatearFechaCompleta(node.fechaCreacion);
  const formattedShortDate = formatearFechaLegible(node.fechaCreacion);
  const relativeTime = tiempoRelativo(node.fechaCreacion);

  // Navigation between nodes in the list
  const currentIndex = allNodes.findIndex((n) => n.id === node.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allNodes.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelectNode(allNodes[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelectNode(allNodes[currentIndex + 1]);
  };

  const handleCopyMarkdown = () => {
    const md = generarDocumentoMarkdown(node, category, connectedNodes);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generarDocumentoMarkdown(node, category, connectedNodes);
    const safeTitle = (node.titulo || 'recurso')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    const fileName = `${safeTitle}-${node.fechaCreacion || 'segundo-cerebro'}.md`;
    descargarArchivo(fileName, md, 'text/markdown;charset=utf-8');
    setDownloadSuccess('Markdown (.md) descargado');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadHTML = () => {
    const html = generarDocumentoHTML(node, category, connectedNodes);
    const safeTitle = (node.titulo || 'recurso')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    const fileName = `${safeTitle}-${node.fechaCreacion || 'segundo-cerebro'}.html`;
    descargarArchivo(fileName, html, 'text/html;charset=utf-8');
    setDownloadSuccess('Ficha imprimible (.html) descargada');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const getIcon = () => {
    if (node.tipo === 'enlace') {
      if (node.plataforma === 'instagram' || node.contenido.includes('instagram.com')) {
        return <Instagram className="w-4 h-4 text-pink-400" />;
      }
      if (node.plataforma === 'youtube' || node.contenido.includes('youtube.com')) {
        return <Youtube className="w-4 h-4 text-red-400" />;
      }
      return <Globe className="w-4 h-4 text-sky-400" />;
    }
    if (node.tipo === 'imagen') {
      return <ImageIcon className="w-4 h-4 text-amber-400" />;
    }
    return <FileText className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-arial">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Top Accent Color Line */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: categoryColor }} />

        {/* Header */}
        <div 
          className="px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Category Pill */}
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border flex items-center gap-1.5"
              style={{
                backgroundColor: `${categoryColor}18`,
                borderColor: `${categoryColor}40`,
                color: categoryColor,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }} />
              {category?.nombre || 'General'}
            </span>

            {/* Type Badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              {getIcon()}
              <span className="capitalize">{node.tipo}</span>
            </span>

            {/* Creation Date Badge */}
            <span 
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800"
              title={`Fecha completa: ${formattedFullDate}`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{formattedShortDate}</span>
              {relativeTime && (
                <span className="text-slate-500 font-sans text-[11px]">({relativeTime})</span>
              )}
            </span>
          </div>

          {/* Nav & Close Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {allNodes.length > 1 && (
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 mr-1">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  title="Nodo anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-500 px-1.5">
                  {currentIndex + 1}/{allNodes.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  title="Siguiente nodo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {/* Notification toast if downloaded */}
          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Title and Quick Actions */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-normal leading-snug font-athelas">
              {node.titulo || 'Sin título'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap font-arial">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Registrado: {formattedFullDate}
              </span>
              {node.urlOriginal && (
                <a
                  href={node.urlOriginal}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir enlace original
                </a>
              )}
            </div>
          </div>

          {/* Prominent Reason Box: ¿Por qué lo guardé? */}
          <div 
            className="rounded-xl p-4 space-y-2 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--color-dom-60-base, #001621)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
              borderWidth: '1px',
            }}
          >
            <div 
              className="absolute left-0 top-0 bottom-0 w-1" 
              style={{ backgroundColor: categoryColor || 'var(--color-acc-10-primary, #FF4103)' }} 
            />
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span 
                className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-vanguard"
                style={{ color: 'var(--color-acc-10-primary, #FF4103)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                ¿Por qué lo guardé? (Razón de Aprendizaje)
              </span>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: 'var(--color-sec-30-surface, #022436)',
                  borderColor: 'var(--color-sec-30-border, #0d4364)',
                  color: 'var(--color-sec-30-muted, #87b5d1)',
                }}
              >
                {node.razonModo === 'manual' ? 'Modo Manual' : 'Modo Automático'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium italic leading-relaxed pl-1 font-athelas">
              "{effectiveReason}"
            </p>
          </div>

          {/* Main Content / Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-vanguard">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Contenido y Notas de Estudio
            </h3>

            {node.tipo === 'nota' && (
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {node.contenido}
              </div>
            )}

            {node.tipo === 'enlace' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
                  <span className="text-xs text-slate-400 truncate max-w-[450px] font-mono">
                    {node.contenido}
                  </span>
                  <a
                    href={node.contenido}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors ml-2 shrink-0"
                  >
                    Abrir <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {node.imagenUrl && (
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 max-h-64 flex items-center justify-center">
                    <img
                      src={node.imagenUrl}
                      alt={node.titulo}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover max-h-64"
                    />
                  </div>
                )}
              </div>
            )}

            {node.tipo === 'imagen' && (
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 max-h-80 flex items-center justify-center">
                <img
                  src={node.contenido || node.imagenUrl}
                  alt={node.titulo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-80"
                />
              </div>
            )}
          </div>

          {/* Tags section */}
          {node.etiquetas && node.etiquetas.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Etiquetas (haz clic para filtrar el mapa)
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                {node.etiquetas.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onFilterByTag(tag);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 hover:text-sky-300 hover:border-sky-500/50 text-xs font-medium transition-colors flex items-center gap-1"
                    title={`Filtrar mapa por #${tag}`}
                  >
                    <span>#{tag}</span>
                    <Filter className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Connected Nodes (Network of Concepts) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Conexiones en el Segundo Cerebro ({connectedNodes.length})
              </span>
              <span className="text-[11px] text-slate-500 font-normal lowercase">
                haz clic en un concepto para consultarlo
              </span>
            </h3>

            {connectedNodes.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                Este concepto no tiene conexiones activas aún. Arrastra desde sus conectores en el lienzo para vincularlo con otras ideas.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {connectedNodes.map((conn) => {
                  const targetNode = allNodes.find((n) => n.id === conn.id);
                  const connCat = categories.find((c) => c.nombre === conn.categoriaNombre || c.id === targetNode?.categoriaId);
                  const isOutgoing = conn.direccion === 'saliente';

                  return (
                    <button
                      key={conn.id}
                      onClick={() => {
                        if (targetNode) onSelectNode(targetNode);
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-2 group"
                    >
                      <div className="p-1 rounded bg-slate-900 text-slate-400 group-hover:text-sky-400 mt-0.5 shrink-0">
                        {isOutgoing ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-semibold text-slate-500">
                            {isOutgoing ? 'Conecta hacia' : 'Proviene de'}
                          </span>
                          {connCat && (
                            <span 
                              className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                              style={{ color: connCat.color, backgroundColor: `${connCat.color}15` }}
                            >
                              {connCat.nombre}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                          {conn.titulo}
                        </h4>
                        {conn.relacion && (
                          <p className="text-[11px] text-sky-400/90 italic truncate">
                            "{conn.relacion}"
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Export as Document & Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 flex-wrap shrink-0">
          {/* Document Download Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-sky-600/20"
              title="Descargar toda la información en formato Markdown (.md) para Notion/Obsidian"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Descargar .MD</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
              title="Descargar como ficha HTML estilizada e imprimible"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Ficha HTML</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
              title="Copiar contenido formateado al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation & Context Actions */}
          <div className="flex items-center gap-1.5">
            {category && (
              <button
                onClick={() => {
                  onFilterByCategory(category.id);
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                title={`Filtrar el mapa exclusivamente por ${category.nombre}`}
              >
                <Filter className="w-3.5 h-3.5 text-sky-400" />
                <span>Filtrar {category.nombre}</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenNotionModal(node);
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Abrir generador Open Graph para Notion"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
            </button>

            <button
              onClick={() => {
                onEditNode(node);
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Editar nodo"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
