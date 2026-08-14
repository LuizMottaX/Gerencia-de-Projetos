<template>
  <section class="noticias-page">
    <h1>Notícias Automotivas</h1>
    <h2>Fique por dentro de todas as novidades do mundo automotivo!</h2>

    <div class="grid-container">
      <div v-for="noticia in noticias" :key="noticia.url" class="zoom card">
        <a :href="noticia.url" target="_blank" rel="noopener noreferrer">
          <img :src="noticia.imagem" :alt="noticia.titulo" />
        </a>
        <div class="text-item">
          <a :href="noticia.url" target="_blank" rel="noopener noreferrer" class="card-titulo">
            {{ noticia.titulo }}
          </a>
        </div>
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
.noticias-page {
  padding: 1rem;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
}

.card-titulo {
  display: block;
  font-size: 0.95em;
  color: #333;
  margin-top: 0.4rem;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .card img {
    height: 140px;
  }
}
</style>
