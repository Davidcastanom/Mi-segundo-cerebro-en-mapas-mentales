import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { BrainNodeData, Category, NodeStatus } from '../types';
import { obtenerRazonEfectiva, formatearFechaLegible } from '../utils/textUtils';
import { 
  Instagram, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Share2, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Youtube,
  Calendar,
  Eye,
  CheckSquare,
  Square,
  Tag,
  Plus
} from 'lucide-react';

export type BrainCanvasNodeData = BrainNodeData & {
  category?: Category;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onEdit?: (node: BrainNodeData) => void;
  onDelete?: (id: string) => void;
  onOpenNotionModal?: (node: BrainNodeData) => void;
  onToggleCollapse?: (id: string) => void;
  onViewDetail?: (node: BrainNodeData) => void;
  onUpdateStatus?: (nodeId: string, status: NodeStatus) => void;
  onToggleChecklist?: (nodeId: string, itemId: string) => void;
};

export type CustomNodeProps = NodeProps<Node<BrainCanvasNodeData>>;

export const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  const category = data.category;
  const categoryColor = category?.color || '#64748b';
  const effectiveReason = obtenerRazonEfectiva(data);

  const currentStatus: NodeStatus = data.estado || 'por_aprender';

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: Record<NodeStatus, NodeStatus> = {
      por_aprender: 'en_practica',
      en_practica: 'dominado',
      dominado: 'por_aprender',
    };
    data.onUpdateStatus?.(data.id, nextStatus[currentStatus]);
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'dominado':
        return {
          label: '✓ Dominado',
          classes: 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900',
        };
      case 'en_practica':
        return {
          label: '⚡ En Práctica',
          classes: 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900',
        };
      case 'por_aprender':
      default:
        return {
          label: '○ Por Aprender',
          classes: 'bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-rose-900',
        };
    }
  };

  const statusInfo = getStatusBadge();

  const getIcon = () => {
    if (data.tipo === 'enlace') {
      if (data.plataforma === 'instagram' || data.contenido.includes('instagram.com')) {
        return <Instagram className="w-4 h-4 text-pink-400" />;
      }
      if (data.plataforma === 'youtube' || data.contenido.includes('youtube.com')) {
        return <Youtube className="w-4 h-4 text-red-400" />;
      }
      return <Globe className="w-4 h-4 text-sky-400" />;
    }
    if (data.tipo === 'imagen') {
      return <ImageIcon className="w-4 h-4 text-amber-400" />;
    }
    return <FileText className="w-4 h-4 text-emerald-400" />;
  };

  const getTypeLabel = () => {
    if (data.tipo === 'enlace') {
      return data.plataforma === 'instagram' ? 'Reel' : 'Enlace';
    }
    if (data.tipo === 'imagen') return 'Imagen';
    return 'Nota';
  };

  const isInstagram = data.tipo === 'enlace' && (data.plataforma === 'instagram' || data.contenido.includes('instagram.com'));
  const checklistItems = data.checklist || [];
  const completedChecklistCount = checklistItems.filter((i) => i.completado).length;

  return (
    <div
      className={`relative w-[340px] rounded-2xl border text-slate-100 shadow-xl transition-all duration-200 group font-arial ${
        selected ? 'ring-2 ring-[var(--color-acc-10-primary,#FF4103)] shadow-2xl' : ''
      } ${
        data.isHighlighted 
          ? 'ring-2 ring-[var(--color-acc-10-primary,#FF4103)] scale-[1.02]' 
          : 'hover:border-slate-500'
      } ${
        data.isDimmed ? 'opacity-30 grayscale blur-[0.5px]' : 'opacity-100'
      }`}
      style={{
        backgroundColor: 'var(--color-sec-30-surface, #022436)',
        borderColor: selected ? 'var(--color-acc-10-primary, #FF4103)' : 'var(--color-sec-30-border, #0d4364)',
        boxShadow: selected ? `0 10px 30px -10px var(--color-acc-10-glow, rgba(255, 65, 3, 0.4))` : undefined,
      }}
    >
      {/* Top Handle */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        title="Punto de Conexión: Arriba (Salida / Llegada) - Arrastra para conectar o cambiar"
        className="!w-3.5 !h-3.5 !bg-slate-800 hover:!bg-[var(--color-acc-10-primary,#FF4103)] !border-2 !border-slate-300 hover:!border-white hover:scale-125 transition-all shadow-md cursor-crosshair z-20"
      />
      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        title="Punto de Conexión: Derecha (Salida / Llegada) - Arrastra para conectar o cambiar"
        className="!w-3.5 !h-3.5 !bg-slate-800 hover:!bg-[var(--color-acc-10-primary,#FF4103)] !border-2 !border-slate-300 hover:!border-white hover:scale-125 transition-all shadow-md cursor-crosshair z-20"
      />
      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        title="Punto de Conexión: Abajo (Salida / Llegada) - Arrastra para conectar o cambiar"
        className="!w-3.5 !h-3.5 !bg-slate-800 hover:!bg-[var(--color-acc-10-primary,#FF4103)] !border-2 !border-slate-300 hover:!border-white hover:scale-125 transition-all shadow-md cursor-crosshair z-20"
      />
      {/* Left Handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        title="Punto de Conexión: Izquierda (Salida / Llegada) - Arrastra para conectar o cambiar"
        className="!w-3.5 !h-3.5 !bg-slate-800 hover:!bg-[var(--color-acc-10-primary,#FF4103)] !border-2 !border-slate-300 hover:!border-white hover:scale-125 transition-all shadow-md cursor-crosshair z-20"
      />

      {/* Top Accent Color Bar */}
      <div
        className="h-1.5 w-full rounded-t-2xl"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Card Content Container */}
      <div 
        className="p-4 space-y-3 cursor-pointer"
        onDoubleClick={(e) => {
          e.stopPropagation();
          data.onViewDetail?.(data);
        }}
      >
        {/* Header Row: Category Badge + Type + Status + Actions */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border flex items-center gap-1"
              style={{
                backgroundColor: `${categoryColor}18`,
                borderColor: `${categoryColor}40`,
                color: categoryColor,
              }}
            >
              {category?.nombre || 'General'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              {getIcon()}
              <span>{getTypeLabel()}</span>
            </span>

            {/* Cognitive Mastery Status Pill */}
            <button
              type="button"
              onClick={cycleStatus}
              title="Haz clic para cambiar el estado de dominio: Por Aprender ➔ En Práctica ➔ Dominado"
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${statusInfo.classes}`}
            >
              {statusInfo.label}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onViewDetail?.(data);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-300 transition-colors"
              title="Consultar ficha completa y descargar documento"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onOpenNotionModal?.(data);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition-colors"
              title="Copiar tarjeta enriquecida para Notion"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onEdit?.(data);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
              title="Editar nodo"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDelete?.(data.id);
              }}
              className="p-1 rounded hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Eliminar nodo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title (Athelas serif typography) */}
        <h3 className="font-bold text-slate-100 text-[15px] leading-snug tracking-normal line-clamp-2 font-athelas">
          {data.titulo || 'Sin título'}
        </h3>

        {/* Media or Content Preview */}
        {data.tipo === 'enlace' && (
          <div className="space-y-2">
            {data.imagenUrl && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group/img">
                <img
                  src={data.imagenUrl}
                  alt={data.titulo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                />
                {isInstagram && (
                  <div className="absolute top-2 left-2 bg-pink-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1 font-arial">
                    <Instagram className="w-3 h-3" /> Reel
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl px-2.5 py-1.5">
              <span className="text-xs text-slate-400 truncate max-w-[210px] font-mono">
                {data.contenido}
              </span>
              <a
                href={data.contenido}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium ml-2 shrink-0 font-arial"
              >
                Abrir <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {data.tipo === 'nota' && (
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/70 text-xs text-slate-300 whitespace-pre-line max-h-24 overflow-y-auto leading-relaxed font-arial">
            {data.contenido}
          </div>
        )}

        {data.tipo === 'imagen' && (
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group/img">
            <img
              src={data.contenido || data.imagenUrl}
              alt={data.titulo}
              referrerPolicy="no-referrer"
              className="w-full max-h-36 object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Reason Box: ¿Por qué lo guardé? (Athelas serif typography) */}
        <div 
          className="rounded-xl p-2.5 space-y-1"
          style={{
            backgroundColor: 'var(--color-dom-60-base, #001621)',
            borderColor: 'var(--color-sec-30-border, #0d4364)',
            borderWidth: '1px',
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-arial">
            <span 
              className="flex items-center gap-1 font-semibold"
              style={{ color: 'var(--color-acc-10-primary, #FF4103)' }}
            >
              <Sparkles className="w-3 h-3" />
              ¿Por qué lo guardé?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {data.razonModo === 'manual' ? 'Manual' : 'Automática'}
            </span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed italic font-athelas">
            "{effectiveReason}"
          </p>
        </div>

        {/* Checklist de Pasos Accionables (Siempre visible e interactivo en todos los módulos) */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-2.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pasos Accionables</span>
              <span className="text-[10px] text-slate-500 font-normal">(Checklist)</span>
            </div>
            {checklistItems.length > 0 ? (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                {completedChecklistCount}/{checklistItems.length} ({checklistItems.length > 0 ? Math.round((completedChecklistCount / checklistItems.length) * 100) : 0}%)
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 italic bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800/60">
                Opcional
              </span>
            )}
          </div>

          {/* Barra de progreso de avance del checklist */}
          {checklistItems.length > 0 && (
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
              <div
                className={`h-full transition-all duration-300 ${
                  completedChecklistCount === checklistItems.length
                    ? 'bg-emerald-400'
                    : completedChecklistCount > 0
                    ? 'bg-sky-400'
                    : 'bg-slate-700'
                }`}
                style={{
                  width: `${checklistItems.length > 0 ? Math.round((completedChecklistCount / checklistItems.length) * 100) : 0}%`,
                }}
              />
            </div>
          )}

          {/* Lista de pasos interactiva o botón para definir pasos si no hay ninguno */}
          {checklistItems.length > 0 ? (
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onToggleChecklist?.(data.id, item.id);
                  }}
                  className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 text-slate-300 hover:text-white cursor-pointer transition-colors group/item"
                  title={item.completado ? 'Paso completado (clic para desmarcar)' : 'Clic para marcar paso completado'}
                >
                  <button
                    type="button"
                    className="shrink-0 mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      data.onToggleChecklist?.(data.id, item.id);
                    }}
                  >
                    {item.completado ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-slate-300" />
                    )}
                  </button>
                  <span
                    className={`text-[11px] leading-snug break-words flex-1 ${
                      item.completado ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {item.texto}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                data.onEdit?.(data);
              }}
              className="w-full py-1.5 px-2 rounded-lg border border-dashed border-slate-700/80 hover:border-emerald-500/80 bg-slate-900/40 hover:bg-emerald-950/20 text-slate-400 hover:text-emerald-300 text-[11px] flex items-center justify-center gap-1.5 transition-all"
              title="Añadir pasos prácticos o lista de tareas a este recurso"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Añadir pasos prácticos (checklist)</span>
            </button>
          )}
        </div>

        {/* Sección de Etiquetas (Tags) claramente visible y completa */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            {data.etiquetas && data.etiquetas.length > 0 ? (
              data.etiquetas.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-800/50 text-sky-300 hover:border-sky-500 hover:text-white transition-colors"
                >
                  <Tag className="w-2.5 h-2.5 text-sky-400" />
                  <span>#{tag}</span>
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-500 italic font-mono flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-slate-600" /> Sin etiquetas definidas
              </span>
            )}
          </div>
        </div>

        {/* Tags & Date Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Formatted Date */}
            <span 
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 font-mono text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/70"
              title={`Fecha de creación: ${data.fechaCreacion || 'Hoy'}`}
            >
              <Calendar className="w-2.5 h-2.5 text-sky-400" />
              <span>{formatearFechaLegible(data.fechaCreacion)}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Expand/Collapse Branch Button if this node has connections */}
            {data.hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  data.onToggleCollapse?.(data.id);
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700 transition-colors"
                title={data.isCollapsed ? 'Expandir ramas conectadas' : 'Colapsar ramas conectadas'}
              >
                {data.isCollapsed ? (
                  <>
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>+{data.childrenCount || 1}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 text-amber-400" />
                    <span>Ocultar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
