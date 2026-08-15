<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">🏎 Chiquinho <span class="red">Motors</span>®</span>
        <p class="footer-tagline">Onde o seu bolso encontra a melhor opção.</p>
      </div>

      <div class="footer-links">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/carros">Carros</RouterLink>
        <RouterLink to="/contato">Contato</RouterLink>
        <RouterLink to="/sobre">Sobre Nós</RouterLink>
      </div>

      <div class="footer-bottom">
        <p>© 2023 Chiquinho Motors® — Todos os direitos reservados.</p>
        <p class="footer-credit">Desenvolvido por Francisco de Julio Faria · Revisado por Luiz Henrique Mota</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: #111214;
  border-top: 3px solid #c0392b;
  padding: 2.5rem 1.5rem 1.5rem;
  text-align: center;
  margin-top: 3rem;
}

.footer-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.footer-logo {
  font-size: 1.2em;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.red { color: #c0392b; }

.footer-tagline {
  font-size: 0.85em;
  color: #888;
  margin-top: 0.3rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: #b0b4bc;
  font-size: 0.88em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.25s;
}

.footer-links a:hover {
  color: #c0392b;
}

.footer-bottom {
  border-top: 1px solid #2a2d32;
  padding-top: 1rem;
  width: 100%;
}

.footer-bottom p {
  font-size: 0.8em;
  color: #666;
  line-height: 1.6;
}

.footer-credit {
  font-size: 0.75em !important;
  color: #4a4d52 !important;
  margin-top: 0.25rem;
}
</style>
