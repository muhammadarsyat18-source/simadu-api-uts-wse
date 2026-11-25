const pengaduanService = require('../services/pengaduanService.cjs');

const parseId = (paramId) => {
  const id = Number(paramId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Parameter ID harus berupa bilangan bulat positif.');
    err.statusCode = 400;
    throw err;
  }
  return id;
};

const getAll = (req, res, next) => {
  try {
    const data = pengaduanService.getAllPengaduan(req.user);
    res.status(200).json({
      status: 'success',
      message: 'Daftar pengaduan berhasil diambil.',
      data
    });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = pengaduanService.getPengaduanById(id, req.user);
    res.status(200).json({
      status: 'success',
      message: 'Detail pengaduan berhasil diambil.',
      data
    });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const data = pengaduanService.createPengaduan(req.body, req.user);
    res.status(201).json({
      status: 'success',
      message: 'Pengaduan berhasil dibuat.',
      data
    });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = pengaduanService.updatePengaduan(id, req.body, req.user);
    res.status(200).json({
      status: 'success',
      message: 'Pengaduan berhasil diperbarui.',
      data
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = pengaduanService.updateStatusPengaduan(id, req.body.status);
    res.status(200).json({
      status: 'success',
      message: 'Status pengaduan berhasil diperbarui.',
      data
    });
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    pengaduanService.deletePengaduan(id, req.user);
    res.status(200).json({
      status: 'success',
      message: 'Pengaduan berhasil dihapus.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, updateStatus, remove };