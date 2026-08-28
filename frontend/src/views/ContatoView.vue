<template>
  <section class="contato-page">
    <div class="section-banner">
      <h1><Phone :size="26" /> Fale Conosco</h1>
      <p class="banner-sub">Estamos prontos para te ajudar a encontrar o carro ideal</p>
    </div>

    <div class="contato-inner">
      <!-- Formulário -->
      <div class="form-card">
        <h2>Envie uma mensagem</h2>

        <p v-if="enviado" class="form-sucesso">
          <CircleCheck :size="18" />
          <span>{{ mensagemSucesso }}</span>
        </p>

        <form v-else @submit.prevent="enviar" novalidate>
          <p v-if="erroGeral" class="form-erro">{{ erroGeral }}</p>

          <label for="nome">Nome</label>
          <input id="nome" v-model.trim="form.nome" type="text" placeholder="Digite seu nome completo" />
          <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>

          <label for="email">E-mail</label>
          <input id="email" v-model.trim="form.email" type="email" placeholder="seu@email.com" />
          <span v-if="erros.email" class="campo-erro">{{ erros.email }}</span>

          <label for="telefone">Telefone / WhatsApp</label>
          <input id="telefone" v-model.trim="form.telefone" type="tel" placeholder="(66) 9 9999-9999" />
          <span v-if="erros.telefone" class="campo-erro">{{ erros.telefone }}</span>

          <label for="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            v-model.trim="form.mensagem"
            rows="5"
            placeholder="Descreva o veículo de interesse ou deixe sua mensagem…"
          ></textarea>
          <span v-if="erros.mensagem" class="campo-erro">{{ erros.mensagem }}</span>

          <button type="submit" class="btn btn-red zoom-shadow submit-btn" :disabled="enviando">
            <template v-if="enviando">Enviando…</template>
            <template v-else>Enviar Mensagem <Send :size="15" /></template>
          </button>
        </form>
      </div>

      <!-- Info de contato -->
      <div class="contato-info">
        <div class="info-card">
          <MessageCircle class="info-icon" :size="24" />
          <h3>WhatsApp</h3>
          <a href="https://wa.me/5566999896813?text=Chiquinho%20Motors/" target="_blank" rel="noopener noreferrer" class="btn btn-red zoom-shadow info-btn">
            Chamar no WhatsApp
          </a>
        </div>
        <div class="info-card">
          <Instagram class="info-icon" :size="24" />
          <h3>Instagram</h3>
          <a href="https://www.instagram.com/franc_xco/" target="_blank" rel="noopener noreferrer" class="btn zoom-shadow info-btn">
            @franc_xco
          </a>
        </div>
        <div class="info-card">
          <Mail class="info-icon" :size="24" />
          <h3>E-mail</h3>
          <a href="mailto:chiquinhomotors@gmail.com" class="info-link">chiquinhomotors@gmail.com</a>
        </div>
        <div class="info-card">
          <MapPin class="info-icon" :size="24" />
          <h3>Endereço</h3>
          <p>Rua das Avencas, 2538<br />Sinop — Mato Grosso</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Phone, CircleCheck, Send, MessageCircle, Instagram, Mail, MapPin } from 'lucide-vue-next';
import { api } from '../api';

const form = reactive({ nome: '', email: '', telefone: '', mensagem: '' });
const erros = reactive({ nome: '', email: '', telefone: '', mensagem: '' });
const erroGeral = ref('');
const enviando = ref(false);
const enviado = ref(false);
const mensagemSucesso = ref('');

function validar() {
  erros.nome = form.nome.length >= 2 ? '' : 'Informe seu nome.';
  erros.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'E-mail inválido.';
  erros.telefone = form.telefone.length >= 8 ? '' : 'Telefone inválido.';
  erros.mensagem = form.mensagem.length >= 10 ? '' : 'Escreva ao menos 10 caracteres.';
  return !erros.nome && !erros.email && !erros.telefone && !erros.mensagem;
}

async function enviar() {
  erroGeral.value = '';
  if (!validar()) return;

  enviando.value = true;
  try {
    const resp = await api.enviarContato({ ...form });
    mensagemSucesso.value = resp?.mensagem || 'Mensagem enviada! Retornaremos em breve.';
    enviado.value = true;
  } catch (e) {
    if (e.detalhes?.length) {
      for (const d of e.detalhes) {
        if (d.campo in erros) erros[d.campo] = d.mensagem;
      }
    }
    erroGeral.value = e.message || 'Não foi possível enviar. Tente novamente.';
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.contato-page {
  display: flex;
  flex-direction: column;
}

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.contato-inner {
  display: grid;
  grid-template-columns: 1fr 280px;
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

.form-card h2 {
  text-align: left;
  font-size: 1em;
  color: #888;
  margin-bottom: 1.2rem;
  margin-top: 0;
}

.form-sucesso {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: #eafaf0;
  border: 1px solid #b7e4c7;
  color: #1e7e45;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  font-weight: 600;
  text-align: left;
}

.form-erro {
  background: #fdeceb;
  border: 1px solid #f3b7b1;
  color: #c0392b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9em;
  margin-bottom: 1rem;
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
  text-align: center;
  font-size: 1em;
  padding: 0.8em 1em;
  margin-top: 0.25rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: progress;
}

.contato-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  text-align: center;
  border-left: 3px solid #c0392b;
}

.info-icon {
  display: block;
  margin: 0 auto 0.5rem;
  color: #c0392b;
}

.info-card h3 {
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #444;
  margin-bottom: 0.6rem;
}

.info-card p {
  font-size: 0.88em;
  color: #555;
  line-height: 1.5;
}

.info-btn {
  font-size: 0.82em;
  padding: 0.5em 1em;
}

.info-link {
  color: #c0392b;
  font-size: 0.85em;
  font-weight: 600;
  word-break: break-all;
}

.info-link:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .contato-inner {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.2rem;
  }

  .form-card {
    padding: 1.2rem;
  }
}
</style>
