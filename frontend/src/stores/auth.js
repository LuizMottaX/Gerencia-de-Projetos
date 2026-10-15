import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api, definirAoNaoAutorizado } from '@/api';
import router from '@/router';

const CHAVE_TOKEN = 'admin_token';

function lerToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

function gravarToken(valor) {
  try {
    if (valor) localStorage.setItem(CHAVE_TOKEN, valor);
    else localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    // localStorage indisponível (modo privado) — sessão fica só em memória.
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(lerToken());
  const user = ref(null);
  const isAuthenticated = computed(() => !!token.value);

  const login = async (email, senha) => {
    try {
      const resposta = await api.post('/admin/auth/login', { email, senha });
      token.value = resposta.token;
      user.value = resposta.admin;
      gravarToken(token.value);
      return { sucesso: true };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.detalhes?.[0]?.mensagem || erro.message || 'Erro ao fazer login',
      };
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    gravarToken(null);
    router.push('/admin/login');
  };

  const checkAuth = async () => {
    if (!token.value) return false;
    try {
      const resposta = await api.get('/admin/auth/me');
      user.value = resposta.admin;
      return true;
    } catch {
      logout();
      return false;
    }
  };

  // Qualquer 401 vindo do painel derruba a sessão e volta para o login.
  definirAoNaoAutorizado(() => {
    if (token.value) logout();
  });

  return { token, user, isAuthenticated, login, logout, checkAuth };
});
