import { reactive, ref } from 'vue';

// Erros de formulário vindos da API: `{ erro, detalhes: [{ campo, mensagem }] }`
// vira uma mensagem geral + um objeto `campos` indexado pelo nome do campo.
export function useErrosApi() {
  const geral = ref('');
  const campos = reactive({});

  function limpar() {
    geral.value = '';
    for (const chave of Object.keys(campos)) delete campos[chave];
  }

  function aplicar(e) {
    limpar();
    geral.value = e.message || 'Não foi possível salvar.';
    for (const d of e.detalhes ?? []) campos[d.campo] = d.mensagem;
  }

  return { geral, campos, limpar, aplicar };
}
