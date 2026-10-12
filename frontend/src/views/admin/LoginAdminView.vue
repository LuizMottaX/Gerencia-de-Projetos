<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ShieldAlert } from 'lucide-vue-next';

const email = ref('');
const senha = ref('');
const erroMensagem = ref('');
const carregando = ref(false);

const router = useRouter();
const auth = useAuthStore();

const fazerLogin = async () => {
  erroMensagem.value = '';
  carregando.value = true;

  const resultado = await auth.login(email.value, senha.value);

  if (resultado.sucesso) {
    router.push('/admin');
  } else {
    erroMensagem.value = resultado.erro;
  }

  carregando.value = false;
};
</script>

<template>
  <main class="login-admin">
    <div class="login-box">
      <div class="login-header">
        <ShieldAlert :size="40" color="var(--red-main)" />
        <h1>Acesso Restrito</h1>
        <p>Área administrativa da Chiquinho Motors</p>
      </div>

      <form class="login-form" @submit.prevent="fazerLogin">
        <div v-if="erroMensagem" class="erro-alerta">{{ erroMensagem }}</div>

        <div class="campo">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="admin@chiquinhomotors.com.br"
          />
        </div>

        <div class="campo">
          <label for="senha">Senha</label>
          <input id="senha" v-model="senha" type="password" required placeholder="••••••••" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="carregando">
          {{ carregando ? 'Autenticando...' : 'Entrar no Painel' }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.login-admin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
  background-color: var(--carbon-900);
}

.login-box {
  background-color: var(--carbon-800);
  border: 1px solid var(--carbon-700);
  border-radius: 8px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 1rem 0 0.5rem;
  font-size: 1.5rem;
  color: var(--carbon-100);
}

.login-header p {
  color: var(--carbon-300);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.campo label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--carbon-200);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.campo input {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--carbon-600);
  background-color: var(--carbon-900);
  color: var(--carbon-100);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.campo input:focus {
  outline: none;
  border-color: var(--red-main);
}

.erro-alerta {
  background-color: rgba(229, 57, 53, 0.1);
  color: var(--red-light);
  border: 1px solid var(--red-main);
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.btn-primary {
  margin-top: 1rem;
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
}
</style>
