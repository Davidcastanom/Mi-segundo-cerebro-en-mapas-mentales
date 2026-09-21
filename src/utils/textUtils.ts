import { BrainNodeData, Category } from '../types';

/**
 * Opción B — Automática:
 * Si dejas el campo vacío o eliges modo automático, toma las primeras ~140 palabras
 * de la nota del nodo y las recorta a un resumen corto cortando en el punto o coma
 * más cercano, no a mitad de palabra (requisito del usuario).
 */
export function generarRazonAutomatica(contenido: string, maxPalabras: number = 28): string {
  if (!contenido) return 'Recurso guardado para referencia y estudio.';
  
  // Limpiar posibles URLs o formato excesivo
  const textoLimpio = contenido
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[#*_`~]/g, '')
    .trim();

  if (!textoLimpio) return 'Recurso guardado en mi bitácora de aprendizaje.';

  const palabras = textoLimpio.split(/\s+/);
  if (palabras.length <= maxPalabras) {
    return textoLimpio;
  }

  // Tomar hasta maxPalabras y buscar puntuación cercana
  const palabrasCorte = palabras.slice(0, maxPalabras);
  const textoPreliminar = palabrasCorte.join(' ');
  
  // Buscar último punto, coma o punto y coma
  const ultimoPunto = Math.max(
    textoPreliminar.lastIndexOf('.'),
    textoPreliminar.lastIndexOf(','),
    textoPreliminar.lastIndexOf(';')
  );

  if (ultimoPunto > textoPreliminar.length * 0.6) {
    return textoPreliminar.substring(0, ultimoPunto).trim() + '.';
  }

  return textoPreliminar.trim() + '...';
}

/**
 * Obtener la razón efectiva según la configuración (manual o automática)
 */
export function obtenerRazonEfectiva(node: BrainNodeData): string {
  if (node.razonModo === 'manual' && node.razonManual && node.razonManual.trim().length > 0) {
    return node.razonManual.trim();
  }
  return generarRazonAutomatica(node.contenido);
}

/**
 * Formatear título para Notion OpenGraph (Máx 50-60 caracteres)
 */
export function formatearTituloNotion(titulo: string): string {
  const maxChars = 58;
  if (!titulo) return 'Recurso de aprendizaje';
  if (titulo.length <= maxChars) return titulo;
  return titulo.substring(0, maxChars - 3).trim() + '...';
}

/**
 * Formatear descripción/razón para Notion OpenGraph (Máx 140-160 caracteres)
 */
export function formatearDescripcionNotion(razon: string): string {
  const maxChars = 150;
  if (!razon) return 'Guardado en Mi Segundo Cerebro';
  if (razon.length <= maxChars) return razon;
  return razon.substring(0, maxChars - 3).trim() + '...';
}

/**
 * Detectar tipo de plataforma desde URL
 */
export function detectarPlataforma(url: string): 'instagram' | 'youtube' | 'web' | 'otro' {
  if (!url) return 'web';
  const u = url.toLowerCase();
  if (u.includes('instagram.com/reel') || u.includes('instagram.com/p/') || u.includes('instagr.am')) {
    return 'instagram';
  }
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    return 'youtube';
  }
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return 'web';
  }
  return 'otro';
}

/**
 * Genera una tarjeta de vista previa visual OpenGraph en formato SVG/DataURL (1200 x 630 px)
 * Cumple con el estándar de Notion (1200 x 630, 1.91:1)
 */
export function generarCardNotionSVG(
  node: BrainNodeData,
  categoria: Category
): string {
  const ogTitle = formatearTituloNotion(node.titulo);
  const ogReason = formatearDescripcionNotion(obtenerRazonEfectiva(node));
  const categoryName = categoria?.nombre || 'General';
  const categoryColor = categoria?.color || '#3b82f6';
  const typeLabel = node.tipo === 'enlace' 
    ? (node.plataforma === 'instagram' ? 'INSTAGRAM REEL' : 'ENLACE RECURSO')
    : node.tipo === 'imagen' ? 'IMAGEN DE REFERENCIA' : 'NOTA DE ESTUDIO';

  const tagsList = (node.etiquetas || []).slice(0, 3).map(t => `#${t}`).join('  ');

  // Escapar strings para SVG seguro
  const escapeXML = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${categoryColor}" />
        <stop offset="100%" stop-color="#60a5fa" />
      </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    
    <!-- Outer Border Glow -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="2" />
    
    <!-- Category Top Bar Accent -->
    <rect x="24" y="24" width="1152" height="12" rx="6" fill="url(#accentGrad)" />
    
    <!-- Header Brand & Badge -->
    <g transform="translate(70, 80)">
      <!-- Brand icon + name -->
      <circle cx="20" cy="20" r="16" fill="${categoryColor}" fill-opacity="0.2" stroke="${categoryColor}" stroke-width="2" />
      <circle cx="20" cy="20" r="6" fill="${categoryColor}" />
      <text x="50" y="26" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" letter-spacing="1">MI SEGUNDO CEREBRO</text>
      
      <!-- Category Badge -->
      <rect x="740" y="0" width="280" height="40" rx="20" fill="${categoryColor}" fill-opacity="0.2" stroke="${categoryColor}" stroke-width="1.5" />
      <text x="880" y="26" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">${escapeXML(categoryName)}</text>
    </g>

    <!-- Node Type Pill -->
    <g transform="translate(70, 160)">
      <rect x="0" y="0" width="240" height="34" rx="8" fill="#334155" />
      <text x="120" y="22" text-anchor="middle" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="1">${escapeXML(typeLabel)}</text>
    </g>

    <!-- Title (og:title) -->
    <g transform="translate(70, 240)">
      <text x="0" y="30" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800">${escapeXML(ogTitle)}</text>
    </g>

    <!-- Reason Box (¿Por qué lo guardé?) -->
    <g transform="translate(70, 320)">
      <rect x="0" y="0" width="1060" height="160" rx="16" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1.5" />
      
      <text x="32" y="44" fill="${categoryColor}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" letter-spacing="1">¿POR QUÉ LO GUARDÉ? (RAZÓN DE APRENDIZAJE):</text>
      <text x="32" y="90" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" width="990">
        ${escapeXML(ogReason)}
      </text>
    </g>

    <!-- Footer metadata and tags -->
    <g transform="translate(70, 530)">
      <text x="0" y="26" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500">Fecha: ${escapeXML(node.fechaCreacion || '2026')}</text>
      <text x="300" y="26" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">${escapeXML(tagsList)}</text>
      <text x="1060" y="26" text-anchor="end" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="18">Optimizado para Notion (1200 × 630)</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Convierte un Data URL de SVG a un Blob de tipo PNG en alta resolución (1200x630)
 * para permitir copiar directamente como imagen nativa al portapapeles y pegar en Notion (Ctrl+V)
 */
export async function convertirSvgDataUrlAPngBlob(svgDataUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto 2D del canvas'));
        return;
      }
      ctx.fillStyle = '#001621';
      ctx.fillRect(0, 0, 1200, 630);
      ctx.drawImage(img, 0, 0, 1200, 630);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Fallo en canvas.toBlob'));
        }
      }, 'image/png', 0.95);
    };
    img.onerror = (err) => reject(err);
    img.src = svgDataUrl;
  });
}

/**
 * Genera una tarjeta OpenGraph (1200x630) para el MAPA MENTAL COMPLETO
 * para que el usuario pueda previsualizar o compartir el mapa global en Notion
 */
export function generarCardMapaCompletoSVG(
  tituloMapa: string,
  totalNodos: number,
  categorias: Category[],
  totalChecklist: number,
  totalTags: number
): string {
  const escapeXML = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const displayTitle = formatearTituloNotion(tituloMapa || 'Mi Mapa Mental de Aprendizaje');
  const catNames = (categorias || []).slice(0, 4).map(c => c.nombre).join(' • ') || 'Conceptos';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bgGradMap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#001621" />
        <stop offset="100%" stop-color="#022436" />
      </linearGradient>
      <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#ff4103" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
    </defs>
    
    <rect width="1200" height="630" fill="url(#bgGradMap)" />
    
    <!-- Outer Card Frame -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="#011f30" stroke="#0d4364" stroke-width="2.5" />
    <rect x="24" y="24" width="1152" height="12" rx="6" fill="url(#glowLine)" />
    
    <!-- Header -->
    <g transform="translate(70, 75)">
      <circle cx="20" cy="20" r="16" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" />
      <circle cx="20" cy="20" r="6" fill="#38bdf8" />
      <text x="50" y="26" fill="#87b5d1" font-family="system-ui, sans-serif" font-size="20" font-weight="700" letter-spacing="1">MI SEGUNDO CEREBRO • MAPA GENERAL</text>
      
      <rect x="760" y="0" width="270" height="42" rx="21" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1.8" />
      <text x="895" y="27" text-anchor="middle" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="700">MAPA INTERACTIVO</text>
    </g>

    <!-- Map Title -->
    <g transform="translate(70, 180)">
      <text x="0" y="36" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="46" font-weight="800">${escapeXML(displayTitle)}</text>
      <text x="0" y="80" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="20" font-weight="600">${escapeXML(catNames)}</text>
    </g>

    <!-- Metrics Cards Grid -->
    <g transform="translate(70, 310)">
      <!-- Card 1: Nodos -->
      <rect x="0" y="0" width="240" height="140" rx="16" fill="#001621" stroke="#0d4364" stroke-width="1.8" />
      <text x="24" y="45" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">MÓDULOS / NODOS</text>
      <text x="24" y="105" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="48" font-weight="900">${totalNodos}</text>

      <!-- Card 2: Materias -->
      <rect x="270" y="0" width="240" height="140" rx="16" fill="#001621" stroke="#0d4364" stroke-width="1.8" />
      <text x="294" y="45" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">CATEGORÍAS</text>
      <text x="294" y="105" fill="#ff4103" font-family="system-ui, sans-serif" font-size="48" font-weight="900">${categorias.length}</text>

      <!-- Card 3: Pasos / Checklist -->
      <rect x="540" y="0" width="240" height="140" rx="16" fill="#001621" stroke="#0d4364" stroke-width="1.8" />
      <text x="564" y="45" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">PASOS DE PRÁCTICA</text>
      <text x="564" y="105" fill="#10b981" font-family="system-ui, sans-serif" font-size="48" font-weight="900">${totalChecklist}</text>

      <!-- Card 4: Tags -->
      <rect x="810" y="0" width="240" height="140" rx="16" fill="#001621" stroke="#0d4364" stroke-width="1.8" />
      <text x="834" y="45" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="700">ETIQUETAS CLAVE</text>
      <text x="834" y="105" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="48" font-weight="900">${totalTags}</text>
    </g>

    <!-- Footer -->
    <g transform="translate(70, 545)">
      <text x="0" y="20" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Bitácora Visual de Aprendizaje • Listo para incrustar en Notion</text>
      <text x="1050" y="20" text-anchor="end" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="16" font-weight="600">Resolución 1200 × 630 px</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Formatear fecha a formato corto legible (ej: 18 sep 2026)
 */
export function formatearFechaLegible(fechaStr?: string): string {
  if (!fechaStr) return 'Sin fecha';
  try {
    const d = new Date(fechaStr.includes('T') ? fechaStr : `${fechaStr}T12:00:00`);
    if (isNaN(d.getTime())) return fechaStr;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}

/**
 * Formatear fecha completa (ej: 18 de septiembre de 2026)
 */
export function formatearFechaCompleta(fechaStr?: string): string {
  if (!fechaStr) return 'Sin fecha registrada';
  try {
    const d = new Date(fechaStr.includes('T') ? fechaStr : `${fechaStr}T12:00:00`);
    if (isNaN(d.getTime())) return fechaStr;
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}

/**
 * Tiempo relativo amigable (ej: Hoy, Ayer, Hace 3 días)
 */
export function tiempoRelativo(fechaStr?: string): string {
  if (!fechaStr) return '';
  try {
    const d = new Date(fechaStr.includes('T') ? fechaStr : `${fechaStr}T12:00:00`);
    if (isNaN(d.getTime())) return '';
    
    const hoy = new Date();
    const diffMs = hoy.getTime() - d.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Ayer';
    if (diffDias > 1 && diffDias < 30) return `Hace ${diffDias} días`;
    if (diffDias >= 30 && diffDias < 60) return 'Hace 1 mes';
    if (diffDias >= 60) return `Hace ${Math.floor(diffDias / 30)} meses`;
    return 'Reciente';
  } catch {
    return '';
  }
}

/**
 * Comprobar si una fecha coincide con el filtro de fecha activo
 */
export function coincideFiltroFecha(fechaStr?: string, filtro: string = 'todas'): boolean {
  if (filtro === 'todas') return true;
  if (!fechaStr) return false;

  try {
    const fecha = new Date(fechaStr.includes('T') ? fechaStr : `${fechaStr}T12:00:00`);
    if (isNaN(fecha.getTime())) return true;

    const hoy = new Date();
    const diffMs = hoy.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    switch (filtro) {
      case 'hoy':
        return (
          fecha.getFullYear() === hoy.getFullYear() &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getDate() === hoy.getDate()
        );
      case '7dias':
        return diffDias >= 0 && diffDias <= 7;
      case '30dias':
        return diffDias >= 0 && diffDias <= 30;
      case 'esteMes':
        return (
          fecha.getFullYear() === hoy.getFullYear() &&
          fecha.getMonth() === hoy.getMonth()
        );
      default:
        return true;
    }
  } catch {
    return true;
  }
}

export interface ConnectedNodeInfo {
  id: string;
  titulo: string;
  categoriaNombre?: string;
  tipo: string;
  relacion?: string;
  direccion: 'entrante' | 'saliente';
}

/**
 * Generar documento Markdown estructurado listo para descargar
 */
export function generarDocumentoMarkdown(
  node: BrainNodeData,
  category?: Category,
  conexiones: ConnectedNodeInfo[] = []
): string {
  const razon = obtenerRazonEfectiva(node);
  const tagsFormatted = (node.etiquetas || []).map((t) => `#${t}`).join(' ');

  let md = `---
title: "${node.titulo.replace(/"/g, '\\"')}"
category: "${category?.nombre || 'General'}"
type: "${node.tipo}"
created_at: "${node.fechaCreacion || new Date().toISOString()}"
tags: [${(node.etiquetas || []).map((t) => `"${t}"`).join(', ')}]
---

# 🧠 ${node.titulo}

- **Materia / Tema**: ${category?.nombre || 'General'}
- **Tipo de Recurso**: ${node.tipo.toUpperCase()} ${node.plataforma ? `(${node.plataforma})` : ''}
- **Fecha de Registro**: ${formatearFechaCompleta(node.fechaCreacion)}
${node.urlOriginal || (node.tipo === 'enlace' ? `- **Enlace Original**: [Abrir Recurso](${node.contenido})` : '')}

---

## 🎯 ¿Por qué lo guardé? (Razón de Aprendizaje)
> **${razon}**  
> *(Modo: ${node.razonModo === 'manual' ? 'Manual — redacción propia' : 'Automático — extracción clave'})*

---

## 📝 Contenido y Notas de Estudio

`;

  if (node.tipo === 'nota') {
    md += `${node.contenido}\n\n`;
  } else if (node.tipo === 'enlace') {
    md += `Recurso multimedia o enlace externo guardado en la bitácora:\n\nURL: ${node.contenido}\n\n`;
    if (node.imagenUrl) {
      md += `![Vista previa](${node.imagenUrl})\n\n`;
    }
  } else if (node.tipo === 'imagen') {
    md += `Infografía o captura gráfica de referencia:\n\n![${node.titulo}](${node.contenido})\n\n`;
  }

  if (node.etiquetas && node.etiquetas.length > 0) {
    md += `**Etiquetas**: ${tagsFormatted}\n\n`;
  }

  if (conexiones.length > 0) {
    md += `---

## 🔗 Conexiones en el Segundo Cerebro

Este concepto está interconectado con las siguientes ramas de conocimiento:

`;
    conexiones.forEach((c) => {
      const dirIcon = c.direccion === 'saliente' ? '➡️' : '⬅️';
      md += `- ${dirIcon} **${c.titulo}** (${c.categoriaNombre || 'General'})${c.relacion ? ` — *Relación: ${c.relacion}*` : ''}\n`;
    });
    md += `\n`;
  }

  md += `---
*Exportado desde Mi Segundo Cerebro — Bitácora Visual de Aprendizaje.*
`;

  return md;
}

/**
 * Generar documento HTML estilizado e imprimible
 */
export function generarDocumentoHTML(
  node: BrainNodeData,
  category?: Category,
  conexiones: ConnectedNodeInfo[] = []
): string {
  const razon = obtenerRazonEfectiva(node);
  const color = category?.color || '#0284c7';
  const fecha = formatearFechaCompleta(node.fechaCreacion);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${node.titulo} | Ficha de Aprendizaje</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .header {
      border-bottom: 2px solid ${color};
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${color}20;
      color: ${color};
      border: 1px solid ${color}40;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #f8fafc;
      margin-bottom: 8px;
    }
    .meta {
      font-size: 13px;
      color: #94a3b8;
    }
    .reason-box {
      background: #0f172a;
      border-left: 4px solid ${color};
      padding: 16px 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .reason-title {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: ${color};
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .reason-text {
      font-size: 16px;
      font-style: italic;
      color: #f1f5f9;
    }
    .content-box {
      margin: 24px 0;
      white-space: pre-line;
      color: #cbd5e1;
      font-size: 15px;
    }
    .tag {
      display: inline-block;
      background: #334155;
      color: #93c5fd;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      margin-right: 6px;
      margin-bottom: 6px;
    }
    .connections {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #334155;
    }
    .connection-item {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #334155;
      padding-top: 20px;
    }
    @media print {
      body { background: #fff; color: #1e293b; padding: 0; }
      .container { border: none; box-shadow: none; padding: 20px; max-width: 100%; }
      .reason-box { background: #f8fafc; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${category?.nombre || 'General'} • ${node.tipo.toUpperCase()}</div>
      <h1>${node.titulo}</h1>
      <div class="meta">Registrado el ${fecha} • Mi Segundo Cerebro</div>
    </div>

    <div class="reason-box">
      <div class="reason-title">¿Por qué lo guardé? (Razón de Aprendizaje)</div>
      <div class="reason-text">"${razon}"</div>
    </div>

    <h2 style="font-size: 16px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Notas y Contenido</h2>
    <div class="content-box">
      ${node.tipo === 'enlace' ? `Enlace guardado: <a href="${node.contenido}" style="color: #38bdf8;" target="_blank">${node.contenido}</a>` : node.contenido}
    </div>

    ${node.imagenUrl ? `<div style="margin: 20px 0;"><img src="${node.imagenUrl}" style="max-width: 100%; border-radius: 8px; border: 1px solid #334155;" alt="Apoyo" /></div>` : ''}

    ${node.etiquetas && node.etiquetas.length > 0 ? `
    <div style="margin-top: 20px;">
      ${node.etiquetas.map((t) => `<span class="tag">#${t}</span>`).join('')}
    </div>` : ''}

    ${conexiones.length > 0 ? `
    <div class="connections">
      <h3 style="font-size: 14px; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Conexiones en la Red de Aprendizaje (${conexiones.length})</h3>
      ${conexiones.map((c) => `
        <div class="connection-item">
          <strong>${c.direccion === 'saliente' ? '➡️ Conecta hacia' : '⬅️ Proviene de'}:</strong> ${c.titulo}
          <span style="color: #64748b; font-size: 12px;">(${c.categoriaNombre || 'General'})</span>
          ${c.relacion ? `<span style="color: ${color}; font-style: italic; margin-left: 8px;">— Relación: ${c.relacion}</span>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <div class="footer">
      Mi Segundo Cerebro • Bitácora Visual de Aprendizaje
    </div>
  </div>
</body>
</html>`;
}

/**
 * Disparar la descarga directa de un archivo en el navegador
 */
export function descargarArchivo(nombre: string, contenido: string, tipoMime: string = 'text/plain') {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generar un Dossier Completo en Markdown con todos los nodos o los filtrados
 */
export function generarDossierCompletoMarkdown(
  nodes: BrainNodeData[],
  categories: Category[],
  tituloDossier: string = 'Mi Segundo Cerebro - Bitácora Completa de Aprendizaje'
): string {
  const fechaGeneracion = formatearFechaCompleta(new Date().toISOString());
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  let md = `# ${tituloDossier}\n\n`;
  md += `> **Generado el:** ${fechaGeneracion}\n`;
  md += `> **Total de nodos:** ${nodes.length}\n\n`;
  md += `---\n\n`;

  // Índice de Contenidos
  md += `## 📑 Índice de Nodos\n\n`;
  nodes.forEach((n, index) => {
    const cat = categoryMap.get(n.categoriaId);
    const fecha = formatearFechaLegible(n.fechaCreacion);
    md += `${index + 1}. [${n.titulo}](#nodo-${n.id}) - *${cat?.nombre || 'General'}* (${fecha})\n`;
  });
  md += `\n---\n\n`;

  // Nodos agrupados o secuenciales
  md += `## 📚 Contenido Detallado\n\n`;
  nodes.forEach((n, index) => {
    const cat = categoryMap.get(n.categoriaId);
    const razon = obtenerRazonEfectiva(n);
    const fecha = formatearFechaCompleta(n.fechaCreacion);

    md += `### <a id="nodo-${n.id}"></a>${index + 1}. ${n.titulo}\n\n`;
    md += `- **Categoría:** ${cat?.nombre || 'General'}\n`;
    md += `- **Tipo:** ${n.tipo.toUpperCase()}\n`;
    md += `- **Fecha de creación:** ${fecha}\n`;
    if (n.etiquetas && n.etiquetas.length > 0) {
      md += `- **Etiquetas:** ${n.etiquetas.map((t) => `\`#${t}\``).join(', ')}\n`;
    }
    md += `\n`;

    md += `#### 💡 ¿Por qué lo guardé? (Razón de Aprendizaje)\n`;
    md += `> "${razon}"\n\n`;

    md += `#### 📝 Notas y Contenido\n`;
    if (n.tipo === 'enlace') {
      md += `Enlace: [${n.contenido}](${n.contenido})\n\n`;
    } else {
      md += `${n.contenido}\n\n`;
    }

    if (n.imagenUrl) {
      md += `![Imagen de apoyo](${n.imagenUrl})\n\n`;
    }

    md += `---\n\n`;
  });

  md += `\n*Compilado por Mi Segundo Cerebro • Bitácora Visual de Aprendizaje*\n`;
  return md;
}

/**
 * Generar un Dossier Completo en HTML descargable para visualización o impresión
 */
export function generarDossierCompletoHTML(
  nodes: BrainNodeData[],
  categories: Category[],
  tituloDossier: string = 'Mi Segundo Cerebro - Dossier Completo'
): string {
  const fechaGeneracion = formatearFechaCompleta(new Date().toISOString());
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${tituloDossier}</title>
  <style>
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b0f19;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 40px 20px;
      margin: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #1e293b;
      padding-bottom: 24px;
      margin-bottom: 36px;
    }
    h1 { font-size: 32px; color: #f8fafc; margin: 0 0 10px 0; }
    .meta-bar { font-size: 14px; color: #94a3b8; }
    .node-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .node-title {
      font-size: 20px;
      color: #f8fafc;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .reason-box {
      background: rgba(30, 41, 59, 0.5);
      border-left: 4px solid #38bdf8;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 16px 0;
      font-style: italic;
      color: #cbd5e1;
    }
    .tag {
      display: inline-block;
      background: #1e293b;
      color: #94a3b8;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${tituloDossier}</h1>
      <div class="meta-bar">
        Generado el ${fechaGeneracion} • Total: ${nodes.length} nodos registrados
      </div>
    </div>

    ${nodes.map((n) => {
      const cat = categoryMap.get(n.categoriaId);
      const razon = obtenerRazonEfectiva(n);
      const fecha = formatearFechaLegible(n.fechaCreacion);
      const color = cat?.color || '#38bdf8';

      return `
      <div class="node-card">
        <div class="node-title">
          <span>${n.titulo}</span>
          <span class="badge" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;">
            ${cat?.nombre || 'General'}
          </span>
        </div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
          Fecha: ${fecha} • Tipo: ${n.tipo.toUpperCase()}
        </div>
        <div class="reason-box">
          <strong style="color: ${color};">¿Por qué lo guardé?</strong><br/>
          "${razon}"
        </div>
        <div style="margin: 14px 0; color: #cbd5e1; white-space: pre-wrap;">
          ${n.tipo === 'enlace' ? `<a href="${n.contenido}" style="color: #38bdf8;" target="_blank">${n.contenido}</a>` : n.contenido}
        </div>
        ${n.etiquetas && n.etiquetas.length > 0 ? `
        <div>
          ${n.etiquetas.map((t) => `<span class="tag">#${t}</span>`).join('')}
        </div>` : ''}
      </div>
      `;
    }).join('')}
  </div>
</body>
</html>`;
}
