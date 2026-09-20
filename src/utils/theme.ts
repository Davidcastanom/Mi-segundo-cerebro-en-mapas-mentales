export interface Palette60_30_10 {
  id: string;
  name: string;
  description: string;
  // Los dos colores base
  colorA: string; // Color 1: Base/Dominante
  colorB: string; // Color 2: Acento/Luz
  // Distribución matemática 60%, 30%, 10%
  dominant60: {
    base: string;        // Fondo de pantalla y canvas (60%)
    elevated: string;    // Superficie profunda
    dots: string;        // Puntos de rejilla
  };
  secondary30: {
    surface: string;     // Tarjetas, cabecera, modales, cajones (30%)
    surfaceHover: string;
    border: string;      // Bordes estructurales
    mutedText: string;   // Metadatos y etiquetas secundarias
  };
  accent10: {
    primary: string;     // Botones de acción, indicadores focales, aristas seleccionadas (10%)
    primaryHover: string;
    glow: string;        // Resplandor y halo
    textOnAccent: string;// Contraste óptimo
  };
}

export const PRESET_PALETTES: Palette60_30_10[] = [
  {
    id: 'deep-petrol-fire-orange',
    name: 'Azul Abisal & Naranja Fuego (#001621 + #FF4103)',
    description: 'Paleta principal: 60% lienzo azul medianoche abisal (#001621), 30% superficies estructuradas en petróleo (#022436), 10% acento fuego (#FF4103).',
    colorA: '#001621',
    colorB: '#FF4103',
    dominant60: {
      base: '#001621',
      elevated: '#001b29',
      dots: '#0b344d',
    },
    secondary30: {
      surface: '#022436',
      surfaceHover: '#042f47',
      border: '#0d4364',
      mutedText: '#87b5d1',
    },
    accent10: {
      primary: '#FF4103',
      primaryHover: '#ff5c26',
      glow: 'rgba(255, 65, 3, 0.4)',
      textOnAccent: '#ffffff',
    },
  },
  {
    id: 'indigo-cyan',
    name: 'Índigo Profundo & Cyan Eléctrico',
    description: 'Variación alternativa: 60% lienzo nocturno índigo, 30% superficies pizarra, 10% acentos cyan.',
    colorA: '#090d1a',
    colorB: '#38bdf8',
    dominant60: {
      base: '#070a14',
      elevated: '#0b101f',
      dots: '#1e293b',
    },
    secondary30: {
      surface: '#0f172a',
      surfaceHover: '#17233f',
      border: '#1e2d4a',
      mutedText: '#94a3b8',
    },
    accent10: {
      primary: '#0284c7',
      primaryHover: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.35)',
      textOnAccent: '#030712',
    },
  },
  {
    id: 'obsidian-amber',
    name: 'Obsidiana & Ámbar Dorado',
    description: 'Paleta cálida editorial: 60% carbón obsidiana, 30% grafito estructurado, 10% acentos ámbar dorado.',
    colorA: '#0c0a09',
    colorB: '#f59e0b',
    dominant60: {
      base: '#0a0908',
      elevated: '#141210',
      dots: '#292524',
    },
    secondary30: {
      surface: '#1c1917',
      surfaceHover: '#292524',
      border: '#3d342c',
      mutedText: '#a8a29e',
    },
    accent10: {
      primary: '#d97706',
      primaryHover: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.35)',
      textOnAccent: '#0c0a09',
    },
  },
  {
    id: 'forest-emerald',
    name: 'Noche Bosque & Esmeralda Neón',
    description: 'Paleta bio-tech: 60% verde oscuro abisal, 30% salvia pizarra estructural, 10% esmeralda vibrante.',
    colorA: '#04130d',
    colorB: '#10b981',
    dominant60: {
      base: '#030d09',
      elevated: '#061a12',
      dots: '#133527',
    },
    secondary30: {
      surface: '#0a2318',
      surfaceHover: '#113526',
      border: '#1b4a35',
      mutedText: '#86efac',
    },
    accent10: {
      primary: '#059669',
      primaryHover: '#10b981',
      glow: 'rgba(16, 185, 129, 0.35)',
      textOnAccent: '#02180e',
    },
  },
  {
    id: 'violet-sunset',
    name: 'Amatista Abisal & Coral Flúor',
    description: 'Paleta creativa: 60% violeta noche profundo, 30% ciruela estructural, 10% coral neón focal.',
    colorA: '#0d071a',
    colorB: '#f43f5e',
    dominant60: {
      base: '#0a0514',
      elevated: '#120b22',
      dots: '#2d1b47',
    },
    secondary30: {
      surface: '#190e30',
      surfaceHover: '#241444',
      border: '#3c216c',
      mutedText: '#c084fc',
    },
    accent10: {
      primary: '#e11d48',
      primaryHover: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.35)',
      textOnAccent: '#0f0208',
    },
  },
];

const THEME_STORAGE_KEY = 'mi_segundo_cerebro_palette_60_30_10_v2';

export function obtenerPaletaGuardada(): Palette60_30_10 {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.dominant60 && parsed.secondary30 && parsed.accent10) {
        return parsed;
      }
    }
  } catch {
    // Usar predeterminada si falla
  }
  return PRESET_PALETTES[0];
}

export function guardarPaleta(paleta: Palette60_30_10): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(paleta));
    aplicarVariablesCSS(paleta);
  } catch (err) {
    console.error('Error guardando paleta:', err);
  }
}

/**
 * Generador matemático de paleta 60-30-10 a partir de 2 colores
 */
export function generarPaletaDesdeDosColores(
  color1: string,
  color2: string,
  nombre: string = 'Personalizada (2 Colores)'
): Palette60_30_10 {
  return {
    id: `custom-${Date.now()}`,
    name: nombre,
    description: `Generada con proporción 60-30-10 desde ${color1} y ${color2}.`,
    colorA: color1,
    colorB: color2,
    dominant60: {
      base: ajustarBrilloHex(color1, -0.65), // 60% Fondo profundo
      elevated: ajustarBrilloHex(color1, -0.45),
      dots: ajustarBrilloHex(color1, 0.1),
    },
    secondary30: {
      surface: ajustarBrilloHex(color1, -0.3), // 30% Superficie estructural
      surfaceHover: ajustarBrilloHex(color1, -0.15),
      border: ajustarBrilloHex(color1, 0.2),
      mutedText: '#94a3b8',
    },
    accent10: {
      primary: color2, // 10% Acento focal
      primaryHover: ajustarBrilloHex(color2, 0.2),
      glow: `${color2}55`,
      textOnAccent: '#ffffff',
    },
  };
}

/**
 * Inyectar variables CSS en :root
 */
export function aplicarVariablesCSS(p: Palette60_30_10): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // 60% Dominante
  root.style.setProperty('--color-dom-60-base', p.dominant60.base);
  root.style.setProperty('--color-dom-60-elevated', p.dominant60.elevated);
  root.style.setProperty('--color-dom-60-dots', p.dominant60.dots);

  // 30% Secundario
  root.style.setProperty('--color-sec-30-surface', p.secondary30.surface);
  root.style.setProperty('--color-sec-30-hover', p.secondary30.surfaceHover);
  root.style.setProperty('--color-sec-30-border', p.secondary30.border);
  root.style.setProperty('--color-sec-30-muted', p.secondary30.mutedText);

  // 10% Acento
  root.style.setProperty('--color-acc-10-primary', p.accent10.primary);
  root.style.setProperty('--color-acc-10-hover', p.accent10.primaryHover);
  root.style.setProperty('--color-acc-10-glow', p.accent10.glow);
  root.style.setProperty('--color-acc-10-text', p.accent10.textOnAccent);
}

/**
 * Ajustar brillo de un color HEX (-1.0 a 1.0)
 */
function ajustarBrilloHex(hex: string, factor: number): string {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  if (cleaned.length !== 6) return hex;

  const num = parseInt(cleaned, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  if (factor > 0) {
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
  } else {
    const f = 1 + factor;
    r = Math.round(r * f);
    g = Math.round(g * f);
    b = Math.round(b * f);
  }

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
