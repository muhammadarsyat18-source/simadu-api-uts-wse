const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Format JSON pada body permintaan tidak valid.'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Terjadi kesalahan internal pada server.'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message
  });
};

module.exports = { errorHandler };