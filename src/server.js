require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const apiKeyRoutes = require('./routes/apikeys');
const settingsRoutes = require('./routes/settings');
const orderRoutes = require('./routes/orders');
const positionRoutes = require('./routes/positions');
const botRoutes = require('./routes/bots');
const backtestRoutes = require('./routes/backtests');
const alertRoutes = require('./routes/alerts');

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: { origin: '*' }
});

// middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(csurf({ cookie: true }));
}

// expose csrf token for frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// attach io to request
app.use((req, res, next) => { req.io = io; next(); });

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apikeys', apiKeyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/backtests', backtestRoutes);
app.use('/api/alerts', alertRoutes);

// serve client in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// db connect & start
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    })
    .catch(err => console.error('Mongo connection error', err));
} else {
  // in tests we don't start the server listener
  server.listen(PORT);
}

module.exports = { app, io };
