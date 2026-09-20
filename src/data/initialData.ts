import { Category, BrainNodeData, BrainEdgeData } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'ingles',
    nombre: 'Inglés',
    color: '#0284c7', // Sky blue
    bgLight: 'bg-sky-950/40 text-sky-300 border-sky-700/50',
    borderColor: '#38bdf8',
    textColor: 'text-sky-300',
    iconName: 'Languages',
  },
  {
    id: 'photoshop',
    nombre: 'Photoshop 2022',
    color: '#8b5cf6', // Purple
    bgLight: 'bg-purple-950/40 text-purple-300 border-purple-700/50',
    borderColor: '#a78bfa',
    textColor: 'text-purple-300',
    iconName: 'Palette',
  },
  {
    id: 'programacion',
    nombre: 'Programación',
    color: '#3b82f6', // Indigo/Blue
    bgLight: 'bg-blue-950/40 text-blue-300 border-blue-700/50',
    borderColor: '#60a5fa',
    textColor: 'text-blue-300',
    iconName: 'Code',
  },
  {
    id: 'gestion',
    nombre: 'Gestión Administrativa',
    color: '#10b981', // Emerald green
    bgLight: 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50',
    borderColor: '#34d399',
    textColor: 'text-emerald-300',
    iconName: 'Briefcase',
  },
  {
    id: 'uxui',
    nombre: 'Diseño UX/UI',
    color: '#f59e0b', // Amber
    bgLight: 'bg-amber-950/40 text-amber-300 border-amber-700/50',
    borderColor: '#fbbf24',
    textColor: 'text-amber-300',
    iconName: 'Layout',
  },
  {
    id: 'productividad',
    nombre: 'Productividad',
    color: '#ec4899', // Pink
    bgLight: 'bg-pink-950/40 text-pink-300 border-pink-700/50',
    borderColor: '#f472b6',
    textColor: 'text-pink-300',
    iconName: 'CheckSquare',
  },
];

export interface CanvasNodeItem {
  id: string;
  position: { x: number; y: number };
  data: BrainNodeData;
}

export const INITIAL_NODES: CanvasNodeItem[] = [
  // --- INGLÉS BRANCH ---
  {
    id: 'node-ingles-1',
    position: { x: 80, y: 80 },
    data: {
      id: 'node-ingles-1',
      tipo: 'enlace',
      titulo: 'Reel: 5 Phrasal Verbs de Negocios y Oficina',
      contenido: 'https://www.instagram.com/reel/C3x9_example_english_verbs/',
      categoriaId: 'ingles',
      etiquetas: ['phrasal-verbs', 'business-english', 'reuniones'],
      fechaCreacion: '2026-09-14',
      razonModo: 'manual',
      razonManual: 'Repasar verbos como "bring up" y "follow up" para usarlos en correos con clientes de habla inglesa.',
      urlOriginal: 'https://www.instagram.com/reel/C3x9_example_english_verbs/',
      plataforma: 'instagram',
      imagenUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'node-ingles-2',
    position: { x: 440, y: 80 },
    data: {
      id: 'node-ingles-2',
      tipo: 'nota',
      titulo: 'Glosario de conectores para correos formales',
      contenido: 'Conectores útiles:\n• Furthermore / Moreover (Además)\n• Regarding your inquiry (Con respecto a su consulta)\n• Looking forward to your prompt response\n• In accordance with our agreement.',
      categoriaId: 'ingles',
      etiquetas: ['vocabulario', 'escritura', 'templates'],
      fechaCreacion: '2026-09-15',
      razonModo: 'automatico',
      razonManual: '',
    },
  },
  {
    id: 'node-ingles-3',
    position: { x: 260, y: 340 },
    data: {
      id: 'node-ingles-3',
      tipo: 'imagen',
      titulo: 'Diagrama de pronunciación vocal corta vs larga',
      contenido: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      categoriaId: 'ingles',
      etiquetas: ['fonetica', 'pronunciacion', 'infografia'],
      fechaCreacion: '2026-09-16',
      razonModo: 'manual',
      razonManual: 'Diferenciar entre "ship" [I] y "sheep" [i:] para no confundir palabras en llamadas.',
      imagenUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    },
  },

  // --- PHOTOSHOP 2022 BRANCH ---
  {
    id: 'node-ps-1',
    position: { x: 80, y: 560 },
    data: {
      id: 'node-ps-1',
      tipo: 'enlace',
      titulo: 'Reel: Curvas y Dodge & Burn en 30s',
      contenido: 'https://www.instagram.com/reel/C8qL_photoshop_dodge_burn/',
      categoriaId: 'photoshop',
      etiquetas: ['curvas', 'retoque', 'dodge-burn'],
      fechaCreacion: '2026-09-12',
      razonModo: 'manual',
      razonManual: 'Técnica de dodge/burn con curvas en modo Luminosidad que quiero probar en el retrato del proyecto final.',
      urlOriginal: 'https://www.instagram.com/reel/C8qL_photoshop_dodge_burn/',
      plataforma: 'instagram',
      imagenUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'node-ps-2',
    position: { x: 440, y: 560 },
    data: {
      id: 'node-ps-2',
      tipo: 'nota',
      titulo: 'Atajos clave de capas y máscaras en PS 2022',
      contenido: '1. Alt + Clic en icono de máscara = máscara negra oculta.\n2. Ctrl + Shift + Alt + E = Fusionar todo en capa nueva arriba.\n3. Tecla X = Alternar entre color frontal blanco y negro para pintar máscaras.',
      categoriaId: 'photoshop',
      etiquetas: ['shortcuts', 'productividad', 'mascaras'],
      fechaCreacion: '2026-09-13',
      razonModo: 'automatico',
      razonManual: '',
    },
  },

  // --- PROGRAMACIÓN BRANCH ---
  {
    id: 'node-prog-1',
    position: { x: 840, y: 80 },
    data: {
      id: 'node-prog-1',
      tipo: 'enlace',
      titulo: 'Reel: CSS Grid vs Flexbox cuando usar cada uno',
      contenido: 'https://www.instagram.com/reel/D11k_css_grid_flexbox/',
      categoriaId: 'programacion',
      etiquetas: ['css', 'frontend', 'layout'],
      fechaCreacion: '2026-09-15',
      razonModo: 'manual',
      razonManual: 'Regla de oro: Flexbox para una sola dirección (fila o columna); Grid para layouts bidimensionales complejos.',
      urlOriginal: 'https://www.instagram.com/reel/D11k_css_grid_flexbox/',
      plataforma: 'instagram',
      imagenUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'node-prog-2',
    position: { x: 1200, y: 80 },
    data: {
      id: 'node-prog-2',
      tipo: 'nota',
      titulo: 'Patrón de React Flow + Estado Inmutable',
      contenido: 'Al conectar nodos en React Flow, utilizar `applyNodeChanges` y `applyEdgeChanges` para mantener la sincronización y persistir en `localStorage` con debounce para no saturar el rendimiento.',
      categoriaId: 'programacion',
      etiquetas: ['react', 'typescript', 'arquitectura'],
      fechaCreacion: '2026-09-17',
      razonModo: 'automatico',
      razonManual: '',
    },
  },

  // --- GESTIÓN ADMINISTRATIVA BRANCH ---
  {
    id: 'node-gest-1',
    position: { x: 840, y: 560 },
    data: {
      id: 'node-gest-1',
      tipo: 'enlace',
      titulo: 'Reel: Matriz de Eisenhower para Gestión Diaria',
      contenido: 'https://www.instagram.com/reel/B88u_matriz_eisenhower/',
      categoriaId: 'gestion',
      etiquetas: ['eisenhower', 'priorizacion', 'gestion'],
      fechaCreacion: '2026-09-10',
      razonModo: 'manual',
      razonManual: 'Estructurar mis entregables semanales del tecnólogo entre lo urgente vs lo importante antes de iniciar el día.',
      urlOriginal: 'https://www.instagram.com/reel/B88u_matriz_eisenhower/',
      plataforma: 'instagram',
      imagenUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'node-gest-2',
    position: { x: 1200, y: 560 },
    data: {
      id: 'node-gest-2',
      tipo: 'nota',
      titulo: 'Checklist de Flujo de Procesos Administrativos',
      contenido: 'Puntos clave para auditar un proceso:\n1. Identificar entrada de información (input)\n2. Responsable de cada etapa (RACIS)\n3. Tiempos de ciclo y cuellos de botella\n4. Métrica de salida (KPI) verificable.',
      categoriaId: 'gestion',
      etiquetas: ['procesos', 'auditoria', 'kpi'],
      fechaCreacion: '2026-09-11',
      razonModo: 'automatico',
      razonManual: '',
    },
  },
];

export const INITIAL_EDGES: BrainEdgeData[] = [
  {
    id: 'edge-ingles-1-2',
    source: 'node-ingles-1',
    target: 'node-ingles-2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    etiqueta: 'aplica en vocabulario',
  },
  {
    id: 'edge-ingles-1-3',
    source: 'node-ingles-1',
    target: 'node-ingles-3',
    sourceHandle: 'right',
    targetHandle: 'left',
    etiqueta: 'complemento fonético',
  },
  {
    id: 'edge-ps-1-2',
    source: 'node-ps-1',
    target: 'node-ps-2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    etiqueta: 'atajos de apoyo',
  },
  {
    id: 'edge-prog-1-2',
    source: 'node-prog-1',
    target: 'node-prog-2',
    sourceHandle: 'right',
    targetHandle: 'left',
    etiqueta: 'base conceptual',
  },
  {
    id: 'edge-gest-1-2',
    source: 'node-gest-1',
    target: 'node-gest-2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    etiqueta: 'metodología aplicada',
  },
];
