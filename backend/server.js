require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const carrosRouter = require('./src/routes/carros');
const catalogoRouter = require('./src/routes/catalogo');
const contatoRouter = require('./src/routes/contato');
const authAdminRouter = require('./src/routes/authAdmin');
const { criarRotasProduto } = require('./src/routes/produtoRotas');
const { naoEncontrado, tratarErro } = require('./src/middleware/errors');

if (!process.env.JWT_SECRET) {
  console.error('❌  JWT_SECRET não definido. Veja backend/.env.example.');
  process.exit(1);
}

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
app.use('/api/admin/auth', authAdminRouter);

// ─── Erros ────────────────────────────────────────────────────────────────────
app.use(naoEncontrado);
app.use(tratarErro);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Chiquinho Motors® API rodando em http://localhost:${PORT}`);
});
