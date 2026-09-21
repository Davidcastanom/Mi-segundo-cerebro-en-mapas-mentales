import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Youtube, 
  MapPin, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { obtenerYouTubeEmbedUrl } from '../utils/textUtils';

export interface FloatingVideoData {
  videoId: string;
  title: string;
  nodeId?: string;
  timestamp?: number | null;
}

interface FloatingVideoPlayerProps {
  video: FloatingVideoData | null;
  onClose: () => void;
  onFocusNode?: (nodeId: string) => void;
  onOpenDetail?: (nodeId: string) => void;
}

export const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({
  video,
  onClose,
  onFocusNode,
  onOpenDetail,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const embedUrl = obtenerYouTubeEmbedUrl(video.videoId, video.timestamp, true);

  const handleCopyLink = () => {
    const url = `https://www.youtube.com/watch?v=${video.videoId}${
      video.timestamp ? `&t=${video.timestamp}s` : ''
    }`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Reproductor flotante de YouTube"
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col font-arial shadow-2xl transition-all duration-300"
    >
      {isMinimized ? (
        /* Minimized floating pill */
        <div 
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          <div className="p-1.5 rounded-full bg-red-600 text-white shadow-sm flex items-center justify-center">
            <Youtube className="w-3.5 h-3.5" />
          </div>

          <span className="text-xs font-semibold text-slate-100 max-w-[160px] sm:max-w-[220px] truncate">
            {video.title || 'Video de YouTube'}
          </span>

          <div className="flex items-center gap-1 ml-1 border-l border-slate-700/80 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Expandir reproductor"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Cerrar video"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full floating video window */
        <div 
          className="w-[calc(100vw-24px)] sm:w-[420px] md:w-[460px] rounded-2xl border shadow-2xl overflow-hidden flex flex-col backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{
            backgroundColor: 'var(--color-dom-60-base, #001621)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          {/* Header Bar */}
          <div 
            className="px-3.5 py-2.5 border-b flex items-center justify-between gap-2"
            style={{
              backgroundColor: 'var(--color-sec-30-surface, #022436)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-red-600 text-white shadow-sm shrink-0 flex items-center justify-center">
                <Youtube className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-100 truncate tracking-wide">
                {video.title || 'Video de YouTube'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Minimizar reproductor a barra flotante"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                title="Cerrar reproductor"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video Iframe Container (16:9) */}
          <div className="relative w-full aspect-video bg-black overflow-hidden group">
            <iframe
              src={embedUrl}
              title={video.title || 'Reproductor de YouTube'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Quick Actions Footer */}
          <div 
            className="px-3 py-2 border-t flex items-center justify-between gap-2 text-[11px]"
            style={{
              backgroundColor: 'var(--color-sec-30-surface, #022436)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
            }}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {video.nodeId && onFocusNode && (
                <button
                  onClick={() => onFocusNode(video.nodeId!)}
                  className="px-2 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-sky-300 flex items-center gap-1 transition-colors border border-slate-700/60"
                  title="Ubicar y enfocar este nodo en el mapa mental"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>Enfocar en mapa</span>
                </button>
              )}

              {video.nodeId && onOpenDetail && (
                <button
                  onClick={() => onOpenDetail(video.nodeId!)}
                  className="px-2 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 flex items-center gap-1 transition-colors border border-slate-700/60"
                  title="Consultar notas de estudio completas"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Ficha completa</span>
                </button>
              )}
            </div>

            <button
              onClick={handleCopyLink}
              className="px-2 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors shrink-0 border border-slate-700/60"
              title="Copiar enlace de YouTube al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
