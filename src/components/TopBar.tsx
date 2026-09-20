import React, { useState, useRef, useEffect } from 'react';
import { Category, NodeType, DateFilterType, DateSortType } from '../types';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  BarChart2, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  Brain, 
  Layers, 
  Instagram, 
  FileText, 
  Image as ImageIcon,
  Calendar,
  ArrowUpDown,
  Filter,
  FileDown,
  ChevronDown,
  Globe,
  Palette,
  BookOpen
} from 'lucide-react';

interface TopBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedType: NodeType | 'todos';
  onSelectType: (type: NodeType | 'todos') => void;
  selectedDate: DateFilterType;
  onSelectDate: (filter: DateFilterType) => void;
  selectedDateSort: DateSortType;
  onSelectDateSort: (sort: DateSortType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onAutoLayout: () => void;
  onOpenStats: () => void;
  onOpenPalette?: () => void;
  onOpenManual?: () => void;
  onExportJSON: () => void;
  onExportDocument?: (format: 'md' | 'html') => void;
  onImportJSON: (file: File) => void;
  onResetDemo: () => void;
  nodeCountsByCategory: Record<string, number>;
  totalNodes: number;
  filteredCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  selectedDate,
  onSelectDate,
  selectedDateSort,
  onSelectDateSort,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onAutoLayout,
  onOpenStats,
  onOpenPalette,
  onOpenManual,
  onExportJSON,
  onExportDocument,
  onImportJSON,
  onResetDemo,
  nodeCountsByCategory,
  totalNodes,
  filteredCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    selectedType !== 'todos' ||
    selectedDate !== 'todas' ||
    searchQuery.trim().length > 0
  );

  const clearAllFilters = () => {
    onSelectCategory(null);
    onSelectType('todos');
    onSelectDate('todas');
    onSearchChange('');
  };

  return (
    <header 
      className="border-b backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 flex flex-col gap-2.5 font-arial transition-colors duration-200 shadow-md"
      style={{
        backgroundColor: 'var(--color-sec-30-surface, #022436)',
        borderColor: 'var(--color-sec-30-border, #0d4364)',
      }}
    >
      {/* Top Row: Brand, Search, Core Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--color-acc-10-primary, #FF4103) 0%, #b82a00 100%)',
              boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
            }}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-100 tracking-wide flex items-center gap-1.5 font-vanguard uppercase">
              Mi Segundo Cerebro
              <span 
                className="hidden sm:inline-block text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border tracking-normal normal-case"
                style={{
                  backgroundColor: 'rgba(255, 65, 3, 0.12)',
                  borderColor: 'rgba(255, 65, 3, 0.35)',
                  color: 'var(--color-acc-10-primary, #FF4103)',
                }}
              >
                Bitácora Visual
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block font-arial">
              Organiza enlaces, reels, notas y conecta ramas de aprendizaje
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por tema, palabra, razón o #etiqueta..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--color-dom-60-base, #001621)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
              borderWidth: '1px',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onAutoLayout}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1.5"
            title="Auto-organizar distribución en el lienzo"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Organizar</span>
          </button>

          <button
            onClick={onOpenStats}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1.5"
            title="Ver métricas de aprendizaje"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Métricas</span>
          </button>

          <button
            onClick={onOpenPalette}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1.5"
            title="Personalizar Paleta de Colores (60% Dominante - 30% Secundario - 10% Acento)"
          >
            <div className="flex items-center -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#001621]" title="60% #001621" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#FF4103]" title="10% #FF4103" />
            </div>
            <span className="hidden xl:inline text-[11px] font-semibold">60/30/10</span>
          </button>

          <button
            onClick={onOpenManual}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all flex items-center gap-1.5 hover:border-slate-500 shadow-sm active:scale-95"
            title="Manual de Instrucciones y Guía de Uso del Sistema"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline text-[11px]">Manual de Uso</span>
          </button>

          {/* Export & Download Options */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
              title="Descargar documento o respaldo"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline text-[11px]">Descargar</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Documento Completo
                </div>
                <button
                  onClick={() => {
                    onExportDocument?.('md');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Dossier Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    onExportDocument?.('html');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dossier Web (.html)</span>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Base de Datos
                </div>
                <button
                  onClick={() => {
                    onExportJSON();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copia de seguridad (.json)</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Importar respaldo (JSON)"
          >
            <Upload className="w-4 h-4 text-sky-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={onResetDemo}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Restablecer datos de ejemplo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 ml-1 active:scale-95"
            style={{
              backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
              boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
            }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo Nodo</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Category and Type Filter Pills */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pt-1 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
              selectedCategory === null
                ? 'bg-slate-100 text-slate-900 border-white font-semibold'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Todos los temas</span>
            <span className="text-[10px] opacity-75 font-mono">({totalNodes})</span>
          </button>

          {categories.map((cat) => {
            const count = nodeCountsByCategory[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'ring-2 text-slate-100 font-semibold shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  borderColor: isSelected ? cat.color : undefined,
                  backgroundColor: isSelected ? `${cat.color}25` : undefined,
                  color: isSelected ? '#ffffff' : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.nombre}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => onSelectType('todos')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
              selectedType === 'todos'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onSelectType('enlace')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
              selectedType === 'enlace'
                ? 'bg-slate-800 text-pink-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Instagram className="w-3 h-3 text-pink-400" />
            Reels
          </button>
          <button
            onClick={() => onSelectType('nota')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
              selectedType === 'nota'
                ? 'bg-slate-800 text-emerald-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3 h-3 text-emerald-400" />
            Notas
          </button>
          <button
            onClick={() => onSelectType('imagen')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
              selectedType === 'imagen'
                ? 'bg-slate-800 text-amber-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-amber-400" />
            Imágenes
          </button>
        </div>

        {/* Date Filter & Sorting Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-0.5 px-1.5 rounded-xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-sky-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Fecha:</span>
          </div>
          <select
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value as DateFilterType)}
            className="bg-slate-900 text-slate-200 text-[11px] font-medium rounded-lg px-2 py-0.5 border border-slate-700/80 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="todas">Todas las fechas</option>
            <option value="hoy">Creados hoy</option>
            <option value="7dias">Últimos 7 días</option>
            <option value="30dias">Últimos 30 días</option>
            <option value="esteMes">Este mes</option>
          </select>

          <button
            onClick={() => onSelectDateSort(selectedDateSort === 'recientes' ? 'antiguos' : 'recientes')}
            className={`px-1.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 border border-slate-800 ${
              selectedDateSort === 'recientes'
                ? 'bg-slate-800 text-sky-300'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title={`Orden por fecha: ${selectedDateSort === 'recientes' ? 'Más recientes primero' : 'Más antiguos primero'}`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span className="hidden md:inline">{selectedDateSort === 'recientes' ? 'Recientes' : 'Antiguos'}</span>
          </button>
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-2 py-1 rounded-xl text-[11px] font-medium bg-red-950/50 text-red-300 hover:bg-red-900/60 border border-red-800/60 transition-colors flex items-center gap-1 shrink-0 ml-auto"
            title="Restablecer todos los filtros"
          >
            <X className="w-3 h-3" />
            <span>Limpiar filtros ({filteredCount}/{totalNodes})</span>
          </button>
        )}
      </div>
    </header>
  );
};
