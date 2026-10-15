// "Óleo 5W30 Sintético" → "oleo-5w30-sintetico"
function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Slug livre na tabela: "filtro-de-oleo", "filtro-de-oleo-2", ... */
async function slugUnico(delegate, texto) {
  const base = slugify(texto) || 'item';
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await delegate.findUnique({ where: { slug }, select: { slug: true } }))) return slug;
  }
}

module.exports = { slugify, slugUnico };
