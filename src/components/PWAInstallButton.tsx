import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share, PlusSquare, CheckCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'button' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'button' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Si ya está instalado en el dispositivo y ejecutándose como PWA standalone, no molestar al usuario
  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Navegadores desktop o Android donde beforeinstallprompt aún no disparó
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={handleAction}
          title="Descargar e instalar en tu celular"
          className={`p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center justify-center ${className}`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      ) : variant === 'banner' ? (
        <div className={`p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-100 block font-semibold">Instalar en tu Celular (App Web)</strong>
              <span className="text-slate-400 text-[11px]">Acceso rápido sin barra de navegador y disponible en tu pantalla de inicio</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAction}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAction}
          className={`px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isInstalling ? 'Instalando...' : 'Descargar App'}</span>
        </button>
      )}

      {/* Modal Guía de Instalación Móvil (iOS Safari & Navegadores) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <Smartphone className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-100">Cómo descargar en tu Celular</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Esta aplicación está configurada como una <strong className="text-white">Aplicación Web Progresiva (PWA)</strong> instalable. Para añadirla a tu pantalla de inicio:
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200 block">En iPhone / iPad (Safari):</span>
                    <span className="text-slate-400">
                      Toca el botón <Share className="w-3 h-3 inline text-sky-400 mx-0.5" /> <strong className="text-slate-300">Compartir</strong> en la barra inferior de Safari.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="text-slate-400">
                      Baja en el menú y presiona <PlusSquare className="w-3 h-3 inline text-emerald-400 mx-0.5" /> <strong className="text-slate-300">"Añadir a la pantalla de inicio"</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200 block">En Android (Chrome):</span>
                    <span className="text-slate-400">
                      Toca los tres puntos (⋮) arriba a la derecha y selecciona <strong className="text-slate-300">"Instalar aplicación"</strong> o <strong className="text-slate-300">"Añadir a pantalla principal"</strong>.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px]">
                  Al abrirla desde tu pantalla de inicio, se ejecutará en pantalla completa sin barra de direcciones, como una app nativa.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
