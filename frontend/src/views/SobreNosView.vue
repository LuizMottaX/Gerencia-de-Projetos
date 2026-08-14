<template>
  <section class="sobre-page">
    <h1>Quem Somos?</h1>

    <img
      src="https://blog.howeb.com.br/wp-content/uploads/2019/11/vendedor-entregando-chave-de-carro-ap%C3%B3s-uma-venda-com-abordagem-de-gatilhos-mentais.jpg"
      alt="Equipe Chiquinho Motors"
      class="sobre-img"
    />

    <p class="sobre-texto">
      Somos uma empresa familiar, fundada em 1985, desde sempre movidos pela paixão
      automotiva e pelo apreço com a honestidade e qualidade dos serviços prestados.
      Nosso primeiro carro vendido foi um Fusca 1975, e desde então, seguimos com a
      mesma filosofia até hoje. Nosso objetivo é oferecer aos nossos clientes um
      atendimento personalizado, com a melhor relação cliente-vendedor do mercado,
      e com a qualidade e segurança de negócios que você merece.
    </p>

    <img
      src="https://holmes.app/wp-content/uploads/2022/05/shutterstock_1668929842.jpg"
      alt="Concessionária Chiquinho Motors — equipe"
      class="sobre-img"
    />

    <p class="sobre-texto">
      Nossa equipe é formada por profissionais altamente qualificados, que estão
      sempre prontos para atender você da melhor forma possível.
    </p>

    <p class="sobre-texto destaque">Venha nos conhecer e fazer parte da nossa história!</p>
  </section>
</template>

<style scoped>
.sobre-page {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.sobre-img {
  max-width: 800px;
  width: 100%;
  border-radius: 8px;
}

.sobre-texto {
  max-width: 700px;
  text-align: center;
  font-size: 1.05em;
  line-height: 1.7;
}

.destaque {
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 640px) {
  .sobre-page {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  .sobre-texto {
    font-size: 0.97em;
  }
}
</style>
