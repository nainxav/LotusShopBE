// // //==> REQUESTING DEPENDENCIES
// // import mongoose from 'mongoose';

// // //==> CATCHING UNCAUGHT EXCEPTION ERRORS
// // process.on('uncaughtException', err => {
// //   console.log('UNCAUGHT EXCEPTION! 🔥  SHUTTING DOWN...');
// //   console.log(err, err.name, err.message);

// //   process.exit(1);
// // });

// // //==> CONNECTING ENV FILE
// // import dotenv from 'dotenv';
// // dotenv.config({ path: `./.env` });

// // //==> REQUESTING MODULES
// // import app from './app.js';

// // //==> CONNECTING THE DATABASE AND STARTING THE SERVER
// // const port = process.env.PORT || 3001;

// // mongoose
// //   .connect(process.env.DATABASE, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => {
// //     app.listen(port, () => {
// //       console.log(
// //         `==> DATABASE connection established!\n==> SERVER running on port ${port}...`
// //       );
// //     });
// //   })
// //   .catch(err => console.log(`Database connection error: ${err}`));

// // process.on('unhandledRejection', err => {
// //   console.log('UNHANDLED REJECTION! 🔥  SHUTTING DOWN...');
// //   console.log(err.name, err.message, err);

// //   server.close(() => {
// //     process.exit(1);
// //   });
// // });

// // process.on('SIGTERM', () => {
// //   console.log('SIGTERM RECEIVED! Shutting down gracefully...');

// //   server.close(() => {
// //     console.log('Process terminated!');
// //   });
// // });

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import app from './app.js';


// // Change to ES module syntax
// import express from 'express';
// import cors from 'cors';

// app.use(cors());


// // Catching uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 🔥  SHUTTING DOWN...');
//   console.log(err, err.name, err.message);

//   process.exit(1);
// });

// // Connecting environment variables
// dotenv.config({ path: './.env' });

// // Database connection
// const port = process.env.PORT || 3001;

// mongoose
//   .connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     // Store the server instance in a variable
//     const server = app.listen(port, () => {
//       console.log(
//         `==> DATABASE connection established!\n==> SERVER running on port ${port}...`
//       );
//     });

//     // Handle unhandled rejections
//     process.on('unhandledRejection', (err) => {
//       console.log('UNHANDLED REJECTION! 🔥  SHUTTING DOWN...');
//       console.log(err.name, err.message, err);

//       server.close(() => {
//         process.exit(1);
//       });
//     });

//     // Gracefully shutting down on SIGTERM
//     process.on('SIGTERM', () => {
//       console.log('SIGTERM RECEIVED! Shutting down gracefully...');

//       server.close(() => {
//         console.log('Process terminated!');
//       });
//     });
//   })
//   .catch((err) => console.log(`Database connection error: ${err}`));

// //   // Contoh sederhana untuk endpoint API
// // app.post('/api/authenticate', async (req, res) => {
// //   const { email, password } = req.body;

// //   // Cek apakah user ada di database
// //   const user = await User.findOne({ email: email });

// //   if (user && user.password === password) {
// //     res.json({ success: true, message: 'Login successful' });
// //   } else {
// //     res.json({ success: false, message: 'Invalid email or password' });
// //   }
// // });
// app.post('/api/authenticate', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (user && user.password === password) {
//       res.json({ success: true, message: 'Login successful' });
//     } else {
//       res.json({ success: false, message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error('Error during authentication:', error);
//     res.status(500).json({ success: false, message: 'An error occurred while trying to login' });
//   }
// });

// Import dependencies
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import User from './models/User.js'; // Assuming you have a User model
import authRoutes from './routes/Auth.js';  // Corrected to use `import`

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

// // Routes
// app.use('/api', authRoutes);

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Membuat pengguna baru
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,  // Anda mungkin ingin mengenkripsi password di sini
    });

    // Menyimpan pengguna ke database
    await newUser.save();

    res.status(201).json({ message: 'Pengguna berhasil terdaftar!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
};

// Ini adalah router untuk menangani permintaan pendaftaran
const router = express.Router();

router.post('/register', registerUser);

// // Define the authentication endpoint
// app.post('/api/authenticate', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email: email });

//     if (user && user.password === password) {
//       res.json({ success: true, message: 'Login successful' });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

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
