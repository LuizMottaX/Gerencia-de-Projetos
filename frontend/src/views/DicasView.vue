<template>
  <section class="dicas-page">
    <h1>Dicas Automotivas</h1>

    <!-- Vídeos -->
    <div class="video-bloco">
      <p class="dica-titulo">O porquê de pisar na embreagem ao dar partida:</p>
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/_pIUYoEl7rg"
          title="Por que pisar na embreagem ao dar partida"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="video-bloco">
      <p class="dica-titulo">O jeito correto de engatar marchas no trânsito:</p>
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/BWUU1EIlmjE"
          title="Como engatar marchas corretamente no trânsito"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="video-bloco">
      <p class="dica-titulo">Como conservar a pintura de seu veículo:</p>
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/mA42Nij5FX4"
          title="Como conservar a pintura do carro"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Dicas em texto -->
    <ul class="dicas-lista">
      <li v-for="dica in dicas" :key="dica">{{ dica }}</li>
    </ul>
  </section>
</template>

<script setup>
const dicas = [
  'Mantenha seus pneus sempre calibrados de acordo com a recomendação do fabricante. Isso pode garantir uma maior durabilidade e melhor desempenho do veículo.',
  'Verifique o nível de óleo do motor regularmente e troque-o de acordo com o prazo estipulado pelo fabricante. Isso pode evitar danos ao motor e garantir uma vida útil maior para o veículo.',
  'Evite acelerar bruscamente e frear de forma repentina, pois isso pode aumentar o desgaste dos pneus, dos freios e de outros componentes do veículo.',
  'Faça a manutenção preventiva do veículo regularmente, de acordo com a recomendação do fabricante. Isso pode evitar problemas mecânicos e aumentar a vida útil do veículo.',
  'Evite deixar o seu automóvel em locais com sol por períodos de tempo prolongados. A exposição do veículo ao sol pode levar à degradação acelerada da pintura.',
  'Ao escolher o óleo de motor para seu veículo, considere fatores como viscosidade, classificação e aditivos. Verifique o manual do proprietário para saber qual é o óleo recomendado e siga as orientações do fabricante. Certifique-se de que o óleo seja classificado pela API e que tenha a viscosidade correta para o clima e as condições de condução do seu veículo.',
  'Para economizar combustível, mantenha a manutenção do veículo em dia, dirija suavemente, evite acelerações e frenagens bruscas, mantenha os pneus calibrados e escolha rotas mais eficientes. Considere também a carga do veículo, remova itens desnecessários, desligue o motor em paradas prolongadas e use o ar condicionado com moderação.',
  'Para fazer a manutenção regular do sistema de freios, verifique o nível do fluido de freio e as pastilhas regularmente. Se o fluido estiver baixo, adicione mais até o nível correto. Se as pastilhas estiverem gastas, substitua-as imediatamente. Verifique também o disco de freio quanto a desgaste excessivo e possíveis vazamentos.',
];
</script>

<style scoped>
.dicas-page {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.video-bloco {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Wrapper 16:9 responsivo para iframes */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  border-radius: 6px;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.dica-titulo {
  font-weight: bold;
  font-size: 1.05em;
  text-align: left;
  width: 100%;
}

.dicas-lista {
  list-style: disc;
  padding-left: 1.5rem;
  text-align: left;
  width: 100%;
}

.dicas-lista li {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>
