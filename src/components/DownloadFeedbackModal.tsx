import React, { useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  FileText, 
  X, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { descargarArchivo } from '../utils/textUtils';

export interface DownloadModalData {
  isOpen: boolean;
  fileName: string;
  content: string;
  mimeType: string;
  title: string;
  description?: string;
  format: 'json' | 'md' | 'html';
}

interface DownloadFeedbackModalProps {
  data: DownloadModalData;
  onClose: () => void;
}

export const DownloadFeedbackModal: React.FC<DownloadFeedbackModalProps> = ({
  data,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadCount, setDownloadCount] = useState(1);

  if (!data.isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback si el portapapeles está bloqueado
      const textarea = document.createElement('textarea');
      textarea.value = data.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReDownload = () => {
    descargarArchivo(data.fileName, data.content, data.mimeType);
    setDownloadCount((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    if (data.format === 'html') {
      const blob = new Blob([data.content], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--color-dom-60-base, #001621)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between"
          style={{
            borderColor: 'var(--color-sec-30-border, #0d4364)',
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="p-2.5 rounded-xl text-white shadow-md shrink-0 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white tracking-wide font-vanguard truncate">
                {data.title}
              </h2>
              <p className="text-xs text-slate-300 truncate">
                Archivo listo para guardar o copiar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Success Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 flex items-start gap-3">
            <div className="p-1 rounded-full bg-emerald-500 text-slate-950 shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-semibold text-emerald-100">
                ¡Descarga iniciada exitosamente!
              </p>
              <p className="text-emerald-300/90 mt-0.5 font-mono text-[11px] truncate">
                {data.fileName}
              </p>
            </div>
          </div>

          {/* Quick Explanation for Mobile / Iframes */}
          <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              Si tu navegador móvil o modo incógnito bloqueó la descarga automática, usa los botones de abajo:
            </span>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Re-Download Button */}
            <button
              onClick={handleReDownload}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Volver a Descargar {downloadCount > 1 ? `(${downloadCount})` : ''}</span>
            </button>

            {/* Copy to Clipboard Button */}
            <button
              onClick={handleCopy}
              className={`p-3 rounded-xl font-medium text-xs border flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                copied
                  ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                  : 'bg-sky-950/80 hover:bg-sky-900/80 text-sky-200 border-sky-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-400" />
                  <span>Copiar Contenido</span>
                </>
              )}
            </button>

            {/* Open in New Tab (preview) */}
            <button
              onClick={handleOpenInNewTab}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-medium text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm sm:col-span-2"
            >
              <ExternalLink className="w-4 h-4 text-orange-400" />
              <span>Abrir vista previa directa en pestaña nueva</span>
            </button>
          </div>

          {/* Toggle Text Preview */}
          <div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPreview ? 'Ocultar vista previa de texto' : 'Ver contenido del archivo antes de salir'}</span>
            </button>

            {showPreview && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-48 overflow-y-auto">
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap select-all">
                  {data.content.slice(0, 3000)}
                  {data.content.length > 3000 ? '\n\n... [Contenido truncado en la previsualización]' : ''}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-3 sm:p-4 border-t flex items-center justify-end"
          style={{
            borderColor: 'var(--color-sec-30-border, #0d4364)',
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
          >
            Listo, entendido
          </button>
        </div>
      </div>
    </div>
  );
};
