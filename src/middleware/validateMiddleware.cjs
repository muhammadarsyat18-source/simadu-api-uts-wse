const ALLOWED_KATEGORI = ['Fasilitas', 'Akademik', 'TI'];
const ALLOWED_STATUS = ['diajukan', 'diproses', 'selesai'];

const validatePengaduanInput = (req, res, next) => {
  const allowedFields = ['judul', 'kategori', 'deskripsi'];
  const bodyKeys = Object.keys(req.body || {});

  const extraFields = bodyKeys.filter((key) => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Field tidak diperbolehkan: ${extraFields.join(', ')}`
    });
  }

  const { judul, kategori, deskripsi } = req.body;

  if (!judul || typeof judul !== 'string' || judul.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Field judul wajib diisi.' });
  }

  if (!kategori || !ALLOWED_KATEGORI.includes(kategori)) {
    return res.status(400).json({
      status: 'error',
      message: `Kategori wajib diisi dengan salah satu dari: ${ALLOWED_KATEGORI.join(', ')}`
    });
  }

  if (!deskripsi || typeof deskripsi !== 'string' || deskripsi.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Field deskripsi wajib diisi.' });
  }

  next();
};

const validateStatusInput = (req, res, next) => {
  const bodyKeys = Object.keys(req.body || {});
  if (bodyKeys.length !== 1 || !bodyKeys.includes('status')) {
    return res.status(400).json({
      status: 'error',
      message: 'Permintaan hanya boleh berisi field status.'
    });
  }

  const { status } = req.body;
  if (!status || !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: `Status harus salah satu dari: ${ALLOWED_STATUS.join(', ')}`
    });
  }

  next();
};

module.exports = { validatePengaduanInput, validateStatusInput };