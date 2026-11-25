const express = require('express');
const router = express.Router();
const pengaduanController = require('../controllers/pengaduanController.cjs');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware.cjs');
const { validatePengaduanInput, validateStatusInput } = require('../middleware/validateMiddleware.cjs');

router.use(authenticateToken);

router.get('/', pengaduanController.getAll);
router.get('/:id', pengaduanController.getById);
router.post('/', authorizeRole('mahasiswa'), validatePengaduanInput, pengaduanController.create);
router.put('/:id', authorizeRole('mahasiswa'), validatePengaduanInput, pengaduanController.update);
router.patch('/:id/status', authorizeRole('admin'), validateStatusInput, pengaduanController.updateStatus);
router.delete('/:id', authorizeRole('mahasiswa'), pengaduanController.remove);

module.exports = router;