<template>
  <section class="home">
    <h1>
      Sejam bem-vindos à Chiquinho Motors, onde o seu bolso encontra a melhor
      opção para o seu carro dos sonhos!
    </h1>

    <img
      src="https://www.istoedinheiro.com.br/wp-content/uploads/sites/17/2019/04/concessionaria_090926_renatoaraujo-abr_.jpg"
      alt="Concessionária Chiquinho Motors"
      class="hero-img"
    />

    <p class="descricao">
      Nós oferecemos uma ampla gama de veículos para você escolher, com preços
      acessíveis e condições de pagamento que cabem no seu bolso. Nossos
      veículos são de procedência, com garantia e revisados por profissionais
      qualificados. Visite-nos ou verifique o nosso catálogo on-line e conheça
      o próximo ocupante de sua garagem!
    </p>

    <RouterLink to="/carros" class="btn zoom-shadow cta-btn">
      Ver Carros Disponíveis
    </RouterLink>
  </section>
</template>

<style scoped>
.home {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.hero-img {
  max-width: 900px;
  width: 100%;
  border-radius: 8px;
}

.descricao {
  max-width: 800px;
  text-align: center;
  font-size: 1.05em;
}

.cta-btn {
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .home {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  .descricao {
    font-size: 0.97em;
  }
}
</style>
