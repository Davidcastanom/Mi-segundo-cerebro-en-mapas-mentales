// Vercel Serverless Function: Generates customized OpenGraph HTML for Notion unfurl & social sharing
export default function handler(req: any, res: any) {
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost:3000';
  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const {
    title = 'Mi Segundo Cerebro',
    category = 'General',
    reason = 'Idea organizada en mi mapa visual de aprendizaje',
    id = '',
    color = '38bdf8',
    type = 'Concepto',
    tags = ''
  } = req.query || {};

  const cleanColor = String(color).replace('#', '');
  const displayTitle = String(title);
  const displayReason = String(reason);
  const displayCategory = String(category);

  // Endpoint for dynamic image card
  const cardImageUrl = `${baseUrl}/api/card?title=${encodeURIComponent(displayTitle)}&category=${encodeURIComponent(displayCategory)}&reason=${encodeURIComponent(displayReason)}&color=${cleanColor}&type=${encodeURIComponent(String(type))}&tags=${encodeURIComponent(String(tags))}`;

  // Direct app link with node focus query parameter
  const targetAppUrl = id ? `${baseUrl}/?node=${encodeURIComponent(String(id))}` : `${baseUrl}/`;

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(displayTitle)} | ${escapeHtml(displayCategory)} - Mi Segundo Cerebro</title>
  <meta name="description" content="${escapeHtml(displayReason)}">

  <!-- Open Graph / Notion Bookmark Metadata -->
  <meta property="og:site_name" content="Mi Segundo Cerebro">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(displayTitle)} | ${escapeHtml(displayCategory)}">
  <meta property="og:description" content="¿Por qué lo guardé?: &quot;${escapeHtml(displayReason)}&quot;">
  <meta property="og:image" content="${cardImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(displayTitle)} - Tarjeta de Aprendizaje">
  <meta property="og:url" content="${targetAppUrl}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(displayTitle)} | ${escapeHtml(displayCategory)}">
  <meta name="twitter:description" content="${escapeHtml(displayReason)}">
  <meta name="twitter:image" content="${cardImageUrl}">

  <!-- Redirection for human browsers -->
  <meta http-equiv="refresh" content="1;url=${targetAppUrl}">
  <script>
    window.location.replace(${JSON.stringify(targetAppUrl)});
  </script>
  <style>
    body {
      background-color: #001621;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #011f30;
      border: 1px solid #0d4364;
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    h1 { font-size: 20px; color: #f8fafc; margin-bottom: 8px; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
    a { color: #38bdf8; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Cargando "${escapeHtml(displayTitle)}"...</h1>
    <p>${escapeHtml(displayReason)}</p>
    <p>Redirigiendo a tu mapa mental interactivo...</p>
    <p><a href="${targetAppUrl}">Haz clic aquí si no redirige automáticamente</a></p>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(html);
}
