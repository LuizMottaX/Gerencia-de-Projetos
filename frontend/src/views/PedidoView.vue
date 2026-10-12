<template>
  <section class="pedido-page">
    <p v-if="carregando" class="loading">Carregando…</p>
    <p v-else-if="erro" class="error-msg">{{ erro }}</p>

    <template v-else-if="pedido">
      <div class="section-banner">
        <h1><CircleCheck :size="26" /> Pedido recebido</h1>
        <p class="banner-sub">
          Obrigado, {{ pedido.cliente?.nome }}! Guarde o código para acompanhar o pedido.
        </p>
      </div>

      <div class="pedido-inner">
        <div class="pedido-card">
          <div class="pedido-topo">
            <div>
              <span class="rotulo">Código do pedido</span>
              <p class="codigo">{{ pedido.codigo }}</p>
            </div>
            <span class="status" :class="`status--${pedido.status.toLowerCase()}`">
              {{ STATUS[pedido.status] ?? pedido.status }}
            </span>
          </div>

          <table class="itens">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd.</th>
                <th>Unitário</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pedido.itens" :key="item.produto.id">
                <td>{{ item.produto.nome }}</td>
                <td>{{ item.quantidade }}</td>
                <td>{{ item.precoUnitFormatado }}</td>
                <td>{{ item.subtotalFormatado }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total</td>
                <td>{{ pedido.totalFormatado }}</td>
              </tr>
            </tfoot>
          </table>

          <p class="nota">
            A loja vai entrar em contato pelo telefone ou e-mail informados para combinar pagamento
            e retirada. Se preferir, envie o resumo pelo WhatsApp:
          </p>
          <div class="acoes">
            <a
              :href="linkWhatsApp"
              class="btn btn-red zoom-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle :size="16" /> Enviar resumo no WhatsApp
            </a>
            <RouterLink to="/pecas" class="btn">Continuar comprando</RouterLink>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CircleCheck, MessageCircle } from 'lucide-vue-next';
import { api } from '../api';

const STATUS = {
  RECEBIDO: 'Recebido',
  EM_SEPARACAO: 'Em separação',
  PRONTO: 'Pronto para retirada',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

const route = useRoute();
const pedido = ref(null);
const carregando = ref(true);
const erro = ref(null);

const linkWhatsApp = computed(() => {
  const p = pedido.value;
  if (!p) return '#';
  const linhas = p.itens.map(
    (i) => `• ${i.quantidade}× ${i.produto.nome} — ${i.subtotalFormatado}`,
  );
  const texto = [
    `Olá! Fiz o pedido *${p.codigo}* no site da Chiquinho Motors:`,
    ...linhas,
    `Total: ${p.totalFormatado}`,
  ].join('\n');
  return `https://wa.me/5566999896813?text=${encodeURIComponent(texto)}`;
});

async function carregar(codigo) {
  carregando.value = true;
  erro.value = null;
  try {
    pedido.value = await api.buscarPedido(codigo);
  } catch (e) {
    erro.value = e.status === 404 ? 'Pedido não encontrado.' : e.message;
  } finally {
    carregando.value = false;
  }
}

watch(
  () => route.params.codigo,
  (codigo) => carregar(codigo),
  { immediate: true },
);
</script>

<style scoped>
.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.pedido-inner {
  padding: 2rem;
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
}

.pedido-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
  text-align: left;
}

.pedido-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.rotulo {
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
}

.codigo {
  font-size: 1.8em;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #1a1a1a;
}

.status {
  padding: 0.35em 0.9em;
  border-radius: 50px;
  font-size: 0.85em;
  font-weight: 700;
  background: #fff4e5;
  color: #b36b00;
}

.status--entregue,
.status--pronto {
  background: #eafaf0;
  color: #1e7e45;
}

.status--cancelado {
  background: #fdeceb;
  color: #c0392b;
}

.itens {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92em;
}

.itens th,
.itens td {
  padding: 0.6rem 0.4rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.itens th:not(:first-child),
.itens td:not(:first-child) {
  text-align: right;
}

.itens th {
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.itens tfoot td {
  font-weight: 900;
  font-size: 1.1em;
  color: #c0392b;
  border-bottom: none;
}

.nota {
  margin: 1.5rem 0 1rem;
  font-size: 0.88em;
  color: #666;
  line-height: 1.5;
}

.acoes {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .pedido-inner {
    padding: 1rem;
  }

  .pedido-card {
    padding: 1.25rem;
  }

  .itens th:nth-child(3),
  .itens td:nth-child(3) {
    display: none;
  }
}
</style>
