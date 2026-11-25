const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openapiDocument = require('./src/docs/openapi.json');
const authRoutes = require('./src/routes/authRoutes.cjs');
const pengaduanRoutes = require('./src/routes/pengaduanRoutes.cjs');
const { errorHandler } = require('./src/middleware/errorMiddleware.cjs');

const app = express();

app.use(cors());
app.use(express.json());

// Halaman Dokumentasi Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Routes Utama
app.use('/api/auth', authRoutes);
app.use('/api/pengaduan', pengaduanRoutes);

// Handler untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan.'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;