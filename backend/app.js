// Aplicação Express sem `listen` — o server.js sobe a porta e os testes
// usam o app direto com o Supertest.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const carrosRouter = require('./src/routes/carros');
const catalogoRouter = require('./src/routes/catalogo');
const contatoRouter = require('./src/routes/contato');
const pedidosRouter = require('./src/routes/pedidos');
const servicosRouter = require('./src/routes/servicos');
const agendamentosRouter = require('./src/routes/agendamentos');
const authAdminRouter = require('./src/routes/authAdmin');
const adminRouter = require('./src/routes/admin');
const { UPLOAD_DIR } = require('./src/routes/admin/uploads');
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
app.use('/api/servicos', servicosRouter);
app.use('/api/agendamentos', agendamentosRouter);
app.use('/api', catalogoRouter); // /api/categorias, /api/modelos
app.use('/api/admin/auth', authAdminRouter);
app.use('/api/admin', adminRouter);

// Imagens enviadas pelo painel (nomes aleatórios, nunca sobrescritos → cache longo).
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));

// ─── Erros ────────────────────────────────────────────────────────────────────
app.use(naoEncontrado);
app.use(tratarErro);

module.exports = app;
