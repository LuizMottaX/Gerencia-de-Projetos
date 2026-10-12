<script setup>
import { onMounted, ref } from 'vue';
import {
  AlertTriangle,
  CalendarDays,
  Car,
  Inbox,
  LayoutDashboard,
  ShoppingBag,
  Wallet,
} from 'lucide-vue-next';
import { api } from '@/api';
import { brl } from '@/utils/formatar';
import { formatarData } from '@/utils/agenda';

const resumo = ref(null);
const erro = ref('');

onMounted(async () => {
  try {
    resumo.value = await api.admin.resumo();
  } catch (e) {
    erro.value = e.message;
  }
});
</script>

<template>
  <header class="painel-cabecalho">
    <h1><LayoutDashboard :size="24" /> Dashboard</h1>
  </header>

  <div class="painel-corpo">
    <p v-if="erro" class="aviso aviso--erro">{{ erro }}</p>
    <p v-else-if="!resumo" class="vazio">Carregando…</p>

    <template v-else>
      <div class="indicadores">
        <RouterLink to="/admin/carros" class="indicador">
          <Car :size="22" />
          <strong>{{ resumo.veiculosDisponiveis }}</strong>
          <span>veículos disponíveis</span>
        </RouterLink>
        <RouterLink to="/admin/pedidos" class="indicador">
          <Wallet :size="22" />
          <strong>{{ brl(resumo.pedidosMes.total) }}</strong>
          <span>{{ resumo.pedidosMes.quantidade }} pedidos no mês</span>
        </RouterLink>
        <RouterLink
          to="/admin/pedidos"
          class="indicador"
          :class="{ destaque: resumo.pedidosPendentes }"
        >
          <ShoppingBag :size="22" />
          <strong>{{ resumo.pedidosPendentes }}</strong>
          <span>pedidos a separar</span>
        </RouterLink>
        <RouterLink
          to="/admin/mensagens"
          class="indicador"
          :class="{ destaque: resumo.mensagensNaoLidas }"
        >
          <Inbox :size="22" />
          <strong>{{ resumo.mensagensNaoLidas }}</strong>
          <span>mensagens não lidas</span>
        </RouterLink>
      </div>

      <div class="colunas">
        <section class="painel-card">
          <h2><CalendarDays :size="16" /> Próximos agendamentos</h2>
          <p v-if="!resumo.proximosAgendamentos.length" class="vazio">Nenhum agendamento futuro.</p>
          <ul v-else class="lista">
            <li v-for="a in resumo.proximosAgendamentos" :key="a.codigo">
              <div>
                <strong>{{ a.hora }}</strong> · {{ formatarData(a.data) }}
                <p class="secundario">{{ a.servico.nome }} — {{ a.cliente.nome }}</p>
              </div>
              <span class="secundario">{{ a.codigo }}</span>
            </li>
          </ul>
          <RouterLink to="/admin/agenda" class="ver-mais">Ver agenda completa</RouterLink>
        </section>

        <section class="painel-card">
          <h2><AlertTriangle :size="16" /> Estoque baixo</h2>
          <p v-if="!resumo.estoqueBaixo.length" class="vazio">Nenhum item com estoque baixo.</p>
          <ul v-else class="lista">
            <li v-for="p in resumo.estoqueBaixo" :key="p.id">
              <RouterLink :to="`/admin/produtos/${p.id}`">{{ p.nome }}</RouterLink>
              <span class="selo" :class="p.estoque ? 'selo--alerta' : 'selo--erro'">
                {{ p.estoque ? `${p.estoque} un.` : 'Esgotado' }}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.indicadores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.indicador {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  border-radius: var(--radius-sm);
  background: var(--color-dark);
  border: 1px solid var(--color-surface);
  color: var(--color-silver);
  text-decoration: none;
  text-align: left;
  transition: border-color 0.2s;
}

.indicador:hover {
  border-color: var(--color-red);
}

.indicador .lucide {
  color: var(--color-red-light);
}

.indicador strong {
  font-size: 1.6rem;
  color: var(--color-white);
}

.indicador.destaque {
  border-color: var(--color-red);
  background: linear-gradient(180deg, var(--color-red-dim), var(--color-dark));
}

.colunas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}

.painel-card h2 {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-surface);
}

.lista a {
  color: var(--color-light);
}

.ver-mais {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--color-red-light);
  font-size: 0.85rem;
}
</style>
