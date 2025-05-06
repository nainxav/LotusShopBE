// Import dependencies
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import User from './models/User.js'; // Assuming you have a User model
import authRoutes from './routes/Auth.js';  // Corrected to use `import`
import encrypt from './utils/encryption.js'; // Jangan lupa .js di akhir

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 SHUTTING DOWN...');
  console.log(err, err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: './.env' });

// Create the Express app
const app = express();

// Use CORS and body parser
app.use(cors());
app.use(express.json());

// Register User function
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const encryptedPassword = encrypt(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'Pengguna berhasil terdaftar!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
};

// Register route
const router = express.Router();
router.post('/register', registerUser);

// Authentication route
app.post('/api/authenticate', async (req, res) => {
  const { email, password } = req.body;

  console.log("Incoming login request:");
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      return res.json({ success: true, message: 'Login successful' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Use the router
app.use('/api', router);

// Database connection and server initialization
const port = process.env.PORT || 3001;

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the server after successful DB connection
    const server = app.listen(port, () => {
      console.log(`==> DATABASE connection established!\n==> SERVER running on port ${port}...`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 🔥 SHUTTING DOWN...');
      console.log(err.name, err.message, err);

      server.close(() => {
        process.exit(1);
      });
    });

    // Gracefully shut down on SIGTERM
    process.on('SIGTERM', () => {
      console.log('SIGTERM RECEIVED! Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated!');
      });
    });
  })
  .catch((err) => {
    console.log(`Database connection error: ${err}`);
  });
