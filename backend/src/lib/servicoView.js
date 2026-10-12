// Converte um Servico do Prisma para o JSON da API.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 90 → "1h30", 60 → "1h", 45 → "45 min". */
function formatarDuracao(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function servicoView(servico) {
  const precoBase = servico.precoBaseCentavos / 100;
  return {
    id: servico.slug,
    nome: servico.nome,
    descricao: servico.descricao,
    precoBase,
    precoBaseFormatado: brl.format(precoBase),
    duracaoMin: servico.duracaoMin,
    duracaoFormatada: formatarDuracao(servico.duracaoMin),
  };
}

module.exports = { servicoView, formatarDuracao };
