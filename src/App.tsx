import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  ConnectionMode,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import { BookOpen, Sparkles, Command, Compass } from 'lucide-react';
import { User } from 'firebase/auth';

import { 
  BrainNodeData, 
  Category, 
  NodeType, 
  BrainEdgeData,
  DateFilterType,
  DateSortType,
  StatusFilterType,
  NodeStatus,
  ExportBackupData
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  CanvasNodeItem 
} from './data/initialData';
import { CustomNode } from './components/CustomNode';
import { TopBar } from './components/TopBar';
import { NodeEditorModal } from './components/NodeEditorModal';
import { NotionPreviewModal } from './components/NotionPreviewModal';
import { EdgeEditorModal } from './components/EdgeEditorModal';
import { StatsDrawer } from './components/StatsDrawer';
import { NodeDetailModal } from './components/NodeDetailModal';
import { PaletteModal } from './components/PaletteModal';
import { InstructionManualModal } from './components/InstructionManualModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { StudyReviewModal } from './components/StudyReviewModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { AspectsHubModal } from './components/AspectsHubModal';
import { DownloadFeedbackModal, DownloadModalData } from './components/DownloadFeedbackModal';
import { 
  Palette60_30_10, 
  obtenerPaletaGuardada, 
  guardarPaleta, 
  aplicarVariablesCSS 
} from './utils/theme';
import { 
  obtenerRazonEfectiva, 
  coincideFiltroFecha, 
  ConnectedNodeInfo,
  generarDossierCompletoMarkdown,
  generarDossierCompletoHTML,
  descargarArchivo,
  detectarPlataforma
} from './utils/textUtils';
import { DriveBackupPayload } from './services/driveService';

const STORAGE_KEY = 'mi_segundo_cerebro_store_v1';

const nodeTypes = {
  brainNode: CustomNode,
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<NodeType | 'todos'>('todos');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>('todos');
  const [selectedDate, setSelectedDate] = useState<DateFilterType>('todas');
  const [selectedDateSort, setSelectedDateSort] = useState<DateSortType>('recientes');

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<BrainNodeData | null>(null);

  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [notionNode, setNotionNode] = useState<BrainNodeData | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailNode, setDetailNode] = useState<BrainNodeData | null>(null);

  // Paleta 60-30-10
  const [palette, setPalette] = useState<Palette60_30_10>(() => obtenerPaletaGuardada());
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  // New Productivity Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAspectsHubOpen, setIsAspectsHubOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [quickPasteFeedback, setQuickPasteFeedback] = useState<string | null>(null);
  const [downloadFeedback, setDownloadFeedback] = useState<DownloadModalData>({
    isOpen: false,
    fileName: '',
    content: '',
    mimeType: 'text/plain',
    title: '',
    format: 'json',
  });
  const hubFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    aplicarVariablesCSS(palette);
  }, [palette]);

  const handlePaletteSelect = (newPalette: Palette60_30_10) => {
    guardarPaleta(newPalette);
    setPalette(newPalette);
  };

  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [editingEdgeData, setEditingEdgeData] = useState<{
    id: string;
    label: string;
    sourceTitle: string;
    targetTitle: string;
    sourceHandle?: string;
    targetHandle?: string;
  } | null>(null);

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());

  const reactFlowInstance = useRef<any>(null);

  // Initial nodes setup for React Flow
  const initialReactFlowNodes: Node[] = useMemo(() => {
    const savedNodes = localStorage.getItem(`${STORAGE_KEY}_nodes`);
    let rawNodes: CanvasNodeItem[] = INITIAL_NODES;

    if (savedNodes) {
      try {
        rawNodes = JSON.parse(savedNodes);
      } catch (e) {
        console.error('Error loading saved nodes:', e);
      }
    }

    return rawNodes.map((n) => ({
      id: n.id,
      type: 'brainNode',
      position: n.position,
      data: n.data as unknown as Record<string, unknown>,
    }));
  }, []);

  // Initial edges setup for React Flow
  const initialReactFlowEdges: Edge[] = useMemo(() => {
    const savedEdges = localStorage.getItem(`${STORAGE_KEY}_edges`);
    let rawEdges: BrainEdgeData[] = INITIAL_EDGES;

    if (savedEdges) {
      try {
        rawEdges = JSON.parse(savedEdges);
      } catch (e) {
        console.error('Error loading saved edges:', e);
      }
    }

    return rawEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || 'bottom',
      targetHandle: e.targetHandle || 'top',
      label: e.etiqueta,
      animated: true,
      reconnectable: true,
      style: { stroke: '#38bdf8', strokeWidth: 2.5 },
      labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95, stroke: '#334155', strokeWidth: 1, rx: 6, ry: 6 },
      labelBgPadding: [6, 4] as [number, number],
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#38bdf8',
        width: 14,
        height: 14,
      },
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialReactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialReactFlowEdges);

  // Sync to LocalStorage safely with try/catch to prevent QuotaExceededError or sandbox crashes
  useEffect(() => {
    try {
      const serializedNodes = nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: n.data as unknown as BrainNodeData,
      }));
      localStorage.setItem(`${STORAGE_KEY}_nodes`, JSON.stringify(serializedNodes));
    } catch (e) {
      console.warn('Error saving nodes to localStorage:', e);
    }
  }, [nodes]);

  useEffect(() => {
    try {
      const serializedEdges: BrainEdgeData[] = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined,
        etiqueta: typeof e.label === 'string' ? e.label : '',
      }));
      localStorage.setItem(`${STORAGE_KEY}_edges`, JSON.stringify(serializedEdges));
    } catch (e) {
      console.warn('Error saving edges to localStorage:', e);
    }
  }, [edges]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.warn('Error saving categories to localStorage:', e);
    }
  }, [categories]);

  // Category Map lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Node counts by category
  const nodeCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach((n) => {
      const d = n.data as unknown as BrainNodeData;
      if (d?.categoriaId) {
        counts[d.categoriaId] = (counts[d.categoriaId] || 0) + 1;
      }
    });
    return counts;
  }, [nodes]);

  // Children count calculation for branch collapsing
  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    edges.forEach((edge) => {
      const list = map.get(edge.source) || [];
      list.push(edge.target);
      map.set(edge.source, list);
    });
    return map;
  }, [edges]);

  // Check if a node is downstream of any collapsed node
  const hiddenNodeIds = useMemo(() => {
    const hidden = new Set<string>();

    const traverseHide = (parentId: string) => {
      const children = childrenMap.get(parentId) || [];
      for (const childId of children) {
        if (!hidden.has(childId)) {
          hidden.add(childId);
          traverseHide(childId);
        }
      }
    };

    collapsedNodeIds.forEach((collapsedId) => {
      traverseHide(collapsedId);
    });

    return hidden;
  }, [collapsedNodeIds, childrenMap]);

  // Handler: Toggle branch collapse
  const handleToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Update Status handler
  const handleUpdateStatus = useCallback((nodeId: string, status: NodeStatus) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              estado: status,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  // Toggle Checklist Item handler
  const handleToggleChecklist = useCallback((nodeId: string, itemId: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const d = n.data as unknown as BrainNodeData;
          const updatedChecklist = (d.checklist || []).map((item) =>
            item.id === itemId ? { ...item, completado: !item.completado } : item
          );
          return {
            ...n,
            data: {
              ...d,
              checklist: updatedChecklist,
            },
          };
        }
        return n;
      })
    );

    // Mantener sincronizado el modal de detalle si está abierto para este nodo
    setDetailNode((prev) => {
      if (prev && prev.id === nodeId) {
        const updatedChecklist = (prev.checklist || []).map((item) =>
          item.id === itemId ? { ...item, completado: !item.completado } : item
        );
        return {
          ...prev,
          checklist: updatedChecklist,
        };
      }
      return prev;
    });
  }, [setNodes]);

  // Quick Capture Friction: Paste listener (Ctrl+V anywhere on window when not typing)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const pastedText = e.clipboardData?.getData('text')?.trim();
      if (!pastedText) return;

      const isUrl = pastedText.startsWith('http://') || pastedText.startsWith('https://');
      const platform = isUrl ? detectarPlataforma(pastedText) : undefined;
      const newId = `node-${Date.now()}`;

      let newTitle = 'Captura Rápida (Pegado)';
      if (isUrl) {
        if (platform === 'instagram') newTitle = 'Reel / Publicación de Instagram';
        else if (platform === 'youtube') newTitle = 'Video de YouTube';
        else newTitle = 'Recurso Web Guardado';
      } else {
        newTitle = pastedText.slice(0, 45) + (pastedText.length > 45 ? '...' : '');
      }

      const newNode: Node = {
        id: newId,
        type: 'brainNode',
        position: {
          x: 240 + Math.random() * 200,
          y: 180 + Math.random() * 150,
        },
        data: {
          id: newId,
          tipo: isUrl ? 'enlace' : 'nota',
          titulo: newTitle,
          contenido: pastedText,
          categoriaId: categories[0]?.id || 'ingles',
          estado: 'por_aprender',
          etiquetas: ['captura-rapida'],
          fechaCreacion: new Date().toISOString().split('T')[0],
          razonModo: 'automatico',
          razonManual: '',
          plataforma: platform,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setQuickPasteFeedback(`¡Recurso capturado al instante desde portapapeles! (${newTitle})`);
      setTimeout(() => setQuickPasteFeedback(null), 3800);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [categories, setNodes]);

  // Global Keyboard Shortcuts (Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Modals
  const handleOpenEditNode = useCallback((node: BrainNodeData) => {
    setEditingNode(node);
    setIsEditorOpen(true);
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const handleOpenNotionModal = useCallback((node: BrainNodeData) => {
    setNotionNode(node);
    setIsNotionModalOpen(true);
  }, []);

  const handleOpenDetailNode = useCallback((node: BrainNodeData) => {
    setDetailNode(node);
    setIsDetailModalOpen(true);
  }, []);

  const handleSaveNode = useCallback(
    (nodeData: Partial<BrainNodeData>) => {
      // 1. Limpiar o ajustar filtros para garantizar que el nuevo nodo sea inmediatamente visible
      if (selectedCategory && nodeData.categoriaId && selectedCategory !== nodeData.categoriaId) {
        setSelectedCategory(null);
      }
      if (selectedType !== 'todos' && nodeData.tipo && selectedType !== nodeData.tipo) {
        setSelectedType('todos');
      }
      if (selectedStatus !== 'todos' && nodeData.estado && selectedStatus !== nodeData.estado) {
        setSelectedStatus('todos');
      }
      if (searchQuery.trim().length > 0) {
        setSearchQuery('');
      }

      let targetX = 240;
      let targetY = 180;
      let targetNodeId = '';
      const nodeTitle = nodeData.titulo?.trim() || 'Recurso de aprendizaje';

      if (editingNode) {
        targetNodeId = editingNode.id;
        const currentPos = nodes.find((n) => n.id === editingNode.id)?.position;
        if (currentPos) {
          targetX = currentPos.x;
          targetY = currentPos.y;
        }

        setNodes((nds) => {
          const updated = nds.map((n) => {
            if (n.id === editingNode.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  ...nodeData,
                },
              };
            }
            return n;
          });

          // Persistir inmediatamente de forma segura
          try {
            const serialized = updated.map((n) => ({
              id: n.id,
              position: n.position,
              data: n.data as unknown as BrainNodeData,
            }));
            localStorage.setItem(`${STORAGE_KEY}_nodes`, JSON.stringify(serialized));
          } catch (e) {
            console.warn('Storage sync warning on update:', e);
          }

          return updated;
        });

        setQuickPasteFeedback(`¡Recurso "${nodeTitle}" actualizado en el lienzo!`);
      } else {
        const newId = `node-${Date.now()}`;
        targetNodeId = newId;

        // Calcular posición en el centro del viewport actual del usuario
        if (reactFlowInstance.current) {
          try {
            const vp = reactFlowInstance.current.getViewport?.() || { x: 0, y: 0, zoom: 1 };
            const zoom = vp.zoom || 1;
            const winW = typeof window !== 'undefined' ? window.innerWidth : 900;
            const winH = typeof window !== 'undefined' ? window.innerHeight : 600;
            // Desplazar ligeramente si ya hay un nodo en ese centro
            const jitterX = (Math.random() - 0.5) * 40;
            const jitterY = (Math.random() - 0.5) * 40;
            targetX = (-vp.x + winW / 2) / zoom - 160 + jitterX;
            targetY = (-vp.y + winH / 2) / zoom - 100 + jitterY;
          } catch {
            targetX = 200 + (nodes.length % 4) * 360;
            targetY = 120 + Math.floor(nodes.length / 4) * 340;
          }
        } else {
          targetX = 200 + (nodes.length % 4) * 360;
          targetY = 120 + Math.floor(nodes.length / 4) * 340;
        }

        const newNode: Node = {
          id: newId,
          type: 'brainNode',
          position: { x: targetX, y: targetY },
          data: {
            id: newId,
            tipo: nodeData.tipo || 'enlace',
            titulo: nodeTitle,
            contenido: nodeData.contenido || '',
            categoriaId: nodeData.categoriaId || categories[0]?.id || 'ingles',
            estado: nodeData.estado || 'por_aprender',
            checklist: nodeData.checklist || [],
            etiquetas: nodeData.etiquetas || [],
            fechaCreacion: new Date().toISOString().split('T')[0],
            razonModo: nodeData.razonModo || 'manual',
            razonManual: nodeData.razonManual || '',
            imagenUrl: nodeData.imagenUrl,
            plataforma: nodeData.plataforma,
          },
        };

        setNodes((nds) => {
          const updated = [...nds, newNode];
          // Persistir inmediatamente de forma segura
          try {
            const serialized = updated.map((n) => ({
              id: n.id,
              position: n.position,
              data: n.data as unknown as BrainNodeData,
            }));
            localStorage.setItem(`${STORAGE_KEY}_nodes`, JSON.stringify(serialized));
          } catch (e) {
            console.warn('Storage sync warning on create:', e);
          }
          return updated;
        });

        setQuickPasteFeedback(`¡Nuevo recurso "${nodeTitle}" guardado y visible en el lienzo!`);
      }

      setIsEditorOpen(false);
      setEditingNode(null);

      // Enfocar suavemente en el nodo creado o actualizado
      setTimeout(() => {
        if (reactFlowInstance.current && targetX !== undefined && targetY !== undefined) {
          reactFlowInstance.current.setCenter?.(targetX + 160, targetY + 100, {
            duration: 600,
            zoom: Math.max(0.85, reactFlowInstance.current.getZoom?.() || 1),
          });
        }
      }, 70);

      setTimeout(() => {
        setQuickPasteFeedback(null);
      }, 3500);
    },
    [
      editingNode, 
      categories, 
      nodes, 
      selectedCategory, 
      selectedType, 
      selectedStatus, 
      searchQuery, 
      setNodes
    ]
  );

  // Handler: Connect nodes by dragging
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || 'bottom',
        targetHandle: params.targetHandle || 'top',
        animated: true,
        reconnectable: true,
        label: 'se relaciona con',
        style: { stroke: '#38bdf8', strokeWidth: 2.5 },
        labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95, stroke: '#334155', strokeWidth: 1, rx: 6, ry: 6 },
        labelBgPadding: [6, 4] as [number, number],
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#38bdf8',
          width: 14,
          height: 14,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handler: Reconnect edges interactively by dragging endpoints
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  // Handler: Click edge to edit
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)?.data as unknown as BrainNodeData;
      const targetNode = nodes.find((n) => n.id === edge.target)?.data as unknown as BrainNodeData;

      setEditingEdgeData({
        id: edge.id,
        label: typeof edge.label === 'string' ? edge.label : '',
        sourceTitle: sourceNode?.titulo || 'Nodo Origen',
        targetTitle: targetNode?.titulo || 'Nodo Destino',
        sourceHandle: edge.sourceHandle || 'bottom',
        targetHandle: edge.targetHandle || 'top',
      });
      setIsEdgeModalOpen(true);
    },
    [nodes]
  );

  const handleSaveEdge = useCallback(
    (edgeId: string, label: string, sourceHandle?: string, targetHandle?: string) => {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === edgeId) {
            return {
              ...e,
              label: label || undefined,
              sourceHandle: sourceHandle || e.sourceHandle || 'bottom',
              targetHandle: targetHandle || e.targetHandle || 'top',
            };
          }
          return e;
        })
      );
    },
    [setEdges]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  // Add category
  const handleAddCategory = useCallback((newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  }, []);

  // Connected nodes information for the detail document modal
  const connectedNodesForDetail = useMemo((): ConnectedNodeInfo[] => {
    if (!detailNode) return [];
    const result: ConnectedNodeInfo[] = [];

    // Outgoing edges
    edges.forEach((e) => {
      if (e.source === detailNode.id) {
        const targetNode = nodes.find((n) => n.id === e.target);
        if (targetNode) {
          const d = targetNode.data as unknown as BrainNodeData;
          const cat = categoryMap.get(d.categoriaId);
          result.push({
            id: d.id,
            titulo: d.titulo,
            categoriaNombre: cat?.nombre,
            tipo: d.tipo,
            relacion: typeof e.label === 'string' ? e.label : undefined,
            direccion: 'saliente',
          });
        }
      }
    });

    // Incoming edges
    edges.forEach((e) => {
      if (e.target === detailNode.id) {
        const sourceNode = nodes.find((n) => n.id === e.source);
        if (sourceNode) {
          const d = sourceNode.data as unknown as BrainNodeData;
          const cat = categoryMap.get(d.categoriaId);
          result.push({
            id: d.id,
            titulo: d.titulo,
            categoriaNombre: cat?.nombre,
            tipo: d.tipo,
            relacion: typeof e.label === 'string' ? e.label : undefined,
            direccion: 'entrante',
          });
        }
      }
    });

    return result;
  }, [detailNode, edges, nodes, categoryMap]);

  // Filtered and enriched nodes for canvas display
  const processedNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return nodes
      .filter((n) => !hiddenNodeIds.has(n.id))
      .map((node) => {
        const data = node.data as unknown as BrainNodeData;
        const cat = categoryMap.get(data.categoriaId);
        const reason = obtenerRazonEfectiva(data).toLowerCase();
        const title = (data.titulo || '').toLowerCase();
        const content = (data.contenido || '').toLowerCase();
        const tags = (data.etiquetas || []).map((t) => t.toLowerCase());

        const matchesCategory = !selectedCategory || data.categoriaId === selectedCategory;
        const matchesType = selectedType === 'todos' || data.tipo === selectedType;
        const matchesStatus =
          selectedStatus === 'todos' || (data.estado || 'por_aprender') === selectedStatus;
        const matchesDate = coincideFiltroFecha(data.fechaCreacion, selectedDate);
        const matchesSearch =
          !q ||
          title.includes(q) ||
          reason.includes(q) ||
          content.includes(q) ||
          tags.some((t) => t.includes(q)) ||
          (cat?.nombre.toLowerCase().includes(q) ?? false);

        const hasActiveFilter =
          q.length > 0 ||
          selectedCategory !== null ||
          selectedType !== 'todos' ||
          selectedStatus !== 'todos' ||
          selectedDate !== 'todas';

        const matchesAll =
          matchesCategory && matchesType && matchesStatus && matchesDate && matchesSearch;

        const isHighlighted = q.length > 0 && matchesAll;
        const isDimmed = hasActiveFilter && !matchesAll;

        const children = childrenMap.get(node.id) || [];
        const hasChildren = children.length > 0;
        const isCollapsed = collapsedNodeIds.has(node.id);

        return {
          ...node,
          data: {
            ...data,
            category: cat,
            isHighlighted,
            isDimmed,
            hasChildren,
            childrenCount: children.length,
            isCollapsed,
            onEdit: handleOpenEditNode,
            onDelete: handleDeleteNode,
            onOpenNotionModal: handleOpenNotionModal,
            onToggleCollapse: handleToggleCollapse,
            onViewDetail: handleOpenDetailNode,
            onUpdateStatus: handleUpdateStatus,
            onToggleChecklist: handleToggleChecklist,
          },
        };
      });
  }, [
    nodes,
    hiddenNodeIds,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedStatus,
    selectedDate,
    categoryMap,
    childrenMap,
    collapsedNodeIds,
    handleOpenEditNode,
    handleDeleteNode,
    handleOpenNotionModal,
    handleToggleCollapse,
    handleOpenDetailNode,
    handleUpdateStatus,
    handleToggleChecklist,
  ]);

  // Count of items matching all active filters
  const filteredCount = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return nodes.filter((node) => {
      const data = node.data as unknown as BrainNodeData;
      const cat = categoryMap.get(data.categoriaId);
      const reason = obtenerRazonEfectiva(data).toLowerCase();
      const title = (data.titulo || '').toLowerCase();
      const content = (data.contenido || '').toLowerCase();
      const tags = (data.etiquetas || []).map((t) => t.toLowerCase());

      const matchesCategory = !selectedCategory || data.categoriaId === selectedCategory;
      const matchesType = selectedType === 'todos' || data.tipo === selectedType;
      const matchesStatus =
        selectedStatus === 'todos' || (data.estado || 'por_aprender') === selectedStatus;
      const matchesDate = coincideFiltroFecha(data.fechaCreacion, selectedDate);
      const matchesSearch =
        !q ||
        title.includes(q) ||
        reason.includes(q) ||
        content.includes(q) ||
        tags.some((t) => t.includes(q)) ||
        (cat?.nombre.toLowerCase().includes(q) ?? false);

      return matchesCategory && matchesType && matchesStatus && matchesDate && matchesSearch;
    }).length;
  }, [nodes, searchQuery, selectedCategory, selectedType, selectedStatus, selectedDate, categoryMap]);

  // Edges filtered by visible nodes
  const visibleEdges = useMemo(() => {
    return edges.filter(
      (edge) => !hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target)
    );
  }, [edges, hiddenNodeIds]);

  // Auto-Layout by Category Columns
  const handleAutoLayout = useCallback(() => {
    const spacingX = 380;
    const spacingY = 340;
    const columns: Record<string, CanvasNodeItem[]> = {};

    categories.forEach((c) => {
      columns[c.id] = [];
    });
    columns['other'] = [];

    nodes.forEach((n) => {
      const d = n.data as unknown as BrainNodeData;
      const catId = d.categoriaId && columns[d.categoriaId] ? d.categoriaId : 'other';
      columns[catId].push({
        id: n.id,
        position: n.position,
        data: d,
      });
    });

    let colIndex = 0;
    const newPositions = new Map<string, { x: number; y: number }>();

    Object.keys(columns).forEach((catId) => {
      const items = columns[catId];
      if (items.length === 0) return;

      items.sort((a, b) => {
        const da = a.data.fechaCreacion || '';
        const db = b.data.fechaCreacion || '';
        return selectedDateSort === 'recientes' ? db.localeCompare(da) : da.localeCompare(db);
      });

      items.forEach((item, rowIndex) => {
        newPositions.set(item.id, {
          x: 100 + colIndex * spacingX,
          y: 80 + rowIndex * spacingY,
        });
      });

      colIndex++;
    });

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        position: newPositions.get(n.id) || n.position,
      }))
    );

    setTimeout(() => {
      reactFlowInstance.current?.fitView({ padding: 0.2 });
    }, 50);
  }, [categories, nodes, selectedDateSort, setNodes]);

  // Focus a specific node from Command Palette or Flashcards
  const handleFocusNode = useCallback((nodeId: string) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (targetNode && reactFlowInstance.current) {
      reactFlowInstance.current.setCenter(
        targetNode.position.x + 170,
        targetNode.position.y + 120,
        { zoom: 1.2, duration: 800 }
      );
    }
  }, [nodes]);

  // Auto-focus and open node when opening shared Notion links (?node=ID or #node-ID)
  useEffect(() => {
    if (typeof window === 'undefined' || nodes.length === 0) return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryNodeId = urlParams.get('node');
    const hashNodeId = window.location.hash.startsWith('#node-')
      ? window.location.hash.replace('#node-', '')
      : null;
    const targetId = queryNodeId || hashNodeId;

    if (targetId) {
      const found = nodes.find((n) => n.id === targetId);
      if (found) {
        const timer = setTimeout(() => {
          handleFocusNode(targetId);
          setDetailNode(found.data as unknown as BrainNodeData);
          setIsDetailModalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [nodes, handleFocusNode]);

  // Extract raw node data for metrics and modals
  const rawNodesList = useMemo(
    () => nodes.map((n) => n.data as unknown as BrainNodeData),
    [nodes]
  );
  
  const rawEdgesList: BrainEdgeData[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined,
        etiqueta: typeof e.label === 'string' ? e.label : '',
      })),
    [edges]
  );

  // Current Backup Data Object for Local / Drive Sync
  const currentBackupData: ExportBackupData = useMemo(() => {
    const rawNodes = nodes.map((n) => ({
      id: n.id,
      position: n.position,
      data: n.data as unknown as BrainNodeData,
    }));

    return {
      version: '1.2.0',
      exportDate: new Date().toISOString(),
      nodes: rawNodes,
      edges: rawEdgesList,
      categories,
    };
  }, [nodes, rawEdgesList, categories]);

  // Restore data from Drive or JSON
  const handleRestoreData = useCallback(
    (data: ExportBackupData | DriveBackupPayload) => {
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      if (data.nodes && Array.isArray(data.nodes)) {
        setNodes(
          data.nodes.map((n: any, index: number) => {
            // Check if node has 'position' (ExportBackupData) or is raw node data (DriveBackupPayload)
            const position = n.position || {
              x: 200 + (index % 4) * 360,
              y: 120 + Math.floor(index / 4) * 340,
            };
            const nodeData = n.data || n;
            const sanitizedData: BrainNodeData = {
              ...nodeData,
              etiquetas: Array.isArray(nodeData.etiquetas) ? [...nodeData.etiquetas] : [],
              checklist: Array.isArray(nodeData.checklist)
                ? nodeData.checklist.map((item: any, iIdx: number) => ({
                    id: item.id || `chk-${iIdx}-${Date.now()}`,
                    texto: item.texto || '',
                    completado: Boolean(item.completado),
                  }))
                : [],
              estado: nodeData.estado || 'por_aprender',
            };

            return {
              id: sanitizedData.id || `node-${index}-${Date.now()}`,
              type: 'brainNode',
              position,
              data: sanitizedData as unknown as Record<string, unknown>,
            };
          })
        );
      }
      if (data.edges && Array.isArray(data.edges)) {
        setEdges(
          data.edges.map((e: BrainEdgeData) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle || 'bottom',
            targetHandle: e.targetHandle || 'top',
            label: e.etiqueta,
            animated: true,
            reconnectable: true,
            style: { stroke: '#38bdf8', strokeWidth: 2.5 },
            labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
            labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95, stroke: '#334155', strokeWidth: 1, rx: 6, ry: 6 },
            labelBgPadding: [6, 4] as [number, number],
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#38bdf8',
              width: 14,
              height: 14,
            },
          }))
        );
      }
      setTimeout(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
      }, 100);
    },
    [setNodes, setEdges]
  );

  // Export Complete Backup JSON
  const handleExportJSON = useCallback(() => {
    const jsonStr = JSON.stringify(currentBackupData, null, 2);
    const fileName = `segundo_cerebro_backup_${new Date().toISOString().split('T')[0]}.json`;
    descargarArchivo(fileName, jsonStr, 'application/json;charset=utf-8');
    setDownloadFeedback({
      isOpen: true,
      fileName,
      content: jsonStr,
      mimeType: 'application/json;charset=utf-8',
      title: 'Copia de Seguridad Completa (JSON)',
      format: 'json',
    });
  }, [currentBackupData]);

  // Export Complete Dossier Document
  const handleExportDocument = useCallback((format: 'md' | 'html') => {
    if (format === 'md') {
      const content = generarDossierCompletoMarkdown(rawNodesList, categories);
      const fileName = `dossier_segundo_cerebro_${new Date().toISOString().split('T')[0]}.md`;
      descargarArchivo(fileName, content, 'text/markdown;charset=utf-8');
      setDownloadFeedback({
        isOpen: true,
        fileName,
        content,
        mimeType: 'text/markdown;charset=utf-8',
        title: 'Dossier Completo en Markdown (.md)',
        format: 'md',
      });
    } else {
      const content = generarDossierCompletoHTML(rawNodesList, categories);
      const fileName = `dossier_segundo_cerebro_${new Date().toISOString().split('T')[0]}.html`;
      descargarArchivo(fileName, content, 'text/html;charset=utf-8');
      setDownloadFeedback({
        isOpen: true,
        fileName,
        content,
        mimeType: 'text/html;charset=utf-8',
        title: 'Dossier Web Imprimible (.html)',
        format: 'html',
      });
    }
  }, [rawNodesList, categories]);

  // Import JSON file locally
  const handleImportJSON = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          handleRestoreData(parsed);
        } catch (err) {
          alert('Error al importar el archivo JSON. Verifica que sea un respaldo válido.');
        }
      };
      reader.readAsText(file);
    },
    [handleRestoreData]
  );

  // Reset to Demo Data
  const handleResetDemo = useCallback(() => {
    if (window.confirm('¿Quieres restaurar los datos de ejemplo de tu Segundo Cerebro? (Inglés, Photoshop, Programación y Gestión)')) {
      setCategories(INITIAL_CATEGORIES);
      setNodes(
        INITIAL_NODES.map((n) => ({
          id: n.id,
          type: 'brainNode',
          position: n.position,
          data: n.data as unknown as Record<string, unknown>,
        }))
      );
      setEdges(
        INITIAL_EDGES.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || 'bottom',
          targetHandle: e.targetHandle || 'top',
          label: e.etiqueta,
          animated: true,
          reconnectable: true,
          style: { stroke: '#38bdf8', strokeWidth: 2.5 },
          labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
          labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95, stroke: '#334155', strokeWidth: 1, rx: 6, ry: 6 },
          labelBgPadding: [6, 4] as [number, number],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#38bdf8',
            width: 14,
            height: 14,
          },
        }))
      );
      setCollapsedNodeIds(new Set());
      setTimeout(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
      }, 50);
    }
  }, [setNodes, setEdges]);

  return (
    <div 
      className="flex flex-col h-screen w-screen text-slate-100 overflow-hidden font-arial select-none"
      style={{ backgroundColor: palette.dominant60.base }}
    >
      {/* Top Application Bar */}
      <TopBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        selectedDateSort={selectedDateSort}
        onSelectDateSort={setSelectedDateSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => {
          setEditingNode(null);
          setIsEditorOpen(true);
        }}
        onAutoLayout={handleAutoLayout}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenPalette={() => setIsPaletteModalOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenAspectsHub={() => setIsAspectsHubOpen(true)}
        onExportJSON={handleExportJSON}
        onExportDocument={handleExportDocument}
        onImportJSON={handleImportJSON}
        onResetDemo={handleResetDemo}
        nodeCountsByCategory={nodeCountsByCategory}
        totalNodes={nodes.length}
        filteredCount={filteredCount}
      />

      {/* Main React Flow Canvas Area (60% Dominant Base) */}
      <main 
        className="flex-1 relative w-full h-full"
        style={{ backgroundColor: palette.dominant60.base }}
      >
        {/* Quick Paste Notification Toast */}
        {quickPasteFeedback && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/95 border border-emerald-500/80 text-emerald-200 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{quickPasteFeedback}</span>
          </div>
        )}

        <ReactFlow
          nodes={processedNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          connectionMode={ConnectionMode.Loose}
          edgesReconnectable={true}
          reconnectRadius={25}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            reactFlowInstance.current = instance;
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
          style={{ backgroundColor: palette.dominant60.base }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color={palette.dominant60.dots}
          />
          <Controls className="!bg-slate-900 !border-slate-800" />
          <MiniMap
            nodeColor={(n) => {
              const d = n.data as unknown as BrainNodeData;
              const cat = categoryMap.get(d?.categoriaId);
              return cat?.color || palette.accent10.primary;
            }}
            maskColor="rgba(15, 23, 42, 0.75)"
            className="!bg-slate-950 !border-slate-800 hidden sm:block"
            zoomable
            pannable
          />
        </ReactFlow>

        {/* Floating Quick Navigation & Tool Badges */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 font-arial flex-wrap max-w-[calc(100vw-24px)] pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsAspectsHubOpen(true)}
            className="bg-slate-900/95 hover:bg-slate-800 border border-sky-600/70 rounded-xl px-2.5 py-1.5 text-[11px] text-sky-300 font-bold shadow-xl flex items-center gap-1.5 transition-colors active:scale-95"
            title="Centro de control integral con todas las funciones"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Aspectos</span>
          </button>

          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 shadow-xl hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tip: Presiona <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-sky-300 border border-slate-700">Ctrl+V</kbd> para capturar enlaces al instante</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-sky-300 font-semibold shadow-xl flex items-center gap-1.5 transition-colors"
          >
            <Command className="w-3 h-3 text-sky-400" />
            <span>Comandos (Ctrl+K)</span>
          </button>

          <button 
            type="button"
            onClick={() => setIsManualOpen(true)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-orange-300 font-semibold shadow-xl hidden sm:flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3 h-3 text-orange-400" />
            <span>Guía</span>
          </button>
        </div>
      </main>

      {/* Modals & Drawers */}
      <NodeEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNode(null);
        }}
        onSave={handleSaveNode}
        categories={categories}
        onAddCategory={handleAddCategory}
        initialData={editingNode}
      />

      <NotionPreviewModal
        isOpen={isNotionModalOpen}
        onClose={() => {
          setIsNotionModalOpen(false);
          setNotionNode(null);
        }}
        node={notionNode}
        category={notionNode ? categoryMap.get(notionNode.categoriaId) : undefined}
        allNodes={rawNodesList}
        categories={categories}
      />

      <EdgeEditorModal
        isOpen={isEdgeModalOpen}
        onClose={() => {
          setIsEdgeModalOpen(false);
          setEditingEdgeData(null);
        }}
        edgeId={editingEdgeData?.id || null}
        initialLabel={editingEdgeData?.label || ''}
        sourceNodeTitle={editingEdgeData?.sourceTitle}
        targetNodeTitle={editingEdgeData?.targetTitle}
        initialSourceHandle={editingEdgeData?.sourceHandle}
        initialTargetHandle={editingEdgeData?.targetHandle}
        onSaveEdge={handleSaveEdge}
        onDeleteEdge={handleDeleteEdge}
      />

      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        nodes={rawNodesList}
        edges={rawEdgesList}
        categories={categories}
        onFilterCategory={setSelectedCategory}
      />

      <InstructionManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <NodeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailNode(null);
        }}
        node={detailNode}
        category={detailNode ? categoryMap.get(detailNode.categoriaId) : undefined}
        allNodes={rawNodesList}
        categories={categories}
        connectedNodes={connectedNodesForDetail}
        onSelectNode={(newNode) => setDetailNode(newNode)}
        onEditNode={(n) => {
          setIsDetailModalOpen(false);
          handleOpenEditNode(n);
        }}
        onOpenNotionModal={(n) => {
          setIsDetailModalOpen(false);
          handleOpenNotionModal(n);
        }}
        onFilterByCategory={(catId) => setSelectedCategory(catId)}
        onFilterByTag={(tag) => setSearchQuery(tag)}
        onToggleChecklist={handleToggleChecklist}
      />

      <PaletteModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        currentPalette={palette}
        onSelectPalette={handlePaletteSelect}
      />

      {/* Command Palette Modal (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        nodes={rawNodesList}
        categories={categories}
        onSelectNode={(nodeId) => {
          handleFocusNode(nodeId);
          const found = nodes.find(n => n.id === nodeId);
          if (found) {
            handleOpenDetailNode(found.data as unknown as BrainNodeData);
          }
        }}
        onNewNode={() => {
          setEditingNode(null);
          setIsEditorOpen(true);
        }}
        onOpenStudyReview={() => setIsReviewModalOpen(true)}
        onOpenGoogleDrive={() => setIsDriveModalOpen(true)}
      />

      {/* Spaced Repetition / Flashcards Study Review Modal */}
      <StudyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        nodes={rawNodesList}
        categories={categories}
        onUpdateNodeStatus={handleUpdateStatus}
        onFocusNode={handleFocusNode}
      />

      {/* Google Drive Cloud Backup & Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        nodes={rawNodesList}
        canvasNodes={currentBackupData.nodes}
        edges={rawEdgesList}
        categories={categories}
        currentUser={currentUser}
        onAuthChange={setCurrentUser}
        onRestoreBackup={handleRestoreData}
      />

      {/* Centralized Aspects & Features Hub Modal */}
      <AspectsHubModal
        isOpen={isAspectsHubOpen}
        onClose={() => setIsAspectsHubOpen(false)}
        onOpenCreateModal={() => {
          setEditingNode(null);
          setIsEditorOpen(true);
        }}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onAutoLayout={handleAutoLayout}
        onOpenPalette={() => setIsPaletteModalOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onExportDocument={handleExportDocument}
        onExportJSON={handleExportJSON}
        onTriggerImport={() => hubFileInputRef.current?.click()}
        onResetDemo={handleResetDemo}
        totalNodes={nodes.length}
      />

      {/* Download Feedback & Clipboard Copy Modal */}
      <DownloadFeedbackModal
        data={downloadFeedback}
        onClose={() => setDownloadFeedback((prev) => ({ ...prev, isOpen: false }))}
      />

      <input
        ref={hubFileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportJSON(file);
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
}
