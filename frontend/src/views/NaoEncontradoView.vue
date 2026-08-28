<template>
  <section class="nf-page">
    <p class="nf-code">404</p>
    <h1>Página não encontrada</h1>
    <p class="nf-texto">O endereço que você tentou acessar não existe ou foi movido.</p>
    <div class="nf-acoes">
      <RouterLink to="/" class="btn btn-red zoom-shadow">Voltar à página inicial</RouterLink>
      <RouterLink to="/carros" class="btn zoom-shadow">Ver carros</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.nf-page {
  max-width: 520px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.nf-code {
  font-size: 4.5em;
  font-weight: 900;
  color: #c0392b;
  line-height: 1;
}

.nf-texto {
  color: #666;
  margin-bottom: 1rem;
}

.nf-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
</style>
