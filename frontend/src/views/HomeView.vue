<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <img
        src="https://www.istoedinheiro.com.br/wp-content/uploads/sites/17/2019/04/concessionaria_090926_renatoaraujo-abr_.jpg"
        alt="Concessionária Chiquinho Motors"
        class="hero-img"
      />
      <div class="hero-content">
        <p class="hero-tag"><MapPin :size="14" :stroke-width="2.5" /> Concessionária em Sinop – MT</p>
        <h1>Seu próximo carro está aqui.</h1>
        <p class="hero-sub">
          Preços acessíveis, garantia e atendimento personalizado.<br />
          A melhor concessionária do Centro-Oeste.
        </p>
        <RouterLink to="/carros" class="btn btn-red zoom-shadow hero-cta">
          Ver Carros Disponíveis <ArrowRight :size="16" />
        </RouterLink>
      </div>
    </section>

    <!-- Diferenciais -->
    <section class="diferenciais">
      <div class="card-diff" v-for="item in diferenciais" :key="item.titulo">
        <component :is="item.icon" class="diff-icon" :size="34" :stroke-width="1.75" />
        <h3>{{ item.titulo }}</h3>
        <p>{{ item.desc }}</p>
      </div>
    </section>

    <!-- Chamada -->
    <section class="chamada">
      <p class="chamada-texto">
        Nossos veículos são de procedência, revisados por profissionais qualificados.
        Visite-nos ou verifique o nosso catálogo on-line!
      </p>
      <RouterLink to="/carros" class="btn zoom-shadow">Ver catálogo completo</RouterLink>
    </section>
  </div>
</template>

<script setup>
import { MapPin, ArrowRight, ShieldCheck, CreditCard, Handshake } from 'lucide-vue-next';

const diferenciais = [
  { icon: ShieldCheck, titulo: 'Procedência Garantida', desc: 'Todos os veículos revisados e com histórico verificado.' },
  { icon: CreditCard, titulo: 'Condições Flexíveis', desc: 'Financiamento, troca e cartão de crédito aceitos.' },
  { icon: Handshake, titulo: 'Atendimento Premium', desc: 'Desde 1985 com foco no melhor atendimento do mercado.' },
];
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
}

/* ── Hero ── */
.hero {
  position: relative;
  width: 100%;
  height: clamp(320px, 55vh, 560px);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 12, 0.88) 0%,
    rgba(10, 10, 12, 0.4) 55%,
    rgba(10, 10, 12, 0.1) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 2.5rem;
  text-align: left;
  max-width: 700px;
}

.hero-tag {
  font-size: 0.85em;
  font-weight: 600;
  color: #c0392b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.hero-content h1 {
  color: #fff;
  font-size: clamp(1.6em, 4vw, 2.6em);
  font-weight: 900;
  text-align: left;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 0.6rem;
}

.hero-sub {
  color: #c8c8d0;
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 1.2rem;
}

.hero-cta {
  font-size: 1em;
  padding: 0.75em 1.8em;
}

/* ── Diferenciais ── */
.diferenciais {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 2.5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.card-diff {
  background: #fff;
  border-radius: 12px;
  padding: 1.6rem 1.4rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-top: 3px solid #c0392b;
  transition: transform 0.25s, box-shadow 0.25s;
}

.card-diff:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.14);
}

.diff-icon {
  display: block;
  margin: 0 auto 0.6rem;
  color: #c0392b;
}

.card-diff h3 {
  font-size: 1em;
  font-weight: 700;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
}

.card-diff p {
  font-size: 0.9em;
  color: #555;
  line-height: 1.5;
}

/* ── Chamada ── */
.chamada {
  background: #1c1e22;
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.chamada-texto {
  color: #c0c4cc;
  max-width: 620px;
  font-size: 1.02em;
  line-height: 1.7;
}

/* ── Responsivo ── */
@media (max-width: 760px) {
  .diferenciais {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
  }

  .hero-content {
    padding: 1.5rem 1rem;
  }

  .hero-content h1 {
    font-size: 1.5em;
  }
}
</style>
