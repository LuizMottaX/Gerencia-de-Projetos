// Aplicação Express sem `listen` — o server.js sobe a porta e os testes
// usam o app direto com o Supertest.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const carrosRouter = require('./src/routes/carros');
const catalogoRouter = require('./src/routes/catalogo');
const contatoRouter = require('./src/routes/contato');
const pedidosRouter = require('./src/routes/pedidos');
const authAdminRouter = require('./src/routes/authAdmin');
const { criarRotasProduto } = require('./src/routes/produtoRotas');
const { naoEncontrado, tratarErro } = require('./src/middleware/errors');

const app = express();

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
app.use('/api/pedidos', pedidosRouter);
app.use('/api', catalogoRouter); // /api/categorias, /api/modelos
app.use('/api/admin/auth', authAdminRouter);

// ─── Erros ────────────────────────────────────────────────────────────────────
app.use(naoEncontrado);
app.use(tratarErro);

module.exports = app;
