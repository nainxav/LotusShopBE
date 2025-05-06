// import express from 'express';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';

// const router = express.Router();

// router.post('/register', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ success: true, message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ success: false, message: 'Server error during registration' });
//   }
// });

// export default router;
// routes/auth.js atau api.js
// routes/Auth.js

import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
// // Get the current directory (equivalent to __dirname in CommonJS)
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

const router = express.Router();

// // Define the path to the 'data' folder and the 'users.json' file
// const dataDir = path.join(__dirname, '../data');  // Using relative path to reach data
const usersFile = 'C:/laragon/www/Audio-Ecommerce/server/data/users.json';

// Check if the 'users.json' file exists, if not, create it
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([])); // Create an empty array initially
}

// Example of how to add a new user
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123', // In real apps, don't store plain passwords
};

// Add new user data to the users.json file
try {
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  users.push(userData);

  // Write updated users data back to the file
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
} catch (err) {
  console.error('Error while reading/writing file:', err);
};

// Endpoint untuk registrasi pengguna
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    // Validasi input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simpan pengguna baru ke MongoDB
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error); // Log the error here
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
// Export the router as default
export default router;


