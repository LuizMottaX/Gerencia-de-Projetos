// Gera dist/robots.txt e dist/sitemap.xml depois do `vite build`.
// O sitemap precisa de URLs absolutas: defina SITE_URL (ex.: https://chiquinhomotors.vercel.app).
// Sem SITE_URL, gera só o robots.txt (sem a linha Sitemap).

import { writeFileSync } from 'node:fs';

const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, '');

// Páginas públicas e estáveis. Detalhes de carro/peça mudam com o catálogo e
// são alcançados pelos links das listas.
const ROTAS = [
  ['/', '1.0'],
  ['/carros', '0.9'],
  ['/pecas', '0.9'],
  ['/acessorios', '0.9'],
  ['/servicos', '0.9'],
  ['/dicas', '0.5'],
  ['/noticias', '0.5'],
  ['/contato', '0.6'],
  ['/sobre', '0.5'],
];

const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /carrinho',
  'Disallow: /checkout',
  ...(SITE_URL ? ['', `Sitemap: ${SITE_URL}/sitemap.xml`] : []),
  '',
].join('\n');
writeFileSync('dist/robots.txt', robots);

if (SITE_URL) {
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = ROTAS.map(
    ([rota, prioridade]) =>
      `  <url><loc>${SITE_URL}${rota}</loc><lastmod>${hoje}</lastmod><priority>${prioridade}</priority></url>`,
  ).join('\n');
  writeFileSync(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`✔ robots.txt e sitemap.xml (${ROTAS.length} URLs) para ${SITE_URL}`);
} else {
  console.log('⚠ SITE_URL não definido: gerado só o robots.txt (sem sitemap).');
}
