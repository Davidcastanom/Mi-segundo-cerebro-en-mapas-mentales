import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error crítico:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetApp = () => {
    window.location.reload();
  };

  private handleClearStorageAndReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k));
        });
      }
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#001621] text-slate-100 p-6 font-arial select-none">
          <div className="max-w-md w-full bg-[#022436] border border-[#0d4364] rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF4103]/15 border border-[#FF4103]/40 flex items-center justify-center text-[#FF4103]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-vanguard text-white tracking-wide">
                Mi Segundo Cerebro
              </h2>
              <p className="text-xs text-slate-300">
                Se detectó una discrepancia en la memoria temporal o caché. Puedes restaurar la vista inmediatamente.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#001621] border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-rose-300/90 overflow-x-auto max-h-32">
                {this.state.error.message || 'Error desconocido'}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleResetApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF4103] hover:bg-[#ff5c26] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar Aplicación</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearStorageAndReset}
                className="w-full py-2 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Restaurar datos limpios</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
