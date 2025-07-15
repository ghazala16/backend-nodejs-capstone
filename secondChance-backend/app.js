/* jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');

const app = express();
const port = 3063;

// Middleware
app.use(cors());
app.use(express.json());

// Logger
const pinoHttp = require('pino-http');
app.use(pinoHttp({ logger: pinoLogger }));

// Database connection
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => pinoLogger.error('Failed to connect to DB', e));

// Routes
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/api/secondchance/items', secondChanceItemsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/secondchance/search', searchRoutes);

// Basic endpoint
app.get('/', (req, res) => {
    res.send('Inside the server');
});

// Global Error Handler
app.use((err, req, res, next) => {
    pinoLogger.error(err);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
    pinoLogger.info(`Server running on port ${port}`);
});
