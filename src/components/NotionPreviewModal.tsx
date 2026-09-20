import React, { useState } from 'react';
import { BrainNodeData, Category } from '../types';
import { 
  formatearTituloNotion, 
  formatearDescripcionNotion, 
  obtenerRazonEfectiva, 
  generarCardNotionSVG 
} from '../utils/textUtils';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  FileCheck,
  Share2
} from 'lucide-react';

interface NotionPreviewModalProps {
  node: BrainNodeData | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
}

export const NotionPreviewModal: React.FC<NotionPreviewModalProps> = ({
  node,
  category,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedReason, setCopiedReason] = useState(false);

  if (!isOpen || !node) return null;

  const rawReason = obtenerRazonEfectiva(node);
  const ogTitle = formatearTituloNotion(node.titulo);
  const ogDescription = formatearDescripcionNotion(rawReason);
  const ogImageSvgDataUrl = generarCardNotionSVG(node, category!);
  
  // Public URL simulation for Notion
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://mi-segundo-cerebro.app';
  const notionTargetUrl = `${appOrigin}/#node-${node.id}`;
  const markdownBookmark = `[${ogTitle} | ${category?.nombre || 'Segundo Cerebro'}](${node.contenido || notionTargetUrl})\n> **¿Por qué lo guardé?**: ${ogDescription}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(notionTargetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownBookmark);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleCopyReason = () => {
    navigator.clipboard.writeText(ogDescription);
    setCopiedReason(true);
    setTimeout(() => setCopiedReason(false), 2000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.download = `notion-card-${node.id}.svg`;
    link.href = ogImageSvgDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-arial">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 font-vanguard uppercase tracking-wider">
                Miniatura Enriquecida para Notion
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700 tracking-normal normal-case">
                  Open Graph 1200×630
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-arial">
                Al pegar este enlace o marcador en Notion, se desplegará esta tarjeta con tu motivo y contexto.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-arial">
          {/* Simulated Notion Bookmark Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-vanguard">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Así se verá desplegado en tu página de Notion (Unfurl preview):
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Notion Web Bookmark
              </span>
            </div>

            {/* Realistic Notion-like Unfurl Widget */}
            <div className="border border-slate-700 bg-slate-950/90 hover:bg-slate-950 rounded-xl overflow-hidden transition-all flex flex-col md:flex-row shadow-lg">
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-arial">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category?.color || '#3b82f6' }}
                    />
                    <span className="font-semibold text-slate-300">{category?.nombre}</span>
                    <span>•</span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">Mi Segundo Cerebro</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 line-clamp-2 font-athelas">
                    {ogTitle}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-athelas italic">
                    <strong className="text-sky-300 font-medium not-italic font-arial">¿Por qué lo guardé?: </strong>
                    "{ogDescription}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-800/80">
                  <span className="truncate max-w-[280px]">{node.contenido || notionTargetUrl}</span>
                </div>
              </div>

              {/* Side/Top Thumbnail */}
              <div className="w-full md:w-48 h-32 md:h-auto bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 relative shrink-0 overflow-hidden flex items-center justify-center">
                {node.imagenUrl || (node.tipo === 'imagen' && node.contenido) ? (
                  <img
                    src={node.imagenUrl || node.contenido}
                    alt={node.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={ogImageSvgDataUrl}
                    alt="Notion Card"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Full 1200x630 OG Image Card Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Imagen Open Graph generada dinámicamente (1200 × 630 px, 1.91:1):
              </label>
              <button
                onClick={handleDownloadImage}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar SVG
              </button>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner max-h-56 relative group">
              <img
                src={ogImageSvgDataUrl}
                alt="Card 1200x630"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Metadata Specs & Limits (Section 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">og:title</span>
                <span className={`font-mono ${ogTitle.length > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {ogTitle.length}/60 caracteres
                </span>
              </div>
              <p className="text-slate-300 font-medium truncate">{ogTitle}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">og:description (Razón)</span>
                <span className={`font-mono ${ogDescription.length > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {ogDescription.length}/160 caracteres
                </span>
              </div>
              <p className="text-slate-300 line-clamp-1">{ogDescription}</p>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReason}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedReason ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedReason ? 'Copiado' : 'Copiar Solo Razón'}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedMarkdown ? 'Copiado' : 'Copiar Bloque Notion'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Notion'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
