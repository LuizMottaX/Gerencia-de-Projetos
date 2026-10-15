const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const { Router } = require('express');
const multer = require('multer');
const { ErroHttp } = require('../../middleware/errors');

// Imagens enviadas pelo painel ficam em backend/uploads (ou UPLOAD_DIR) e são
// servidas em /uploads pelo app.js — o frontend nunca recebe arquivos do backend.
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads'));
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXTENSOES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // Nome aleatório: nunca usa o nome enviado (evita path traversal e colisões).
    filename: (req, file, cb) =>
      cb(null, crypto.randomBytes(12).toString('hex') + EXTENSOES[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (EXTENSOES[file.mimetype]) return cb(null, true);
    cb(new ErroHttp(400, 'Formato não suportado. Envie JPG, PNG ou WebP.'));
  },
});

const router = Router();

/** POST /api/admin/uploads — campo "imagem"; devolve a URL pública. */
router.post('/', upload.single('imagem'), (req, res) => {
  if (!req.file) throw new ErroHttp(400, 'Envie um arquivo no campo "imagem".');
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = { router, UPLOAD_DIR };
