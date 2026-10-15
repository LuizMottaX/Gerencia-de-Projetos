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
const { logRequisicoes } = require('./src/middleware/logs');
const prisma = require('./src/lib/prisma');
const { version } = require('./package.json');

const app = express();

// Atrás do proxy da hospedagem (Coolify/Railway/Render/Vercel), o IP real vem em
// X-Forwarded-For. Sem isso o rate limit veria todos os clientes como um só IP.
// TRUST_PROXY = número de proxies na frente (ex.: 1).
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY));

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
// Em dev o proxy do Vite cobre o CORS. Em produção, o frontend na Vercel repassa
// /api pelo mesmo domínio (vercel.json); CORS_ORIGIN só é preciso se o
// frontend chamar a API direto de outro domínio (lista separada por vírgula).
const origens = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim());
app.use(cors(origens ? { origin: origens } : undefined));
app.use(logRequisicoes);
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
/** Saúde do serviço para o healthcheck da hospedagem: confere o banco de verdade. */
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, banco: 'ok' });
  } catch {
    res.status(503).json({ ok: false, banco: 'indisponível' });
  }
});

/** Versão em produção — o commit vem da hospedagem (Coolify: SOURCE_COMMIT). */
app.get('/api/version', (req, res) => {
  res.json({
    versao: version,
    commit:
      process.env.SOURCE_COMMIT ||
      process.env.RAILWAY_GIT_COMMIT_SHA ||
      process.env.RENDER_GIT_COMMIT ||
      null,
    node: process.version,
    ambiente: process.env.NODE_ENV || 'development',
  });
});

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
