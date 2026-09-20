import React, { useState } from 'react';
import { 
  Palette60_30_10, 
  PRESET_PALETTES, 
  generarPaletaDesdeDosColores 
} from '../utils/theme';
import { Palette, Check, Sparkles, X, SlidersHorizontal } from 'lucide-react';

interface PaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: Palette60_30_10;
  onSelectPalette: (palette: Palette60_30_10) => void;
}

export const PaletteModal: React.FC<PaletteModalProps> = ({
  isOpen,
  onClose,
  currentPalette,
  onSelectPalette,
}) => {
  const [customColor1, setCustomColor1] = useState(currentPalette.colorA || '#001621');
  const [customColor2, setCustomColor2] = useState(currentPalette.colorB || '#FF4103');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const handleApplyCustom = () => {
    const custom = generarPaletaDesdeDosColores(customColor1, customColor2, 'Personalizada (2 Colores)');
    onSelectPalette(custom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-arial">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-vanguard tracking-wider uppercase">
                Paleta Principal (Regla 60% - 30% - 10%)
              </h2>
              <p className="text-[11px] text-slate-400">
                Armonía cromática dual con variaciones tonales y proporción matemática
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 60-30-10 Proportion Guide Banner */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Distribución en Pantalla:</span>
            <span className="text-sky-400 font-mono text-[10px]">60% / 30% / 10%</span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden flex border border-slate-700/60 shadow-inner">
            <div
              className="h-full transition-all duration-300"
              style={{ width: '60%', backgroundColor: currentPalette.dominant60.base }}
              title="60% Dominante: Fondo y Canvas"
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: '30%', backgroundColor: currentPalette.secondary30.surface }}
              title="30% Secundario: Tarjetas, Menús y Estructura"
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: '10%', backgroundColor: currentPalette.accent10.primary }}
              title="10% Acento: Botones, Conexiones y Foco"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block border border-slate-600" style={{ backgroundColor: currentPalette.dominant60.base }} />
              <strong>60%</strong> Lienzo Base
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block border border-slate-600" style={{ backgroundColor: currentPalette.secondary30.surface }} />
              <strong>30%</strong> Tarjetas y Estructura
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: currentPalette.accent10.primary }} />
              <strong>10%</strong> Acento y Foco
            </span>
          </div>
        </div>

        {/* Palettes List */}
        <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Combinaciones Duales Predefinidas
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {PRESET_PALETTES.map((preset) => {
              const isSelected = currentPalette.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setIsCustomMode(false);
                    onSelectPalette(preset);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/20 ring-1 ring-sky-500/40 shadow-md'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span>{preset.name}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-semibold border border-sky-500/30">
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {preset.description}
                    </p>
                  </div>

                  {/* Swatches preview */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <div
                      className="w-5 h-7 rounded-md border border-slate-700 shadow-sm"
                      style={{ backgroundColor: preset.dominant60.base }}
                      title="60% Dominante"
                    />
                    <div
                      className="w-5 h-7 rounded-md border border-slate-700 shadow-sm"
                      style={{ backgroundColor: preset.secondary30.surface }}
                      title="30% Secundario"
                    />
                    <div
                      className="w-5 h-7 rounded-md shadow-sm"
                      style={{ backgroundColor: preset.accent10.primary }}
                      title="10% Acento"
                    />
                    {isSelected && (
                      <Check className="w-4 h-4 text-sky-400 ml-1.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Dual Colors Generator Accordion */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between w-full py-1 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>¿Tienes dos colores específicos? Personalízalos</span>
              </span>
              <span className="text-[10px] text-sky-400 underline">
                {isCustomMode ? 'Ocultar' : 'Personalizar mis 2 colores'}
              </span>
            </button>

            {isCustomMode && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-[11px] text-slate-400">
                  Ingresa tus dos colores y el sistema generará automáticamente las variaciones exactas 60%, 30% y 10%:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-medium">
                      Color 1: Base / Dominante
                    </label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
                      <input
                        type="color"
                        value={customColor1}
                        onChange={(e) => setCustomColor1(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customColor1}
                        onChange={(e) => setCustomColor1(e.target.value)}
                        className="bg-transparent text-xs text-slate-100 font-mono w-full focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-medium">
                      Color 2: Acento / Foco
                    </label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
                      <input
                        type="color"
                        value={customColor2}
                        onChange={(e) => setCustomColor2(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customColor2}
                        onChange={(e) => setCustomColor2(e.target.value)}
                        className="bg-transparent text-xs text-slate-100 font-mono w-full focus:outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyCustom}
                  className="w-full py-2 rounded-xl text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                    boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aplicar Mis 2 Colores con Proporción 60/30/10</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
