require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const carrosRouter = require('./src/routes/carros');
const catalogoRouter = require('./src/routes/catalogo');
const contatoRouter = require('./src/routes/contato');
const { criarRotasProduto } = require('./src/routes/produtoRotas');
const { naoEncontrado, tratarErro } = require('./src/middleware/errors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors()); // em dev o proxy do Vite cobre o CORS; libera geral por simplicidade
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/carros', carrosRouter);
app.use('/api/pecas', criarRotasProduto('PECA'));
app.use('/api/acessorios', criarRotasProduto('ACESSORIO'));
app.use('/api/contato', contatoRouter);
app.use('/api', catalogoRouter); // /api/categorias, /api/modelos

// ─── Erros ────────────────────────────────────────────────────────────────────
app.use(naoEncontrado);
app.use(tratarErro);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Chiquinho Motors® API rodando em http://localhost:${PORT}`);
});
