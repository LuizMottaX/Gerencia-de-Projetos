const express = require('express');
const cors = require('cors');
const carros = require('./data/carros');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// ─── Rotas ───────────────────────────────────────────────────────────────────

/**
 * GET /api/carros
 * Retorna a lista de todos os veículos disponíveis.
 */
app.get('/api/carros', (req, res) => {
  res.json(carros);
});

/**
 * GET /api/carros/:id
 * Retorna os detalhes de um veículo específico pelo ID.
 */
app.get('/api/carros/:id', (req, res) => {
  const carro = carros.find((c) => c.id === req.params.id);
  if (!carro) {
    return res.status(404).json({ erro: 'Veículo não encontrado.' });
  }
  res.json(carro);
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Chiquinho Motors® API rodando em http://localhost:${PORT}`);
});
