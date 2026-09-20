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
  ReactFlowInstance,
} from '@xyflow/react';
import { BookOpen } from 'lucide-react';

import { 
  BrainNodeData, 
  Category, 
  NodeType, 
  BrainEdgeData,
  DateFilterType,
  DateSortType
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
  descargarArchivo
} from './utils/textUtils';

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

  // Sync to LocalStorage
  useEffect(() => {
    const serializedNodes = nodes.map((n) => ({
      id: n.id,
      position: n.position,
      data: n.data as unknown as BrainNodeData,
    }));
    localStorage.setItem(`${STORAGE_KEY}_nodes`, JSON.stringify(serializedNodes));
  }, [nodes]);

  useEffect(() => {
    const serializedEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      etiqueta: typeof e.label === 'string' ? e.label : '',
    }));
    localStorage.setItem(`${STORAGE_KEY}_edges`, JSON.stringify(serializedEdges));
  }, [edges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
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

  // Handler: Open Node Editor
  const handleOpenEditNode = useCallback((nodeData: BrainNodeData) => {
    setEditingNode(nodeData);
    setIsEditorOpen(true);
  }, []);

  // Handler: Delete Node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Handler: Open Notion preview modal
  const handleOpenNotionModal = useCallback((nodeData: BrainNodeData) => {
    setNotionNode(nodeData);
    setIsNotionModalOpen(true);
  }, []);

  // Handler: Open Node Detail modal (Ficha y Documento)
  const handleOpenDetailNode = useCallback((nodeData: BrainNodeData) => {
    setDetailNode(nodeData);
    setIsDetailModalOpen(true);
  }, []);

  // Handler: Save Node (from modal)
  const handleSaveNode = useCallback(
    (nodeData: Partial<BrainNodeData>) => {
      if (editingNode) {
        // Update existing node
        setNodes((nds) =>
          nds.map((n) => {
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
          })
        );
      } else {
        // Create new node
        const newId = `node-${Date.now()}`;
        const defaultPosition = {
          x: 200 + (nodes.length % 4) * 360,
          y: 120 + Math.floor(nodes.length / 4) * 340,
        };

        const newNode: Node = {
          id: newId,
          type: 'brainNode',
          position: defaultPosition,
          data: {
            id: newId,
            tipo: nodeData.tipo || 'enlace',
            titulo: nodeData.titulo || 'Nuevo Recurso',
            contenido: nodeData.contenido || '',
            categoriaId: nodeData.categoriaId || categories[0]?.id || 'ingles',
            etiquetas: nodeData.etiquetas || [],
            fechaCreacion: new Date().toISOString().split('T')[0],
            razonModo: nodeData.razonModo || 'manual',
            razonManual: nodeData.razonManual || '',
            imagenUrl: nodeData.imagenUrl,
            plataforma: nodeData.plataforma,
          },
        };

        setNodes((nds) => [...nds, newNode]);
      }
      setIsEditorOpen(false);
      setEditingNode(null);
    },
    [editingNode, categories, nodes.length, setNodes]
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

  // Filter and search matching
  const processedNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return nodes
      .filter((node) => !hiddenNodeIds.has(node.id))
      .map((node) => {
        const data = node.data as unknown as BrainNodeData;
        const cat = categoryMap.get(data.categoriaId);
        const reason = obtenerRazonEfectiva(data).toLowerCase();
        const title = (data.titulo || '').toLowerCase();
        const content = (data.contenido || '').toLowerCase();
        const tags = (data.etiquetas || []).map((t) => t.toLowerCase());

        // Category filter match
        const matchesCategory = !selectedCategory || data.categoriaId === selectedCategory;

        // Type filter match
        const matchesType = selectedType === 'todos' || data.tipo === selectedType;

        // Date filter match
        const matchesDate = coincideFiltroFecha(data.fechaCreacion, selectedDate);

        // Search match
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
          selectedDate !== 'todas';

        const matchesAll = matchesCategory && matchesType && matchesDate && matchesSearch;

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
          },
        };
      });
  }, [
    nodes,
    hiddenNodeIds,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedDate,
    categoryMap,
    childrenMap,
    collapsedNodeIds,
    handleOpenEditNode,
    handleDeleteNode,
    handleOpenNotionModal,
    handleToggleCollapse,
    handleOpenDetailNode,
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
      const matchesDate = coincideFiltroFecha(data.fechaCreacion, selectedDate);
      const matchesSearch =
        !q ||
        title.includes(q) ||
        reason.includes(q) ||
        content.includes(q) ||
        tags.some((t) => t.includes(q)) ||
        (cat?.nombre.toLowerCase().includes(q) ?? false);

      return matchesCategory && matchesType && matchesDate && matchesSearch;
    }).length;
  }, [nodes, searchQuery, selectedCategory, selectedType, selectedDate, categoryMap]);

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

      // Sort items within column according to selectedDateSort
      items.sort((a, b) => {
        const da = a.data.fechaCreacion || '';
        const db = b.data.fechaCreacion || '';
        return selectedDateSort === 'recientes'
          ? db.localeCompare(da)
          : da.localeCompare(db);
      });

      items.forEach((item, rowIndex) => {
        newPositions.set(item.id, {
          x: 80 + colIndex * spacingX,
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
      reactFlowInstance.current?.fitView({ padding: 0.2, duration: 400 });
    }, 50);
  }, [categories, nodes, setNodes, selectedDateSort]);

  // Export JSON Backup
  const handleExportJSON = useCallback(() => {
    const backupData = {
      version: 1,
      appName: 'Mi Segundo Cerebro',
      exportedAt: new Date().toISOString(),
      categories,
      nodes: nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        etiqueta: typeof e.label === 'string' ? e.label : '',
      })),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mi-segundo-cerebro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [categories, nodes, edges]);

  // Export Full Document (Dossier Markdown or HTML)
  const handleExportDocument = useCallback(
    (format: 'md' | 'html') => {
      const nodesToExport = processedNodes.map((n) => n.data as unknown as BrainNodeData);
      const dateStr = new Date().toISOString().split('T')[0];

      if (format === 'md') {
        const md = generarDossierCompletoMarkdown(nodesToExport, categories);
        descargarArchivo(`mi-segundo-cerebro-dossier-${dateStr}.md`, md, 'text/markdown');
      } else {
        const html = generarDossierCompletoHTML(nodesToExport, categories);
        descargarArchivo(`mi-segundo-cerebro-dossier-${dateStr}.html`, html, 'text/html');
      }
    },
    [processedNodes, categories]
  );

  // Import JSON Backup
  const handleImportJSON = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);

          if (parsed.categories && Array.isArray(parsed.categories)) {
            setCategories(parsed.categories);
          }

          if (parsed.nodes && Array.isArray(parsed.nodes)) {
            setNodes(
              parsed.nodes.map((n: CanvasNodeItem) => ({
                id: n.id,
                type: 'brainNode',
                position: n.position || { x: 100, y: 100 },
                data: n.data as unknown as Record<string, unknown>,
              }))
            );
          }

          if (parsed.edges && Array.isArray(parsed.edges)) {
            setEdges(
              parsed.edges.map((edge: BrainEdgeData) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle || 'bottom',
                targetHandle: edge.targetHandle || 'top',
                label: edge.etiqueta,
                animated: true,
                reconnectable: true,
                style: { stroke: '#38bdf8', strokeWidth: 2.5 },
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
        } catch (err) {
          alert('Error al importar el archivo JSON. Verifica que sea un respaldo válido.');
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
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

  // Extract raw node data for metrics
  const rawNodesList = useMemo(
    () => nodes.map((n) => n.data as unknown as BrainNodeData),
    [nodes]
  );
  const rawEdgesList = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        etiqueta: typeof e.label === 'string' ? e.label : '',
      })),
    [edges]
  );

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
            className="!bg-slate-950 !border-slate-800"
            zoomable
            pannable
          />
        </ReactFlow>

        {/* Floating Quick Hint Badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 shadow-xl hidden sm:flex items-center gap-2 font-arial">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>4 puntos de conexión por cuadro: arrastra para conectar o cambiar extremos</span>
          <button 
            type="button"
            onClick={() => setIsManualOpen(true)}
            className="ml-1 text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            <span>Manual de Instrucciones</span>
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
      />

      <PaletteModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        currentPalette={palette}
        onSelectPalette={handlePaletteSelect}
      />
    </div>
  );
}
