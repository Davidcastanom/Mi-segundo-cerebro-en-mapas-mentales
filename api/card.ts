// Vercel Serverless Function: Generates dynamic 1200x630 OpenGraph SVG image for Notion
export default function handler(req: any, res: any) {
  const {
    title = 'Mi Segundo Cerebro',
    category = 'General',
    reason = 'Idea organizada en mi mapa visual de aprendizaje',
    color = '38bdf8',
    type = 'Concepto',
    tags = ''
  } = req.query || {};

  const cleanColor = color.startsWith('#') ? color : `#${color}`;
  const displayTitle = String(title).slice(0, 70);
  const displayReason = String(reason).slice(0, 200);
  const displayCategory = String(category).slice(0, 30);
  const displayType = String(type).slice(0, 25).toUpperCase();
  const displayTags = String(tags) ? String(tags).split(',').map(t => `#${t.trim()}`).join('  ') : '#Aprendizaje';

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#001621" />
        <stop offset="100%" stop-color="#022436" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${cleanColor}" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    
    <!-- Outer Card Frame -->
    <rect x="28" y="28" width="1144" height="574" rx="24" fill="#011f30" stroke="#0d4364" stroke-width="2.5" />
    
    <!-- Accent Top Line -->
    <rect x="28" y="28" width="1144" height="12" rx="6" fill="url(#accentGrad)" />
    
    <!-- Header: App Brand + Category Badge -->
    <g transform="translate(70, 75)">
      <!-- Brand icon + name -->
      <circle cx="20" cy="20" r="16" fill="${cleanColor}" fill-opacity="0.2" stroke="${cleanColor}" stroke-width="2" />
      <circle cx="20" cy="20" r="6" fill="${cleanColor}" />
      <text x="50" y="26" fill="#87b5d1" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" letter-spacing="1">MI SEGUNDO CEREBRO</text>
      
      <!-- Category Badge -->
      <rect x="730" y="0" width="310" height="42" rx="21" fill="${cleanColor}" fill-opacity="0.2" stroke="${cleanColor}" stroke-width="1.8" />
      <text x="885" y="27" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">${escapeXml(displayCategory)}</text>
    </g>

    <!-- Node Type Tag -->
    <g transform="translate(70, 150)">
      <rect x="0" y="0" width="220" height="34" rx="8" fill="#022436" stroke="#0d4364" stroke-width="1.2" />
      <text x="110" y="22" text-anchor="middle" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="1">${escapeXml(displayType)}</text>
    </g>

    <!-- Title (og:title) -->
    <g transform="translate(70, 235)">
      <text x="0" y="20" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800">${escapeXml(displayTitle)}</text>
    </g>

    <!-- Reason Box (¿Por qué lo guardé?) -->
    <g transform="translate(70, 310)">
      <rect x="0" y="0" width="1050" height="175" rx="16" fill="#001621" stroke="#0d4364" stroke-width="1.8" />
      <rect x="0" y="0" width="8" height="175" rx="4" fill="${cleanColor}" />
      
      <text x="32" y="44" fill="${cleanColor}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" letter-spacing="1">¿POR QUÉ LO GUARDÉ? (RAZÓN DE APRENDIZAJE):</text>
      <text x="32" y="95" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" font-style="italic">
        "${escapeXml(displayReason)}"
      </text>
    </g>

    <!-- Footer metadata and tags -->
    <g transform="translate(70, 545)">
      <text x="0" y="20" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">${escapeXml(displayTags)}</text>
      <text x="1050" y="20" text-anchor="end" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="16">Tarjeta Personalizada para Notion • 1200 × 630</text>
    </g>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(svg);
}
