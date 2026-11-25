let pengaduanList = [
  {
    id: 1,
    mahasiswaId: '240101001',
    judul: 'AC Ruang Kuliah 3.2 Rusak',
    kategori: 'Fasilitas',
    deskripsi: 'AC di ruang kuliah 3.2 gedung FST tidak dingin sejak kemarin.',
    status: 'diajukan',
    createdAt: '2026-11-20T08:00:00.000Z'
  },
  {
    id: 2,
    mahasiswaId: '240101002',
    judul: 'Nilai Mata Kuliah Belum Muncul di SIAKAD',
    kategori: 'Akademik',
    deskripsi: 'Nilai praktikum jaringan semester lalu belum terinput.',
    status: 'diproses',
    createdAt: '2026-11-21T09:30:00.000Z'
  }
];

let nextId = 3;

const findAll = () => pengaduanList;
const findById = (id) => pengaduanList.find((item) => item.id === id);

const create = (data) => {
  const newItem = {
    id: nextId++,
    ...data,
    status: 'diajukan',
    createdAt: new Date().toISOString()
  };
  pengaduanList.push(newItem);
  return newItem;
};

const update = (id, updatedFields) => {
  const index = pengaduanList.findIndex((item) => item.id === id);
  if (index === -1) return null;
  pengaduanList[index] = { ...pengaduanList[index], ...updatedFields };
  return pengaduanList[index];
};

const remove = (id) => {
  const index = pengaduanList.findIndex((item) => item.id === id);
  if (index === -1) return false;
  pengaduanList.splice(index, 1);
  return true;
};

module.exports = { findAll, findById, create, update, remove };