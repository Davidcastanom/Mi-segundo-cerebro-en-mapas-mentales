export type NodeType = 'enlace' | 'nota' | 'imagen';
export type NodeStatus = 'por_aprender' | 'en_practica' | 'dominado';

export interface ChecklistItem {
  id: string;
  texto: string;
  completado: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  color: string; // Tailwind or Hex color
  bgLight: string;
  borderColor: string;
  textColor: string;
  iconName?: string;
}

export interface BrainNodeData {
  id: string;
  tipo: NodeType;
  titulo: string;
  contenido: string; // URL para enlace/imagen, o texto/markdown para nota
  categoriaId: string;
  etiquetas: string[];
  fechaCreacion: string;
  
  // Estado de dominio cognitivo
  estado?: NodeStatus; // 'por_aprender' | 'en_practica' | 'dominado'
  
  // Lista de verificación práctica / pasos accionables
  checklist?: ChecklistItem[];

  // Razón / Motivo de guardado (Requisito 10 y 11 del usuario)
  razonModo: 'manual' | 'automatico';
  razonManual?: string;
  razonCalculada?: string; // Cache o derivada
  
  // Metadatos adicionales para enlace
  urlOriginal?: string;
  plataforma?: 'instagram' | 'youtube' | 'web' | 'otro';
  
  // Imagen de apoyo o miniatura
  imagenUrl?: string;
  
  // Estado de colapso de ramas conectadas
  isCollapsed?: boolean;
  hasChildren?: boolean;
  childrenCount?: number;
  
  [key: string]: unknown;
}

export type DateFilterType = 'todas' | 'hoy' | '7dias' | '30dias' | 'esteMes';
export type DateSortType = 'recientes' | 'antiguos';
export type StatusFilterType = 'todos' | NodeStatus;

export interface BrainEdgeData {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  etiqueta?: string;
}

export interface FilterState {
  busqueda: string;
  categoriaId: string | null;
  tipo: NodeType | 'todos';
  estado?: StatusFilterType;
  fecha: DateFilterType;
  ordenFecha?: DateSortType;
  soloConectados: boolean;
}

export interface ExportBackupData {
  version: string;
  exportDate: string;
  nodes: {
    id: string;
    position: { x: number; y: number };
    data: BrainNodeData;
  }[];
  edges: BrainEdgeData[];
  categories: Category[];
}
