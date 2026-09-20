import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Link2, 
  MousePointer, 
  Sparkles, 
  Layers, 
  Search, 
  Download, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  FileText,
  Sliders,
  Palette
} from 'lucide-react';

interface InstructionManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ManualSectionId = 
  | 'conexiones' 
  | 'nodos' 
  | 'navegacion' 
  | 'filtros' 
  | 'exportacion' 
  | 'colores' 
  | 'atajos';

interface SectionTab {
  id: ManualSectionId;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionTab[] = [
  { id: 'conexiones', title: '1. Puntos de Conexión y Reconexión', shortTitle: 'Conexiones', icon: Link2 },
  { id: 'nodos', title: '2. Creación y Edición de Nodos', shortTitle: 'Nodos', icon: Sparkles },
  { id: 'navegacion', title: '3. Navegación en el Lienzo', shortTitle: 'Lienzo', icon: Layers },
  { id: 'filtros', title: '4. Búsqueda y Filtros', shortTitle: 'Filtros', icon: Search },
  { id: 'exportacion', title: '5. Exportación y Notion', shortTitle: 'Exportar', icon: Download },
  { id: 'colores', title: '6. Regla 60-30-10 y Estilo', shortTitle: 'Colores', icon: Palette },
  { id: 'atajos', title: '7. Tabla Rápida de Atajos', shortTitle: 'Atajos', icon: MousePointer },
];

export const InstructionManualModal: React.FC<InstructionManualModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<ManualSectionId>('conexiones');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-hidden font-arial animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          backgroundColor: 'var(--color-sec-30-surface, #022436)',
          borderColor: 'var(--color-sec-30-border, #0d4364)',
        }}
      >
        {/* Top Accent Line */}
        <div 
          className="h-1.5 w-full shrink-0" 
          style={{ backgroundColor: 'var(--color-acc-10-primary, #FF4103)' }} 
        />

        {/* Modal Header */}
        <div 
          className="px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{
                backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
                boxShadow: '0 4px 14px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
              }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-vanguard flex items-center gap-2">
                Manual de Instrucciones • Guía de Uso
              </h2>
              <p className="text-xs text-slate-300">
                Aprende a dominar cada función de tu Segundo Cerebro interactivo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div 
          className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto shrink-0 scrollbar-none"
          style={{
            backgroundColor: 'var(--color-dom-60-base, #001621)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          {SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--color-acc-10-primary, #FF4103)' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px var(--color-acc-10-glow, rgba(255, 65, 3, 0.3))' : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-200 text-sm">
          {/* SECTION 1: CONEXIONES */}
          {activeSection === 'conexiones' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Link2 className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  1. Puntos de Conexión y Cómo Cambiar Salida / Conexión de Forma Manual
                </h3>
              </div>

              {/* Graphic Schema of 4 Points */}
              <div 
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: 'var(--color-dom-60-base, #001621)',
                  borderColor: 'var(--color-sec-30-border, #0d4364)',
                }}
              >
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Los 4 Puntos Cardinales en Cada Cuadro</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cada cuadro cuenta con <strong>4 puntos de conexión</strong> ubicados en sus extremos:
                  <strong> Arriba (Top)</strong>, <strong>Derecha (Right)</strong>, <strong>Abajo (Bottom)</strong> e <strong>Izquierda (Left)</strong>. 
                  Todos los puntos son <em>bidireccionales</em>: admiten tanto iniciar una conexión (punto de salida) como recibirla (punto de llegada).
                </p>

                {/* Visual Representation */}
                <div className="relative w-64 h-36 mx-auto rounded-xl border border-slate-700 bg-slate-900/90 flex flex-col items-center justify-center p-3 shadow-inner my-2">
                  {/* Top */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md animate-pulse" />
                    <span className="text-[9px] font-bold text-orange-400 mt-0.5">Arriba</span>
                  </div>
                  {/* Bottom */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[9px] font-bold text-orange-400 mb-0.5">Abajo</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md" />
                  </div>
                  {/* Left */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md" />
                    <span className="text-[9px] font-bold text-orange-400 ml-1">Izq.</span>
                  </div>
                  {/* Right */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-[9px] font-bold text-orange-400 mr-1">Der.</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md" />
                  </div>

                  <span className="text-xs font-bold text-slate-100 font-athelas text-center">
                    Cualquier Tarjeta de Conocimiento
                  </span>
                  <span className="text-[10px] text-slate-400">4 puntos de conexión activos</span>
                </div>
              </div>

              {/* Step by Step on changing connections manually */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: Interactive Canvas Drag */}
                <div 
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: 'rgba(0, 22, 33, 0.4)',
                    borderColor: 'var(--color-sec-30-border, #0d4364)',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <MousePointer className="w-4 h-4" />
                    <span>Método 1: Arrastrar en el Lienzo (Reconexión Directa)</span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>Coloca el cursor sobre el <strong>extremo de la flecha</strong> que deseas reubicar.</li>
                    <li>Haz <strong>clic y mantén presionado</strong> para despegar el extremo de la conexión.</li>
                    <li>Arrastra el puntero hacia cualquiera de los <strong>4 puntos</strong> (Arriba, Abajo, Izquierda o Derecha) del nodo y suelta el clic.</li>
                    <li>¡Listo! La flecha se anclará automáticamente al nuevo punto elegido.</li>
                  </ol>
                </div>

                {/* Method 2: Manual Modal Selector */}
                <div 
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: 'rgba(0, 22, 33, 0.4)',
                    borderColor: 'var(--color-sec-30-border, #0d4364)',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
                    <Sliders className="w-4 h-4" />
                    <span>Método 2: Selector en el Editor de Conexión</span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>Haz <strong>clic sobre la línea de la flecha</strong> o su etiqueta en el lienzo.</li>
                    <li>Se abrirá la ventana emergente <em>«Editar Conexión y Puntos de Salida / Conexión»</em>.</li>
                    <li>En el panel de botones, selecciona el <strong>Punto de Salida</strong> (Arriba, Derecha, Abajo, Izquierda) y el <strong>Punto de Llegada</strong>.</li>
                    <li>Haz clic en <strong>Guardar Conexión</strong>. La línea cambiará de inmediato.</li>
                  </ol>
                </div>
              </div>

              {/* Labels & Deletion */}
              <div 
                className="p-3.5 rounded-xl border flex items-start gap-3 text-xs text-slate-300"
                style={{
                  backgroundColor: 'var(--color-dom-60-base, #001621)',
                  borderColor: 'var(--color-sec-30-border, #0d4364)',
                }}
              >
                <HelpCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-200">Etiquetas y eliminación de relaciones:</span>
                  <p>
                    Puedes asignar significado a cualquier flecha (ej. <em>«es prerrequisito de»</em>, <em>«ejemplo de»</em>, <em>«se relaciona con»</em>).
                    Para borrar una conexión, selecciónala y pulsa la tecla <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Supr</kbd> o abre su editor y pulsa <strong>«Eliminar Conexión»</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CREACIÓN Y EDICIÓN DE NODOS */}
          {activeSection === 'nodos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Sparkles className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  2. Creación y Edición de Nodos de Conocimiento
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-sky-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Notas Personales
                  </span>
                  <p className="text-slate-300">
                    Soporta formato <strong>Markdown completo</strong>: títulos, listas con casillas, citas, negritas y bloques de código.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Link2 className="w-4 h-4" /> Enlaces y Redes
                  </span>
                  <p className="text-slate-300">
                    Guarda publicaciones de Instagram, videos de YouTube o artículos de la web con detección automática de plataforma y miniaturas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Imágenes Visuales
                  </span>
                  <p className="text-slate-300">
                    Agrega capturas de esquemas, paletas o diagramas directamente mediante URL para estudio gráfico.
                  </p>
                </div>
              </div>

              {/* ¿Por qué lo guardé? Box */}
              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: 'var(--color-dom-60-base, #001621)',
                  borderColor: 'var(--color-sec-30-border, #0d4364)',
                }}
              >
                <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }}>
                  <Sparkles className="w-4 h-4" />
                  <span>El Campo Fundamental: «¿Por qué lo guardé?» (Razón de Aprendizaje)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para evitar acumular enlaces que nunca revisas, cada recurso incluye una sección obligatoria de síntesis cognitiva:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-2">
                  <li><strong>Modo Manual</strong>: Escribes con tus propias palabras qué concepto aprendiste y cómo planeas aplicarlo en tus proyectos.</li>
                  <li><strong>Modo Automático</strong>: Genera una síntesis instantánea y contextual basada en el tipo de contenido y etiquetas del recurso.</li>
                </ul>
              </div>

              {/* Node Inspection */}
              <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/40 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white">Inspección a fondo (Doble Clic):</span>
                <p>
                  Haz <strong>doble clic</strong> sobre cualquier cuadro para abrir la <em>Ficha Exhaustiva</em>: podrás leer el documento en Markdown, previsualizar la página en HTML enriquecido y descargar el archivo individualmente.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: NAVEGACIÓN EN EL LIENZO */}
          {activeSection === 'navegacion' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Layers className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  3. Navegación en el Lienzo Infinito
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white">Desplazamiento y Zoom:</span>
                  <p className="text-slate-300">
                    Haz clic y arrastra sobre el fondo vacío para moverte. Utiliza la rueda del ratón o los botones <strong>[+]</strong> y <strong>[-]</strong> del control inferior para acercarte o alejarte.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white">Minimapa de Orientación:</span>
                  <p className="text-slate-300">
                    La esquina inferior derecha muestra un minimapa en vivo coloreado por categorías para saber siempre en qué zona de tu cerebro te encuentras.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white">Auto-Alinear Grafo:</span>
                  <p className="text-slate-300">
                    En la barra superior, pulsa el botón con icono de cuadrícula para ordenar todos los nodos en una cascada geométrica limpia automáticamente.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white">Colapso de Ramas Dependientes:</span>
                  <p className="text-slate-300">
                    Si un nodo tiene nodos hijos conectados, pulsa su botón de colapsar para ocultar temporalmente sus ramas y despejar el área de estudio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BÚSQUEDA Y FILTROS */}
          {activeSection === 'filtros' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Search className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  4. Búsqueda en Tiempo Real, Filtros y Estadísticas
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  La barra superior te permite filtrar al instante tu red cognitiva sin perder el contexto espacial:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><strong>Búsqueda instantánea</strong>: Escribe cualquier palabra clave; el sistema buscará en títulos, notas, enlaces y razones de estudio. Los nodos coincidentes se resaltarán y los demás se atenuarán suavemente.</li>
                  <li><strong>Filtro por Categorías</strong>: Haz clic en las etiquetas de categoría (Inglés, Photoshop, Programación, Gestión, etc.) para aislar un área de estudio.</li>
                  <li><strong>Filtro por Tipo</strong>: Filtra por Notas, Enlaces o Imágenes.</li>
                  <li><strong>Filtro por Fecha</strong>: Selecciona Hoy, Últimos 7 días, Últimos 30 días o Este mes.</li>
                  <li><strong>Cajón de Métricas y Estadísticas</strong>: Pulsa el icono de gráfico de barras en la cabecera para ver el total de nodos, densidad de aristas y distribución por categorías.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 5: EXPORTACIÓN Y NOTION */}
          {activeSection === 'exportacion' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Download className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  5. Dossiers Descargables, Respaldo JSON y Tarjetas Notion
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-amber-400" /> Respaldo JSON
                  </span>
                  <p className="text-slate-300">
                    Descarga una copia completa de tus nodos y conexiones. Con el botón de importar puedes restaurar o migrar tu cerebro a otro dispositivo sin perder datos.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-400" /> Dossier Markdown / HTML
                  </span>
                  <p className="text-slate-300">
                    Exporta todo tu árbol de conocimiento en un documento continuo estructurado por categorías con enlaces, citas y tablas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" /> Simulador Notion
                  </span>
                  <p className="text-slate-300">
                    En cada cuadro pulsa el icono de Notion para previsualizar y descargar la tarjeta Open Graph (1200 × 630 px) lista para compartir en redes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: COLORES Y ESTILO */}
          {activeSection === 'colores' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <Palette className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  6. Sistema Visual: Regla Matemática 60% - 30% - 10%
                </h3>
              </div>

              <div 
                className="p-4 rounded-xl border space-y-3 text-xs"
                style={{
                  backgroundColor: 'var(--color-dom-60-base, #001621)',
                  borderColor: 'var(--color-sec-30-border, #0d4364)',
                }}
              >
                <p className="text-slate-300 leading-relaxed">
                  La aplicación implementa una arquitectura cromática calculada para máxima concentración y descanso visual:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg border border-slate-800 bg-[#001621] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                      <span>60% Dominante</span>
                      <span className="font-mono text-[10px] text-slate-400">#001621</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Fondo abisal infinito del lienzo que reduce la fatiga visual.</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-[#022436] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                      <span>30% Secundario</span>
                      <span className="font-mono text-[10px] text-slate-400">#022436</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Tarjetas de nodos, modales, bordes y barras de herramientas.</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-[#001621] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-orange-400">
                      <span>10% Acento Fuego</span>
                      <span className="font-mono text-[10px] text-orange-300">#FF4103</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Botón `+ Nuevo Nodo`, conexiones activas y puntos destacados.</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic pt-1">
                  💡 Puedes abrir el botón <strong>«60/30/10»</strong> en la barra superior para cambiar a otros presets o ingresar tus dos colores favoritos para recalcular automáticamente las proporciones.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 7: ATAJOS */}
          {activeSection === 'atajos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-sec-30-border, #0d4364)' }}>
                <MousePointer className="w-5 h-5" style={{ color: 'var(--color-acc-10-primary, #FF4103)' }} />
                <h3 className="text-base font-bold text-white font-vanguard">
                  7. Tabla Rápida de Atajos y Acciones
                </h3>
              </div>

              <div className="rounded-xl border border-slate-700 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 font-bold">
                      <th className="py-2.5 px-3">Acción</th>
                      <th className="py-2.5 px-3">Gesto / Tecla</th>
                      <th className="py-2.5 px-3">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Conectar 2 cuadros</td>
                      <td className="py-2 px-3">Arrastrar de un punto a otro</td>
                      <td className="py-2 px-3">Crea una flecha con etiqueta</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-orange-300">Cambiar punto de salida/llegada</td>
                      <td className="py-2 px-3">Arrastrar extremo o clic en flecha</td>
                      <td className="py-2 px-3">Cambia a Arriba, Derecha, Abajo o Izq.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Ver Ficha Completa</td>
                      <td className="py-2 px-3">Doble clic en un cuadro</td>
                      <td className="py-2 px-3">Abre documento Markdown / HTML</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Eliminar nodo o flecha</td>
                      <td className="py-2 px-3">Seleccionar + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Supr</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Backspace</kbd></td>
                      <td className="py-2 px-3">Borra el elemento seleccionado</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Zoom in / Zoom out</td>
                      <td className="py-2 px-3">Rueda del ratón o botones +/-</td>
                      <td className="py-2 px-3">Acerca o aleja el lienzo</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-semibold text-white">Desplazar lienzo</td>
                      <td className="py-2 px-3">Clic y arrastrar fondo vacío</td>
                      <td className="py-2 px-3">Navega libremente por el espacio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="px-5 py-3 border-t flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--color-sec-30-surface, #022436)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
          }}
        >
          <span className="text-xs text-slate-400">
            Consejo: Haz clic sobre cualquier flecha para reconfigurar sus 4 puntos de salida y llegada.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95"
            style={{
              backgroundColor: 'var(--color-acc-10-primary, #FF4103)',
              boxShadow: '0 4px 12px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))',
            }}
          >
            Entendido, volver al Lienzo
          </button>
        </div>
      </div>
    </div>
  );
};
