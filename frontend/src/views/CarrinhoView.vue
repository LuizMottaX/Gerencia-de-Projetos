<template>
  <section class="carrinho-page">
    <div class="section-banner">
      <h1><ShoppingCart :size="26" /> Carrinho</h1>
      <p class="banner-sub">Revise as peças e acessórios antes de finalizar o pedido</p>
    </div>

    <div v-if="!carrinho.itens.length" class="carrinho-vazio">
      <ShoppingCart :size="56" :stroke-width="1.25" />
      <p>Seu carrinho está vazio.</p>
      <div class="vazio-acoes">
        <RouterLink to="/pecas" class="btn btn-red">Ver auto-peças</RouterLink>
        <RouterLink to="/acessorios" class="btn">Ver acessórios</RouterLink>
      </div>
    </div>

    <div v-else class="carrinho-inner">
      <ul class="lista-itens">
        <li v-for="item in carrinho.itens" :key="item.id" class="item">
          <RouterLink :to="rotaDe(item)" class="item-img">
            <img v-if="item.imagemUrl" :src="item.imagemUrl" :alt="item.nome" />
            <Package v-else :size="32" :stroke-width="1.5" />
          </RouterLink>

          <div class="item-info">
            <RouterLink :to="rotaDe(item)" class="item-nome">{{ item.nome }}</RouterLink>
            <span class="item-preco">{{ formatar(item.preco) }} cada</span>
          </div>

          <div class="item-qtd" role="group" :aria-label="`Quantidade de ${item.nome}`">
            <button
              type="button"
              aria-label="Diminuir"
              @click="carrinho.alterarQuantidade(item.id, item.quantidade - 1)"
            >
              <Minus :size="14" />
            </button>
            <span>{{ item.quantidade }}</span>
            <button
              type="button"
              aria-label="Aumentar"
              :disabled="item.quantidade >= item.estoque"
              @click="carrinho.alterarQuantidade(item.id, item.quantidade + 1)"
            >
              <Plus :size="14" />
            </button>
          </div>

          <span class="item-subtotal">{{ formatar(item.preco * item.quantidade) }}</span>

          <button
            type="button"
            class="item-remover"
            :aria-label="`Remover ${item.nome}`"
            title="Remover"
            @click="carrinho.remover(item.id)"
          >
            <Trash2 :size="18" />
          </button>
        </li>
      </ul>

      <aside class="resumo">
        <h2>Resumo</h2>
        <div class="resumo-linha">
          <span
            >{{ carrinho.quantidadeTotal }}
            {{ carrinho.quantidadeTotal === 1 ? 'item' : 'itens' }}</span
          >
          <strong>{{ carrinho.subtotalFormatado }}</strong>
        </div>
        <p class="resumo-nota">
          Sem pagamento online: após o pedido, a loja entra em contato para combinar pagamento e
          retirada/entrega.
        </p>
        <RouterLink to="/checkout" class="btn btn-red zoom-shadow">
          Finalizar pedido <ArrowRight :size="16" />
        </RouterLink>
        <RouterLink to="/pecas" class="continuar">Continuar comprando</RouterLink>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, Minus, Package, Plus, ShoppingCart, Trash2 } from 'lucide-vue-next';
import { useCarrinhoStore } from '../stores/carrinho';

const carrinho = useCarrinhoStore();
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatar = (valor) => brl.format(valor);
const rotaDe = (item) => `/${item.tipo === 'acessorio' ? 'acessorios' : 'pecas'}/${item.id}`;
</script>

<style scoped>
.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.carrinho-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  color: #888;
}

.vazio-acoes {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.carrinho-inner {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  align-items: start;
}

.lista-itens {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  display: grid;
  grid-template-columns: 72px 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.item-img {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: #f0f0f0;
  color: #a3a3a3;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  min-width: 0;
}

.item-nome {
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
}

.item-nome:hover {
  color: #c0392b;
}

.item-preco {
  font-size: 0.82em;
  color: #777;
}

.item-qtd {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 50px;
  overflow: hidden;
}

.item-qtd button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
}

.item-qtd button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.item-qtd span {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
}

.item-subtotal {
  font-weight: 900;
  color: #c0392b;
  min-width: 90px;
  text-align: right;
}

.item-remover {
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  padding: 0.4rem;
  display: grid;
  place-items: center;
}

.item-remover:hover {
  color: #c0392b;
}

.resumo {
  background: #1c1e22;
  color: #e8eaed;
  border-radius: 12px;
  border-top: 3px solid #c0392b;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 110px;
}

.resumo h2 {
  color: #fff;
  font-size: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.resumo-linha {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.resumo-linha strong {
  font-size: 1.4em;
  color: #fff;
}

.resumo-nota {
  font-size: 0.8em;
  color: #b0b4bc;
  line-height: 1.5;
  text-align: left;
}

.continuar {
  color: #b0b4bc;
  font-size: 0.85em;
  text-align: center;
}

@media (max-width: 800px) {
  .carrinho-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .item {
    grid-template-columns: 56px 1fr auto;
    grid-template-areas:
      'img info remover'
      'img qtd subtotal';
    row-gap: 0.5rem;
  }

  .item-img {
    grid-area: img;
    width: 56px;
    height: 56px;
  }
  .item-info {
    grid-area: info;
  }
  .item-qtd {
    grid-area: qtd;
    justify-self: start;
  }
  .item-subtotal {
    grid-area: subtotal;
  }
  .item-remover {
    grid-area: remover;
  }

  .resumo {
    position: static;
  }
}
</style>
