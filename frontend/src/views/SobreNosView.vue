<template>
  <section class="sobre-page">
    <div class="section-banner">
      <h1>🏁 Quem Somos?</h1>
      <p class="banner-sub">Desde 1985 movidos pela paixão automotiva</p>
    </div>

    <div class="sobre-inner">
      <div class="sobre-bloco">
        <img
          src="https://blog.howeb.com.br/wp-content/uploads/2019/11/vendedor-entregando-chave-de-carro-ap%C3%B3s-uma-venda-com-abordagem-de-gatilhos-mentais.jpg"
          alt="Equipe Chiquinho Motors"
          class="sobre-img"
        />
        <div class="sobre-texto-bloco">
          <h2>Nossa História</h2>
          <p>
            Somos uma empresa familiar, fundada em 1985, desde sempre movidos pela paixão
            automotiva e pelo apreço com a honestidade e qualidade dos serviços prestados.
            Nosso primeiro carro vendido foi um Fusca 1975, e desde então, seguimos com a
            mesma filosofia até hoje.
          </p>
          <p>
            Nosso objetivo é oferecer aos nossos clientes um atendimento personalizado, com a
            melhor relação cliente-vendedor do mercado, e com a qualidade e segurança de
            negócios que você merece.
          </p>
        </div>
      </div>

      <!-- Números / stats -->
      <div class="stats">
        <div class="stat" v-for="s in stats" :key="s.valor">
          <span class="stat-valor">{{ s.valor }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>

      <div class="sobre-bloco reverse">
        <img
          src="https://holmes.app/wp-content/uploads/2022/05/shutterstock_1668929842.jpg"
          alt="Concessionária Chiquinho Motors"
          class="sobre-img"
        />
        <div class="sobre-texto-bloco">
          <h2>Nossa Equipe</h2>
          <p>
            Nossa equipe é formada por profissionais altamente qualificados, que estão
            sempre prontos para atender você da melhor forma possível.
          </p>
          <p class="destaque">Venha nos conhecer e fazer parte da nossa história! 🚗</p>
          <RouterLink to="/contato" class="btn btn-red zoom-shadow">
            Entrar em Contato
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { valor: '1985', label: 'Ano de fundação' },
  { valor: '+40', label: 'Anos de experiência' },
  { valor: '100%', label: 'Clientes satisfeitos' },
  { valor: 'Sinop', label: 'Mato Grosso' },
];
</script>

<style scoped>
.sobre-page { display: flex; flex-direction: column; }

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.sobre-inner {
  max-width: 1050px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

/* ── Bloco imagem + texto ── */
.sobre-bloco {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.sobre-bloco.reverse {
  direction: rtl;
}

.sobre-bloco.reverse > * {
  direction: ltr;
}

.sobre-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  display: block;
  object-fit: cover;
  height: 280px;
}

.sobre-texto-bloco {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.sobre-texto-bloco h2 {
  text-align: left;
  font-size: 1.2em;
  color: #c0392b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.sobre-texto-bloco p {
  font-size: 0.97em;
  color: #444;
  line-height: 1.75;
}

.destaque {
  font-weight: 700;
  color: #1a1a1a !important;
}

/* ── Stats ── */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #1c1e22;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  border-top: 3px solid #c0392b;
}

.stat {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-valor {
  font-size: 1.8em;
  font-weight: 900;
  color: #c0392b;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.78em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Responsivo ── */
@media (max-width: 760px) {
  .sobre-bloco,
  .sobre-bloco.reverse {
    grid-template-columns: 1fr;
    direction: ltr;
  }

  .sobre-img { height: 200px; }

  .stats { grid-template-columns: repeat(2, 1fr); }

  .sobre-inner { padding: 1rem; gap: 2rem; }
}
</style>
