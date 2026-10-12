// Tudo em /api/admin exige token de administrador (exceto /api/admin/auth,
// montado antes no app.js).

const { Router } = require('express');
const { verificarAdmin } = require('../../middleware/authAdmin');

const router = Router();
router.use(verificarAdmin);

router.use('/produtos', require('./produtos'));
router.use('/carros', require('./carros'));
router.use('/servicos', require('./servicos'));
router.use('/uploads', require('./uploads').router);
router.use('/', require('./cadastros')); // /categorias, /marcas, /modelos
router.use('/', require('./operacoes')); // /pedidos, /agendamentos, /mensagens, /resumo

module.exports = router;
