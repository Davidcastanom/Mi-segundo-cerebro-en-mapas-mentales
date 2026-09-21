import React, { useState } from 'react';
import { BrainNodeData, Category } from '../types';
import { 
  formatearTituloNotion, 
  formatearDescripcionNotion, 
  obtenerRazonEfectiva, 
  generarCardNotionSVG,
  generarCardMapaCompletoSVG,
  convertirSvgDataUrlAPngBlob
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
  Share2,
  Image as ImageIcon,
  Map,
  Compass,
  AlertCircle
} from 'lucide-react';

interface NotionPreviewModalProps {
  node: BrainNodeData | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  allNodes?: BrainNodeData[];
  categories?: Category[];
}

export const NotionPreviewModal: React.FC<NotionPreviewModalProps> = ({
  node,
  category,
  isOpen,
  onClose,
  allNodes = [],
  categories = []
}) => {
  const [viewMode, setViewMode] = useState<'node' | 'fullMap'>('node');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedReason, setCopiedReason] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Defaults if no specific node is selected (or when viewing full map)
  const activeNode = node || allNodes[0] || null;
  const activeCategory = category || (activeNode ? categories.find(c => c.id === activeNode.categoriaId) : categories[0]);

  const rawReason = activeNode ? obtenerRazonEfectiva(activeNode) : 'Mapa global de aprendizaje';
  const ogTitle = activeNode ? formatearTituloNotion(activeNode.titulo) : 'Mi Segundo Cerebro';
  const ogDescription = formatearDescripcionNotion(rawReason);

  // SVG for individual node
  const nodeSvgDataUrl = activeNode && activeCategory ? generarCardNotionSVG(activeNode, activeCategory) : '';

  // SVG for full map
  const totalNodos = allNodes.length;
  const totalChecklist = allNodes.reduce((acc, n) => acc + (n.checklist?.length || 0), 0);
  const totalTags = new Set(allNodes.flatMap(n => n.etiquetas || [])).size;
  const fullMapSvgDataUrl = generarCardMapaCompletoSVG(
    'Mi Segundo Cerebro • Mapa Visual',
    totalNodos,
    categories,
    totalChecklist,
    totalTags
  );

  const currentSvgDataUrl = viewMode === 'fullMap' ? fullMapSvgDataUrl : nodeSvgDataUrl;

  // Base URL
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://mi-segundo-cerebro.vercel.app';

  // Dynamic Open Graph Link for Notion (triggers Vercel serverless /api/share with custom metadata)
  const dynamicNotionShareUrl = activeNode ? (
    viewMode === 'fullMap'
      ? `${appOrigin}/api/share?title=${encodeURIComponent('Mi Segundo Cerebro • Mapa Completo')}&category=${encodeURIComponent('Mapa General')}&reason=${encodeURIComponent(`${totalNodos} módulos de estudio organizados`)}&color=38bdf8&type=Mapa&tags=${encodeURIComponent('SegundoCerebro,MapaVisual')}`
      : `${appOrigin}/api/share?title=${encodeURIComponent(activeNode.titulo)}&category=${encodeURIComponent(activeCategory?.nombre || 'General')}&reason=${encodeURIComponent(ogDescription)}&id=${activeNode.id}&color=${encodeURIComponent((activeCategory?.color || '#38bdf8').replace('#', ''))}&type=${encodeURIComponent(activeNode.tipo)}&tags=${encodeURIComponent((activeNode.etiquetas || []).join(','))}`
  ) : appOrigin;

  // Direct Web App URL
  const directAppUrl = activeNode ? `${appOrigin}/?node=${activeNode.id}` : appOrigin;

  // Formatted Notion markdown block
  const markdownBookmark = viewMode === 'fullMap'
    ? `### 🧠 Mi Segundo Cerebro — Mapa Mental Completo\n> **Resumen del mapa**: ${totalNodos} módulos de aprendizaje, ${categories.length} categorías y ${totalChecklist} pasos prácticos.\n🔗 [Abrir mapa interactivo](${directAppUrl})`
    : `### [${ogTitle} | ${activeCategory?.nombre || 'Segundo Cerebro'}](${directAppUrl})\n> 💡 **¿Por qué lo guardé?**: "${ogDescription}"\n🏷️ ${(activeNode?.etiquetas || []).map(t => `#${t}`).join(' ')}`;

  // 1. Copy dynamic Notion URL (unfurl bookmark)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(dynamicNotionShareUrl);
    setCopiedLink(true);
    setFeedbackMsg('¡Enlace con miniatura copiado! Al pegarlo en Notion selecciona "Create bookmark"');
    setTimeout(() => {
      setCopiedLink(false);
      setFeedbackMsg(null);
    }, 4000);
  };

  // 2. Copy direct PNG Image to clipboard (Ctrl+V in Notion pastes the graphic directly)
  const handleCopyImageToClipboard = async () => {
    if (!currentSvgDataUrl) return;
    setIsProcessingImage(true);
    try {
      const pngBlob = await convertirSvgDataUrlAPngBlob(currentSvgDataUrl);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      setCopiedImage(true);
      setFeedbackMsg('¡Imagen PNG copiada! Ve a tu página de Notion y presiona Ctrl+V para pegarla al instante');
      setTimeout(() => {
        setCopiedImage(false);
        setFeedbackMsg(null);
      }, 4000);
    } catch (err) {
      console.error('Error al copiar imagen:', err);
      // Fallback: copy link
      navigator.clipboard.writeText(dynamicNotionShareUrl);
      setFeedbackMsg('No se pudo escribir imagen al portapapeles del navegador, enlace copiado.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setIsProcessingImage(false);
    }
  };

  // 3. Download high-res PNG
  const handleDownloadPNG = async () => {
    if (!currentSvgDataUrl) return;
    setIsProcessingImage(true);
    try {
      const pngBlob = await convertirSvgDataUrlAPngBlob(currentSvgDataUrl);
      const url = URL.createObjectURL(pngBlob);
      const link = document.createElement('a');
      link.download = viewMode === 'fullMap' ? 'notion-mapa-completo.png' : `notion-card-${activeNode?.id || 'node'}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error descargando PNG, descargando SVG:', err);
      const link = document.createElement('a');
      link.download = `notion-card-${activeNode?.id || 'node'}.svg`;
      link.href = currentSvgDataUrl;
      link.click();
    } finally {
      setIsProcessingImage(false);
    }
  };

  // 4. Copy Markdown Block
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownBookmark);
    setCopiedMarkdown(true);
    setFeedbackMsg('¡Bloque enriquecido para Notion copiado al portapapeles!');
    setTimeout(() => {
      setCopiedMarkdown(false);
      setFeedbackMsg(null);
    }, 3000);
  };

  // 5. Copy raw reason
  const handleCopyReason = () => {
    navigator.clipboard.writeText(ogDescription);
    setCopiedReason(true);
    setTimeout(() => setCopiedReason(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150 font-arial">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 font-vanguard uppercase tracking-wider">
                Miniatura Personalizada para Notion
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700 tracking-normal normal-case">
                  Open Graph 1200×630
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-arial">
                Genera vistas previas visuales reales y tarjetas enriquecidas con tu motivo para Notion.
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

        {/* View Mode Switcher: Single Node vs Full Map */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('node')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'node'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Módulo: {activeNode ? activeNode.titulo.slice(0, 18) + (activeNode.titulo.length > 18 ? '...' : '') : 'Nodo'}</span>
            </button>
            <button
              onClick={() => setViewMode('fullMap')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'fullMap'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapa Completo ({totalNodos} nodos)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Compatible con bookmarks de Notion y Vercel</span>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 font-arial">
          {/* Simulated Notion Bookmark Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-vanguard">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Así se ve desplegado en Notion (Web Bookmark / Unfurl):
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
                      style={{ backgroundColor: activeCategory?.color || '#3b82f6' }}
                    />
                    <span className="font-semibold text-slate-300">
                      {viewMode === 'fullMap' ? 'Mapa Mental Completo' : activeCategory?.nombre}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">Mi Segundo Cerebro</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 line-clamp-2 font-athelas">
                    {viewMode === 'fullMap' ? 'Mi Segundo Cerebro — Mapa Visual' : ogTitle}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-athelas italic">
                    <strong className="text-sky-300 font-medium not-italic font-arial">
                      {viewMode === 'fullMap' ? 'Resumen cognitivo: ' : '¿Por qué lo guardé?: '}
                    </strong>
                    "{viewMode === 'fullMap' ? `${totalNodos} módulos de aprendizaje clasificados en ${categories.length} categorías con ${totalChecklist} pasos de práctica.` : ogDescription}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-800/80">
                  <span className="truncate max-w-[280px] font-mono text-slate-400">{dynamicNotionShareUrl}</span>
                </div>
              </div>

              {/* Side/Top Thumbnail */}
              <div className="w-full md:w-52 h-36 md:h-auto bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 relative shrink-0 overflow-hidden flex items-center justify-center p-1">
                {currentSvgDataUrl && (
                  <img
                    src={currentSvgDataUrl}
                    alt="Notion Card"
                    className="w-full h-full object-contain rounded-md"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Full 1200x630 Graphic Card with Direct Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Miniatura Gráfica Generada (1200 × 630 px):
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPNG}
                  disabled={isProcessingImage}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors p-1"
                  title="Descargar imagen PNG para subir como portada o bloque en Notion"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isProcessingImage ? 'Generando...' : 'Descargar PNG'}</span>
                </button>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner max-h-52 relative group flex items-center justify-center">
              {currentSvgDataUrl ? (
                <img
                  src={currentSvgDataUrl}
                  alt="Card 1200x630"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">Cargando miniatura...</div>
              )}
            </div>
          </div>

          {/* Explanation Box for Notion & Vercel */}
          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-300">
              <Sparkles className="w-4 h-4" />
              <span>Dos formas perfectas de usar esta miniatura en Notion:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <strong className="text-white block mb-1">1. Pegar Imagen PNG Directa (Recomendado):</strong>
                Haz clic en <strong className="text-emerald-400">"Copiar Imagen (PNG)"</strong> abajo y en Notion presiona <kbd className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">Ctrl+V</kbd>. Aparecerá la tarjeta gráfica nítida de inmediato.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <strong className="text-white block mb-1">2. Enlace con Vista Previa (Web Bookmark):</strong>
                Haz clic en <strong className="text-sky-400">"Copiar Enlace para Notion"</strong>. En Notion pégalo y selecciona <em>"Create bookmark"</em>. Notion leerá los metadatos OpenGraph dinámicos de Vercel.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy PNG image directly to clipboard for 1-click Ctrl+V into Notion */}
            <button
              onClick={handleCopyImageToClipboard}
              disabled={isProcessingImage}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Copiar imagen PNG al portapapeles para pegar con Ctrl+V en Notion"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedImage ? '¡Imagen Copiada!' : isProcessingImage ? 'Procesando...' : 'Copiar Imagen (PNG)'}</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMarkdown ? 'Copiado' : 'Copiar Bloque Notion'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Notion'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
