const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau sudah kedaluwarsa.'
      });
    }
    req.user = decodedUser;
    next();
  });
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses dilarang. Peran Anda tidak memiliki izin untuk operasi ini.'
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };