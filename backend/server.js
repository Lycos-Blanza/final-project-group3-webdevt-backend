require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const reservationRoutes = require('./routes/reservation.routes');
const contactRoutes = require('./routes/contact.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// connect DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reservation-db';
connectDB(MONGO_URI);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/restaurants', restaurantRoutes);

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
