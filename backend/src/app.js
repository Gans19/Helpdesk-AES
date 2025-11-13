const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: false
  })
);

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadDir)));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'API healthy' })
);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
);

app.use(errorHandler);

module.exports = app;

