<template>
  <section class="noticias-page">
    <div class="section-banner">
      <h1>📰 Notícias Automotivas</h1>
      <p class="banner-sub">Fique por dentro de todas as novidades do mundo automotivo!</p>
    </div>

    <div class="grid-container">
      <div v-for="noticia in noticias" :key="noticia.url" class="card noticia-card">
        <a :href="noticia.url" target="_blank" rel="noopener noreferrer" class="card-link">
          <div class="card-img-wrapper">
            <img :src="noticia.imagem" :alt="noticia.titulo" />
            <span class="card-badge">Leia mais →</span>
          </div>
          <div class="card-body text-item">
            <span class="noticia-fonte">Fonte externa</span>
            <p class="noticia-titulo">{{ noticia.titulo }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const noticias = [
  {
    titulo: 'Chevrolet Silverado chega em outubro e será picape mais potente do Brasil',
    imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2023/04/chevrolet_silverado_high_country_crew_cab_85.jpeg?quality=70&strip=info&w=600&h=400&crop=1',
    url: 'https://quatrorodas.abril.com.br/segredo/chevrolet-silverado-chega-em-outubro-e-sera-picape-mais-potente-do-brasil/',
  },
  {
    titulo: 'Do óleo aos pneus: os defeitos do Jeep Compass 1.3 turbo após 50.000 km',
    imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2020/05/DSCF7385-e1632080390238.jpg?quality=70&strip=info&w=1280&h=720&crop=1',
    url: 'https://quatrorodas.abril.com.br/testes/longa-duracao/do-oleo-aos-pneus-os-defeitos-do-jeep-compass-1-3-turbo-apos-50-000-km/',
  },
  {
    titulo: 'Vai viajar? Confira orientações da PRF para prevenir acidentes nas estradas',
    imagem: 'https://s2.glbimg.com/wjS54ipeU6rUZgOneKxA0kcCwcw=/810x456/top/smart/filters:max_age(3600)/https://s01.video.glbimg.com/deo/vi/18/27/11282718',
    url: 'https://g1.globo.com/es/espirito-santo/noticia/2023/01/16/vai-viajar-confira-orientacoes-da-prf-para-prevenir-acidentes-nas-estradas.ghtml',
  },
  {
    titulo: 'Jeep Renegade tem reajustes de até R$ 3 mil em menos de dois meses; veja os preços',
    imagem: 'https://s2.glbimg.com/OfiyNtHkXh3PsslG1yTFCoe2ndo=/0x0:1400x788/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2022/O/L/vBKo3BRueUboejHibgrA/jeep-renegade-longitude-.jpg',
    url: 'https://autoesporte.globo.com/seu-bolso/noticia/2023/04/jeep-renegade-tem-reajustes-de-ate-r-3-mil-em-menos-de-dois-meses-veja-os-precos.ghtml',
  },
  {
    titulo: 'Toyota Hilux GR-Sport é a melhor versão da picape, mas cobra (muito) caro por isso',
    imagem: 'https://s2.glbimg.com/CHoJQv9d0nZ2SEZk83wdLm4Pk5c=/0x0:1500x879/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2023/i/i/8dkBRAREA0eBUqonms1w/toyotahiluxgrs1.jpg',
    url: 'https://autoesporte.globo.com/testes/review/2023/04/toyota-hilux-gr-sport-e-a-melhor-versao-da-picape-mas-cobra-muito-caro-por-isso-teste.ghtml',
  },
  {
    titulo: 'Suzuki Jimny Sierra 2024 tem nova versão e se mantém como o carro 4x4 mais barato do Brasil',
    imagem: 'https://s2.glbimg.com/1KVJsl5z4GllaGZl5v7DB_NfOBU=/0x0:1600x1067/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2023/t/y/4VOaniTwW0w3v68ACXww/4expedition-2-.jpg',
    url: 'https://autoesporte.globo.com/lancamentos/noticia/2023/05/suzuki-jimny-sierra-2024-tem-nova-versao-e-se-mantem-como-o-carro-4x4-mais-barato-do-brasil.ghtml',
  },
];
</script>

<style scoped>
.noticias-page { display: flex; flex-direction: column; }

.banner-sub {
  color: #b0b4bc;
  font-size: 0.92em;
  margin-top: 0.25rem;
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.card-img-wrapper {
  position: relative;
  overflow: hidden;
  height: 180px;
}

.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.noticia-card:hover .card-img-wrapper img {
  transform: scale(1.08);
}

.card-badge {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(0deg, rgba(192,57,43,0.9) 0%, transparent 100%);
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 1rem 0.8rem 0.5rem;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s, transform 0.3s;
}

.noticia-card:hover .card-badge {
  opacity: 1;
  transform: translateY(0);
}

.card-body {
  padding: 12px 14px 14px;
}

.noticia-fonte {
  display: block;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c0392b;
  margin-bottom: 0.4rem;
}

.noticia-titulo {
  font-size: 0.9em;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .card-img-wrapper { height: 150px; }
}
</style>
