const authService = require('../services/authService.cjs');

const login = (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const result = authService.login(username, password);
    res.status(200).json({
      status: 'success',
      message: 'Login berhasil.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };