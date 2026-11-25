const bcrypt = require('bcryptjs');

// Password semua akun uji coba adalah: "password123"
const hashedPassword = bcrypt.hashSync('password123', 10);

const users = [
  {
    id: 'usr-1',
    username: 'mhs1',
    password: hashedPassword,
    role: 'mahasiswa',
    mahasiswaId: '240101001',
    nama: 'Ahmad Fauzi'
  },
  {
    id: 'usr-2',
    username: 'mhs2',
    password: hashedPassword,
    role: 'mahasiswa',
    mahasiswaId: '240101002',
    nama: 'Siti Aminah'
  },
  {
    id: 'usr-3',
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
    mahasiswaId: null,
    nama: 'Administrator Kampus'
  }
];

const findByUsername = (username) => {
  return users.find((u) => u.username === username);
};

module.exports = { findByUsername };