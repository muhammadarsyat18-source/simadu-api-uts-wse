const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository.cjs');

const login = (username, password) => {
  if (!username || !password) {
    const err = new Error('Username dan password wajib diisi.');
    err.statusCode = 400;
    throw err;
  }

  const user = userRepo.findByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    const err = new Error('Kredensial tidak valid (username atau password salah).');
    err.statusCode = 401;
    throw err;
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    mahasiswaId: user.mahasiswaId
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  return {
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    user: {
      username: user.username,
      nama: user.nama,
      role: user.role,
      mahasiswaId: user.mahasiswaId
    }
  };
};

module.exports = { login };