<template>
  <section class="dicas-page">
    <div class="section-banner">
      <h1><Lightbulb :size="26" /> Dicas Automotivas</h1>
      <p class="banner-sub">Vídeos e orientações para cuidar bem do seu veículo</p>
    </div>

    <div class="dicas-inner">
      <!-- Vídeos em 2 colunas -->
      <div class="videos-grid">
        <article v-for="v in videos" :key="v.id" class="video-bloco">
          <p class="dica-titulo">{{ v.titulo }}</p>
          <div class="video-wrapper">
            <iframe
              :src="`https://www.youtube.com/embed/${v.id}`"
              :title="v.titulo"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </article>
      </div>

      <!-- Dicas em texto -->
      <h2>Boas práticas no dia a dia</h2>
      <ul class="dicas-lista">
        <li v-for="dica in dicas" :key="dica">{{ dica }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { Lightbulb } from 'lucide-vue-next';

const videos = [
  { id: '_pIUYoEl7rg', titulo: 'Por que pisar na embreagem ao dar partida' },
  { id: 'BWUU1EIlmjE', titulo: 'O jeito correto de engatar marchas no trânsito' },
  { id: 'mA42Nij5FX4', titulo: 'Como conservar a pintura do veículo' },
  { id: 'ineQ3iuwzsU', titulo: 'Como calibrar os pneus corretamente' },
  { id: '0hZpcpX69j4', titulo: 'Como verificar o nível de óleo do motor' },
  { id: 'CJcFRO-i5xo', titulo: 'Checklist do carro antes de viajar' },
];

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
  display: flex;
  flex-direction: column;
}

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.dicas-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem 1.5rem;
  width: 100%;
}

/* ── Grade de vídeos: 2 colunas ── */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem 1.5rem;
  margin-bottom: 2.5rem;
}

.video-bloco {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.dica-titulo {
  font-weight: 700;
  font-size: 1em;
  text-align: left;
  color: #1a1a1a;
  line-height: 1.35;
}

/* Wrapper 16:9 responsivo */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* ── Lista de dicas ── */
.dicas-inner h2 {
  text-align: left;
  font-size: 1.05em;
  color: #c0392b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
}

.dicas-lista {
  list-style: disc;
  padding-left: 1.5rem;
  text-align: left;
  max-width: 720px;
}

.dicas-lista li {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* ── Responsivo ── */
@media (max-width: 720px) {
  .videos-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
