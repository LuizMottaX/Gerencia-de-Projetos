<template>
  <section class="checkout-page">
    <div class="section-banner">
      <h1><ClipboardCheck :size="26" /> Finalizar pedido</h1>
      <p class="banner-sub">Informe seus dados — a loja entra em contato para combinar pagamento</p>
    </div>

    <div v-if="!carrinho.itens.length" class="checkout-vazio">
      <p>Seu carrinho está vazio.</p>
      <RouterLink to="/pecas" class="btn btn-red">Ver auto-peças</RouterLink>
    </div>

    <div v-else class="checkout-inner">
      <form class="form-card" novalidate @submit.prevent="finalizar">
        <h2>Seus dados</h2>
        <div v-if="erroGeral" class="form-erro">
          <p>{{ erroGeral }}</p>
          <ul v-if="errosEstoque.length">
            <li v-for="msg in errosEstoque" :key="msg">{{ msg }}</li>
          </ul>
          <RouterLink v-if="errosEstoque.length" to="/carrinho">Ajustar carrinho</RouterLink>
        </div>

        <label for="nome">Nome</label>
        <input id="nome" v-model.trim="form.nome" type="text" autocomplete="name" />
        <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>

        <label for="email">E-mail</label>
        <input id="email" v-model.trim="form.email" type="email" autocomplete="email" />
        <span v-if="erros.email" class="campo-erro">{{ erros.email }}</span>

        <label for="telefone">Telefone / WhatsApp</label>
        <input id="telefone" v-model.trim="form.telefone" type="tel" autocomplete="tel" />
        <span v-if="erros.telefone" class="campo-erro">{{ erros.telefone }}</span>

        <button type="submit" class="btn btn-red submit-btn" :disabled="enviando">
          {{ enviando ? 'Enviando pedido…' : `Confirmar pedido · ${carrinho.subtotalFormatado}` }}
        </button>
      </form>

      <aside class="revisao">
        <h2>Revisão</h2>
        <ul>
          <li v-for="item in carrinho.itens" :key="item.id">
            <span>{{ item.quantidade }}× {{ item.nome }}</span>
            <span>{{ formatar(item.preco * item.quantidade) }}</span>
          </li>
        </ul>
        <div class="revisao-total">
          <span>Total</span>
          <strong>{{ carrinho.subtotalFormatado }}</strong>
        </div>
        <RouterLink to="/carrinho" class="editar">Editar carrinho</RouterLink>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ClipboardCheck } from 'lucide-vue-next';
import { api } from '../api';
import { useCarrinhoStore } from '../stores/carrinho';

const router = useRouter();
const carrinho = useCarrinhoStore();
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatar = (valor) => brl.format(valor);

const form = reactive({ nome: '', email: '', telefone: '' });
const erros = reactive({ nome: '', email: '', telefone: '' });
const erroGeral = ref('');
const errosEstoque = ref([]);
const enviando = ref(false);

function validar() {
  erros.nome = form.nome.length >= 2 ? '' : 'Informe seu nome.';
  erros.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'E-mail inválido.';
  erros.telefone = form.telefone.length >= 8 ? '' : 'Telefone inválido.';
  return !erros.nome && !erros.email && !erros.telefone;
}

async function finalizar() {
  erroGeral.value = '';
  errosEstoque.value = [];
  if (!validar()) return;

  enviando.value = true;
  try {
    const pedido = await api.criarPedido({
      cliente: { ...form },
      itens: carrinho.itens.map((i) => ({ produto: i.id, quantidade: i.quantidade })),
    });
    carrinho.limpar();
    router.push(`/pedido/${pedido.codigo}`);
  } catch (e) {
    erroGeral.value = e.message || 'Não foi possível enviar o pedido. Tente novamente.';
    if (e.status === 409 || e.status === 404) {
      errosEstoque.value = (e.detalhes ?? []).map((d) => d.mensagem);
    } else {
      for (const d of e.detalhes ?? []) {
        const campo = d.campo.replace('cliente.', '');
        if (campo in erros) erros[campo] = d.mensagem;
      }
    }
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.checkout-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  color: #666;
}

.checkout-inner {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  padding: 2rem;
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #c0392b;
}

.form-card h2,
.revisao h2 {
  text-align: left;
  font-size: 1em;
  margin: 0 0 1.2rem;
}

.form-card h2 {
  color: #666;
}

.form-erro {
  background: #fdeceb;
  border: 1px solid #f3b7b1;
  color: #c0392b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9em;
  margin-bottom: 1rem;
  text-align: left;
}

.form-erro ul {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.form-erro a {
  color: #c0392b;
  font-weight: 700;
}

.campo-erro {
  display: block;
  color: #c0392b;
  font-size: 0.8em;
  font-weight: 600;
  margin: -8px 0 12px;
}

.submit-btn {
  width: 100%;
  font-size: 1em;
  padding: 0.8em 1em;
  margin-top: 0.25rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: progress;
}

.revisao {
  background: #1c1e22;
  color: #e8eaed;
  border-radius: 12px;
  border-top: 3px solid #c0392b;
  padding: 1.5rem;
}

.revisao h2 {
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.revisao ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.9em;
}

.revisao li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
}

.revisao-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-top: 1px solid #3a3d44;
  padding-top: 1rem;
}

.revisao-total strong {
  font-size: 1.3em;
  color: #fff;
}

.editar {
  display: block;
  margin-top: 1rem;
  color: #b0b4bc;
  font-size: 0.85em;
  text-align: center;
}

@media (max-width: 800px) {
  .checkout-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .revisao {
    order: -1;
  }
}
</style>
