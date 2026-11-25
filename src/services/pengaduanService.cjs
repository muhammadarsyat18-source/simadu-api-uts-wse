const pengaduanRepo = require('../repositories/pengaduanRepository.cjs');

const getAllPengaduan = (user) => {
  const allData = pengaduanRepo.findAll();
  if (user.role === 'admin') {
    return allData;
  }
  return allData.filter((item) => item.mahasiswaId === user.mahasiswaId);
};

const getPengaduanById = (id, user) => {
  const item = pengaduanRepo.findById(id);
  if (!item) {
    const err = new Error('Data pengaduan tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }

  if (user.role === 'mahasiswa' && item.mahasiswaId !== user.mahasiswaId) {
    const err = new Error('Anda tidak memiliki hak akses untuk melihat pengaduan mahasiswa lain.');
    err.statusCode = 403;
    throw err;
  }

  return item;
};

const createPengaduan = (data, user) => {
  return pengaduanRepo.create({
    mahasiswaId: user.mahasiswaId,
    judul: data.judul.trim(),
    kategori: data.kategori,
    deskripsi: data.deskripsi.trim()
  });
};

const updatePengaduan = (id, data, user) => {
  const item = pengaduanRepo.findById(id);
  if (!item) {
    const err = new Error('Data pengaduan tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }

  if (item.mahasiswaId !== user.mahasiswaId) {
    const err = new Error('Anda hanya diperbolehkan mengubah pengaduan milik sendiri.');
    err.statusCode = 403;
    throw err;
  }

  if (item.status !== 'diajukan') {
    const err = new Error('Pengaduan tidak dapat diubah karena statusnya sudah diproses atau selesai.');
    err.statusCode = 403;
    throw err;
  }

  return pengaduanRepo.update(id, {
    judul: data.judul.trim(),
    kategori: data.kategori,
    deskripsi: data.deskripsi.trim()
  });
};

const updateStatusPengaduan = (id, status) => {
  const item = pengaduanRepo.findById(id);
  if (!item) {
    const err = new Error('Data pengaduan tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }

  return pengaduanRepo.update(id, { status });
};

const deletePengaduan = (id, user) => {
  const item = pengaduanRepo.findById(id);
  if (!item) {
    const err = new Error('Data pengaduan tidak ditemukan.');
    err.statusCode = 404;
    throw err;
  }

  if (item.mahasiswaId !== user.mahasiswaId) {
    const err = new Error('Anda hanya diperbolehkan menghapus pengaduan milik sendiri.');
    err.statusCode = 403;
    throw err;
  }

  if (item.status !== 'diajukan') {
    const err = new Error('Pengaduan tidak dapat dihapus karena statusnya sudah diproses atau selesai.');
    err.statusCode = 403;
    throw err;
  }

  pengaduanRepo.remove(id);
};

module.exports = {
  getAllPengaduan,
  getPengaduanById,
  createPengaduan,
  updatePengaduan,
  updateStatusPengaduan,
  deletePengaduan
};