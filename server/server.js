// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const authRouter = require('./routes/auth.route');
const prodRouter   = require('./routes/product.route')
const User = require('./models/user.model'); // ✅ Use correct path

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

// ✅ Create admin user if not exists
async function initAdminUser() {
  try {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const newAdmin = new User({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin', // ✅ Your schema uses this
      });

      await newAdmin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  }
}

// MongoDB connection and admin init
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await initAdminUser(); // ✅ Create admin only if needed
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/server/auth', authRouter);
app.use('/server/product', prodRouter);


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
