require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://e-commerce-in-gadgets-bpnv-nu.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for smooth development & deployment
    }
  },
  credentials: true,
}));
app.use(express.json());

// Mount routers
app.use('/api/users', require('./routers/userrouter'));
app.use('/api/products', require('./routers/productrouter'));
app.use('/api/orders', require('./routers/orderrouter'));
app.use('/api/admin', require('./routers/adminrouter'));
app.use('/api/chatbot', require('./routers/chatbotrouter'));

app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const dbStatus = isConnected ? 'Connected' : 'Disconnected (Fallback Mode Active)';
  res.status(200).json({
    status: 'OK',
    message: 'GadgetHub API is running',
    database: dbStatus,
  });
});

const { seedProducts } = require('./seedProducts');
const PORT = process.env.PORT || 5000;

// Start server immediately
app.listen(PORT, () => {
  console.log(`🚀 GadgetHub API server is running on port ${PORT}`);
});

// Attempt MongoDB Connection asynchronously without exiting process on failure
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { family: 4, serverSelectionTimeoutMS: 4000 })
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas');
      await seedProducts();
    })
    .catch((err) => {
      console.warn('⚠️ Warning: MongoDB Atlas connection failed:', err.message);
      console.warn('Backend API will run in fallback mode with built-in product catalog.');
    });
} else {
  console.warn('⚠️ MONGO_URI not set. Running backend API in fallback mode.');
}
