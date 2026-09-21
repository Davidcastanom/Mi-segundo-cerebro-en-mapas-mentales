import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, NodeType, DateFilterType, DateSortType, StatusFilterType } from '../types';
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
  FileDown,
  ChevronDown,
  ChevronUp,
  Globe,
  BookOpen,
  Cloud,
  GraduationCap,
  Command,
  HelpCircle,
  Zap,
  Award,
  Compass,
  SlidersHorizontal,
  Menu,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedType: NodeType | 'todos';
  onSelectType: (type: NodeType | 'todos') => void;
  selectedStatus: StatusFilterType;
  onSelectStatus: (status: StatusFilterType) => void;
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
  onOpenCommandPalette?: () => void;
  onOpenReviewModal?: () => void;
  onOpenDriveModal?: () => void;
  onOpenAspectsHub?: () => void;
  onExportJSON: () => void;
  onExportDocument?: (format: 'md' | 'html') => void;
  onImportJSON: (file: File) => void;
  onResetDemo: () => void;
  nodeCountsByCategory: Record<string, number>;
  totalNodes: number;
  filteredCount: number;
  isDriveSyncing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  selectedStatus,
  onSelectStatus,
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
  onOpenCommandPalette,
  onOpenReviewModal,
  onOpenDriveModal,
  onOpenAspectsHub,
  onExportJSON,
  onExportDocument,
  onImportJSON,
  onResetDemo,
  nodeCountsByCategory,
  totalNodes,
  filteredCount,
  isDriveSyncing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawerFileInputRef = useRef<HTMLInputElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBarCollapsed, setIsBarCollapsed] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDrawerOpen) setIsDrawerOpen(false);
        if (isExportMenuOpen) setIsExportMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, isExportMenuOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  const hasActiveFilters = Boolean(
    selectedCategory !== null ||
    selectedType !== 'todos' ||
    selectedStatus !== 'todos' ||
    selectedDate !== 'todas' ||
    searchQuery.trim().length > 0
  );

  const activeFilterCount = 
    (selectedCategory !== null ? 1 : 0) +
    (selectedType !== 'todos' ? 1 : 0) +
    (selectedStatus !== 'todos' ? 1 : 0) +
    (selectedDate !== 'todas' ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  const clearAllFilters = () => {
    onSelectCategory(null);
    onSelectType('todos');
    onSelectStatus('todos');
    onSelectDate('todas');
    onSearchChange('');
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={drawerFileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          handleFileChange(e);
          setIsDrawerOpen(false);
        }}
        className="hidden"
      />

      {/* FLOATING COMPACT PILL (Visible when menu bar is collapsed) */}
      <AnimatePresence>
        {isBarCollapsed && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 sm:gap-3 font-arial max-w-[96vw] shrink-0"
          >
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
              onClick={() => setIsBarCollapsed(false)}
              title="Restaurar barra completa"
            >
              <Brain className="w-4 h-4 text-white" />
            </div>

            <div 
              className="flex items-center gap-1.5 cursor-pointer shrink-0"
              onClick={() => setIsBarCollapsed(false)}
            >
              <span className="text-xs font-black text-slate-100 font-vanguard uppercase tracking-wider hidden md:inline">
                Segundo Cerebro
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {filteredCount}/{totalNodes}
              </span>
            </div>

            {/* Quick search button (desktop/tablet) */}
            <button
              onClick={() => onOpenCommandPalette?.()}
              className="hidden sm:flex p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs items-center gap-1 transition-colors"
              title="Buscar o comandos (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="hidden md:inline font-mono text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">⌘K</kbd>
            </button>

            {/* Quick Create Node button */}
            <button
              onClick={onOpenCreateModal}
              className="px-2 sm:px-2.5 py-1 rounded-xl text-white text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shrink-0"
              style={{
                backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                boxShadow: '0 2px 8px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
              }}
              title="Crear nuevo nodo"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden xs:inline">Nuevo</span>
            </button>

            {/* PWA Install Button (tablet/desktop in pill) */}
            <div className="hidden sm:inline-flex shrink-0">
              <PWAInstallButton variant="compact" />
            </div>

            {/* Open Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 flex items-center gap-1 transition-colors shrink-0"
              title="Abrir menú dinámico completo"
            >
              <Menu className="w-4 h-4" />
              <span className="text-[11px] hidden md:inline font-medium">Menú</span>
            </button>

            {/* Restore / Expand Bar Button */}
            <button
              onClick={() => setIsBarCollapsed(false)}
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 border border-sky-700/60 text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0"
              title="Expandir barra de menú completa"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expandir</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL TOP BAR (Collapsible with smooth animation) */}
      <AnimatePresence>
        {!isBarCollapsed && (
          <motion.header 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b px-3 sm:px-4 py-2.5 flex flex-col gap-2 shrink-0 z-30 shadow-lg font-arial w-full overflow-hidden"
            style={{
              backgroundColor: 'var(--color-sec-30-surface, #022436)',
              borderColor: 'var(--color-sec-30-border, #0d4364)',
            }}
          >
            {/* Top Main Row */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
              {/* App Title & Brand */}
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-sky-300 border border-slate-700/80 transition-all flex items-center justify-center shrink-0 active:scale-95"
                  title="Abrir menú dinámico de herramientas y navegación"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                    boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.35))',
                  }}
                  onClick={() => onOpenAspectsHub?.()}
                  title="Segundo Cerebro - Centro de Aspectos"
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <h1 className="text-xs sm:text-sm font-black text-slate-100 uppercase tracking-wider sm:tracking-widest leading-none font-vanguard truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                    Segundo Cerebro
                  </h1>
                  <p className="text-[11px] text-slate-400 font-arial leading-tight mt-0.5 hidden lg:block">
                    Organiza enlaces, reels, notas y conecta ramas de aprendizaje
                  </p>
                </div>
              </div>

              {/* Desktop Search Bar with Command Palette trigger */}
              <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative items-center mx-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar o presiona Ctrl+K..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-20 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--color-dom-60-base, #001621)',
                    borderColor: 'var(--color-sec-30-border, #0d4364)',
                    borderWidth: '1px',
                  }}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      onClick={() => onSearchChange('')}
                      className="p-0.5 rounded-full text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onOpenCommandPalette}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-700/80 flex items-center gap-0.5"
                      title="Abrir Command Palette (Ctrl+K)"
                    >
                      <Command className="w-2.5 h-2.5" />
                      <span>K</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Action Controls */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0 flex-nowrap">
                {/* Quick Repaso Activo (Flashcards) */}
                <button
                  onClick={onOpenReviewModal}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-purple-300 hover:text-purple-100 text-xs font-semibold border border-purple-800/70 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm shrink-0"
                  title="Repaso Activo y Tarjetas Flashcards de Estudio"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden lg:inline">Repaso</span>
                </button>

                {/* Google Drive Sync Cloud */}
                <button
                  onClick={onOpenDriveModal}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 shadow-sm shrink-0 ${
                    isDriveSyncing 
                      ? 'bg-sky-950/90 text-sky-300 border-sky-600 animate-pulse' 
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 hover:text-white border-slate-700/80'
                  }`}
                  title="Copia de seguridad y sincronización en Google Drive"
                >
                  <Cloud className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden lg:inline">Drive</span>
                </button>

                {/* PWA Install Button for Web App */}
                <PWAInstallButton className="shrink-0" />

                <button
                  onClick={onAutoLayout}
                  className="px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1 shrink-0"
                  title="Auto-organizar distribución en el lienzo"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden xl:inline">Organizar</span>
                </button>

                <button
                  onClick={onOpenStats}
                  className="px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1 shrink-0"
                  title="Ver métricas de aprendizaje"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline">Métricas</span>
                </button>

                <button
                  onClick={onOpenPalette}
                  className="px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1 shrink-0"
                  title="Personalizar Paleta de Colores (60-30-10)"
                >
                  <div className="flex items-center -space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#001621]" />
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#FF4103]" />
                  </div>
                  <span className="hidden 2xl:inline text-[11px] font-semibold">60/30/10</span>
                </button>

                <button
                  onClick={onOpenManual}
                  className="px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all flex items-center gap-1 hover:border-slate-500 shadow-sm active:scale-95 shrink-0"
                  title="Manual de Instrucciones y Guía de Uso del Sistema"
                >
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden lg:inline text-[11px]">Manual</span>
                </button>

                {/* Export & Download Options */}
                <div className="relative shrink-0" ref={exportMenuRef}>
                  <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                    title="Exportar y descargar notas o respaldo"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline text-[11px]">Descargar</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isExportMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-xl border shadow-2xl py-1.5 z-50 text-xs font-arial animate-in fade-in slide-in-from-top-2"
                      style={{
                        backgroundColor: 'var(--color-sec-30-surface, #022436)',
                        borderColor: 'var(--color-sec-30-border, #0d4364)',
                      }}
                    >
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Exportar Documentación
                      </div>
                      <button
                        onClick={() => {
                          onExportDocument?.('md');
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Notas Markdown (.md)</span>
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
                        Base de Datos Local
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
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors shrink-0"
                  title="Importar respaldo local (JSON)"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                </button>

                <button
                  onClick={onResetDemo}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition-colors shrink-0"
                  title="Restablecer datos de ejemplo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Centralized Aspects Access Button */}
                {onOpenAspectsHub && (
                  <button
                    onClick={onOpenAspectsHub}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
                    title="Centro de Aspectos: Abre el panel integral con todas las herramientas"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px]">Aspectos</span>
                  </button>
                )}

                {/* New Node Button */}
                <button
                  onClick={onOpenCreateModal}
                  className="px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 ml-1 active:scale-95 shrink-0"
                  style={{
                    backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                    boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
                  }}
                  title="Crear nuevo recurso o nota"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Nuevo Nodo</span>
                </button>

                {/* Minimize / Collapse Bar Button */}
                <button
                  onClick={() => setIsBarCollapsed(true)}
                  className="p-1.5 ml-0.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors shrink-0"
                  title="Minimizar barra de menú para pantalla completa del lienzo"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Action Controls (Clean, Compact, No-Overflow) */}
              <div className="flex md:hidden items-center gap-1.5 shrink-0">
                {/* Toggle Search */}
                <button
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className={`p-2 rounded-xl border text-xs transition-colors shrink-0 ${
                    isMobileSearchOpen || searchQuery
                      ? 'bg-sky-950 text-sky-300 border-sky-600'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700'
                  }`}
                  title="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Toggle Filters Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                  className={`p-2 xs:px-2.5 xs:py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors shrink-0 ${
                    hasActiveFilters || isMobileFiltersOpen
                      ? 'bg-sky-950 text-sky-300 border-sky-600 font-semibold'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700'
                  }`}
                  title="Mostrar u ocultar filtros avanzados"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden xs:inline">Filtros</span>
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center ml-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Quick New Node Button */}
                <button
                  onClick={onOpenCreateModal}
                  className="px-2.5 py-1.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shrink-0"
                  style={{
                    backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                    boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
                  }}
                  title="Crear nuevo nodo"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden xs:inline text-[11px]">Nuevo</span>
                </button>

                {/* Minimize Bar Toggle Mobile (Shown on sm+) */}
                <button
                  onClick={() => setIsBarCollapsed(true)}
                  className="hidden sm:flex p-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 shrink-0"
                  title="Minimizar barra"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Search Row (Expands when tapped) */}
            <AnimatePresence>
              {isMobileSearchOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex md:hidden items-center gap-2 pt-1 overflow-hidden"
                >
                  <div className="flex-1 relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar concepto o etiqueta..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      autoFocus
                      className="w-full rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                      style={{
                        backgroundColor: 'var(--color-dom-60-base, #001621)',
                        borderColor: 'var(--color-sec-30-border, #0d4364)',
                        borderWidth: '1px',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenCommandPalette?.()}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-sky-300 border border-slate-700 text-xs font-mono shrink-0 flex items-center gap-1"
                    title="Comandos rápidos"
                  >
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Carousel (Horizontal Smooth Touch Scroll) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 w-full shrink-0 touch-pan-x">
              <button
                onClick={() => onSelectCategory(null)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 ${
                  selectedCategory === null
                    ? 'bg-slate-100 text-slate-900 border-white font-semibold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Todos</span>
                <span className="text-[10px] opacity-75 font-mono">({totalNodes})</span>
              </button>

              {categories.map((cat) => {
                const count = nodeCountsByCategory[cat.id] || 0;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 ${
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

            {/* Mobile Secondary Filters Panel (Collapsible, structured for touch, non-overflowing) */}
            <AnimatePresence>
              {(isMobileFiltersOpen || hasActiveFilters) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex md:hidden flex-col gap-2 pt-1 border-t border-slate-800/80 w-full overflow-hidden"
                >
                  {/* Row 1: Mastery Status */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">Estado:</span>
                    <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 shrink-0">
                      <button
                        onClick={() => onSelectStatus('todos')}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                          selectedStatus === 'todos' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => onSelectStatus('por_aprender')}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedStatus === 'por_aprender' ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800' : 'text-slate-400'
                        }`}
                      >
                        <HelpCircle className="w-3 h-3 text-rose-400" />
                        <span>Aprender</span>
                      </button>
                      <button
                        onClick={() => onSelectStatus('en_practica')}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedStatus === 'en_practica' ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800' : 'text-slate-400'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Práctica</span>
                      </button>
                      <button
                        onClick={() => onSelectStatus('dominado')}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedStatus === 'dominado' ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800' : 'text-slate-400'
                        }`}
                      >
                        <Award className="w-3 h-3 text-emerald-400" />
                        <span>Dominados</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Formats & Dates */}
                  <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                    <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 shrink-0">
                      <button
                        onClick={() => onSelectType('todos')}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                          selectedType === 'todos' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        Formatos
                      </button>
                      <button
                        onClick={() => onSelectType('enlace')}
                        className={`px-1.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedType === 'enlace' ? 'bg-slate-800 text-pink-300' : 'text-slate-400'
                        }`}
                      >
                        <Instagram className="w-3 h-3 text-pink-400" />
                        <span>Reels</span>
                      </button>
                      <button
                        onClick={() => onSelectType('nota')}
                        className={`px-1.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedType === 'nota' ? 'bg-slate-800 text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        <FileText className="w-3 h-3 text-emerald-400" />
                        <span>Notas</span>
                      </button>
                      <button
                        onClick={() => onSelectType('imagen')}
                        className={`px-1.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          selectedType === 'imagen' ? 'bg-slate-800 text-amber-300' : 'text-slate-400'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        <span>Imágenes</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 px-1.5 rounded-xl border border-slate-800 shrink-0">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      <select
                        value={selectedDate}
                        onChange={(e) => onSelectDate(e.target.value as DateFilterType)}
                        className="bg-slate-900 text-slate-200 text-[11px] font-medium rounded-lg px-1.5 py-0.5 border border-slate-700/80 focus:outline-none"
                      >
                        <option value="todas">Todas</option>
                        <option value="hoy">Hoy</option>
                        <option value="7dias">7 días</option>
                        <option value="30dias">30 días</option>
                        <option value="esteMes">Este mes</option>
                      </select>
                      <button
                        onClick={() => onSelectDateSort(selectedDateSort === 'recientes' ? 'antiguos' : 'recientes')}
                        className={`p-1 rounded-lg text-[11px] border border-slate-800 ${
                          selectedDateSort === 'recientes' ? 'bg-slate-800 text-sky-300' : 'text-slate-400'
                        }`}
                        title="Ordenar por fecha"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-2 py-1 rounded-xl text-[10px] font-medium bg-red-950/60 text-red-300 border border-red-800/60 flex items-center gap-1 shrink-0"
                      >
                        <X className="w-3 h-3" />
                        <span>Limpiar</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Filters Bar (Secondary filters in single desktop row) */}
            <div className="hidden md:flex items-center justify-end gap-2.5 overflow-x-auto no-scrollbar pt-0.5 text-xs w-full">
              {/* Cognitive Mastery Status Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => onSelectStatus('todos')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                    selectedStatus === 'todos'
                      ? 'bg-slate-800 text-slate-100 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Todos los estados cognitivos"
                >
                  Todos
                </button>
                <button
                  onClick={() => onSelectStatus('por_aprender')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    selectedStatus === 'por_aprender'
                      ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Filtrar por aprender"
                >
                  <HelpCircle className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">Por Aprender</span>
                  <span className="sm:hidden">Aprender</span>
                </button>
                <button
                  onClick={() => onSelectStatus('en_practica')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    selectedStatus === 'en_practica'
                      ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Filtrar en práctica"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">En Práctica</span>
                  <span className="sm:hidden">Práctica</span>
                </button>
                <button
                  onClick={() => onSelectStatus('dominado')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    selectedStatus === 'dominado'
                      ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Filtrar dominados"
                >
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>Dominados</span>
                </button>
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
                  Formatos
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
                  <span>Reels</span>
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
                  <span>Notas</span>
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
                  <span>Imágenes</span>
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
                  <option value="todas">Todas</option>
                  <option value="hoy">Hoy</option>
                  <option value="7dias">7 días</option>
                  <option value="30dias">30 días</option>
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
                  <span>Limpiar ({filteredCount}/{totalNodes})</span>
                </button>
              )}
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* DYNAMIC SLIDE-OVER DRAWER MENU */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end font-arial">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Offcanvas Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full max-w-sm sm:max-w-md h-full flex flex-col shadow-2xl border-l z-10 overflow-hidden"
              style={{
                backgroundColor: 'var(--color-sec-30-surface, #022436)',
                borderColor: 'var(--color-sec-30-border, #0d4364)',
              }}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }}
                  >
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white font-vanguard uppercase tracking-wider">
                      Menú del Segundo Cerebro
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Navegación dinámica y herramientas del sistema
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {/* Search Bar in Drawer */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar recurso o presiona ⌘K..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                    style={{
                      backgroundColor: 'var(--color-dom-60-base, #001621)',
                      borderColor: 'var(--color-sec-30-border, #0d4364)',
                      borderWidth: '1px',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Primary Actions Grid */}
                {/* PWA Mobile App Download Banner */}
                <PWAInstallButton variant="banner" />

                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Acciones Rápidas
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenCreateModal();
                      }}
                      className="p-3 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                        boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
                      }}
                    >
                      <Plus className="w-5 h-5 stroke-[3]" />
                      <span>Nuevo Nodo</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenAspectsHub?.();
                      }}
                      className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-sky-300 hover:text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    >
                      <Compass className="w-5 h-5 text-sky-400" />
                      <span>Centro Aspectos</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenReviewModal?.();
                      }}
                      className="p-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/70 text-purple-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      <span>Repaso Activo</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenDriveModal?.();
                      }}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        isDriveSyncing 
                          ? 'bg-sky-950 text-sky-300 border-sky-600 animate-pulse'
                          : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-sky-300'
                      }`}
                    >
                      <Cloud className="w-5 h-5 text-sky-400" />
                      <span>Google Drive</span>
                    </button>
                  </div>
                </div>

                {/* Workspace Tools */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Herramientas de Estudio
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 divide-y divide-slate-800/70 overflow-hidden">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onAutoLayout();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutGrid className="w-4 h-4 text-sky-400" />
                        <span className="font-medium">Auto-organizar Lienzo</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Distribución inteligente</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenStats();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <BarChart2 className="w-4 h-4 text-amber-400" />
                        <span className="font-medium">Métricas de Aprendizaje</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Progreso y dominio</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenPalette?.();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center -space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#001621]" />
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-900 bg-[#FF4103]" />
                        </div>
                        <span className="font-medium">Paleta 60-30-10</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Colores del sistema</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenManual?.();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-orange-400" />
                        <span className="font-medium">Guía y Manual de Uso</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Instrucciones</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenCommandPalette?.();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Command className="w-4 h-4 text-sky-400" />
                        <span className="font-medium">Paleta de Comandos</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Ctrl+K</span>
                    </button>
                  </div>
                </div>

                {/* Backups and Exports */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Exportación y Respaldo
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 divide-y divide-slate-800/70 overflow-hidden">
                    <button
                      onClick={() => {
                        onExportDocument?.('md');
                        setIsDrawerOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Descargar Markdown (.md)</span>
                    </button>
                    <button
                      onClick={() => {
                        onExportDocument?.('html');
                        setIsDrawerOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Descargar Dossier Web (.html)</span>
                    </button>
                    <button
                      onClick={() => {
                        onExportJSON();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copia de seguridad (.json)</span>
                    </button>
                    <button
                      onClick={() => drawerFileInputRef.current?.click()}
                      className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-sky-400" />
                      <span>Importar archivo JSON local</span>
                    </button>
                    <button
                      onClick={() => {
                        onResetDemo();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-300 hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span>Restablecer datos demo</span>
                    </button>
                  </div>
                </div>

                {/* Category Directory */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Categorías Temáticas
                    </span>
                    <button
                      onClick={() => {
                        onSelectCategory(null);
                        setIsDrawerOpen(false);
                      }}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Ver todas ({totalNodes})
                    </button>
                  </div>
                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const count = nodeCountsByCategory[cat.id] || 0;
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(isSelected ? null : cat.id);
                            setIsDrawerOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between border transition-all text-left ${
                            isSelected 
                              ? 'bg-slate-800 border-sky-500 font-semibold text-white' 
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: cat.color }} 
                            />
                            <span>{cat.nombre}</span>
                          </div>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsBarCollapsed(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Modo Pantalla Completa</span>
                </button>
                <div className="text-[10px] text-slate-500 font-mono">
                  {filteredCount}/{totalNodes} nodos
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
