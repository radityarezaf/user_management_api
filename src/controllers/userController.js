import pool from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// GET all users 
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Upload avatar (only self)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();
    const { id } = req.user;

    await pool.query('UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [result.secure_url, id]);

    res.json({ message: 'Avatar uploaded successfully', url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// Update profile (only self)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    // Validate email
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    let hashedPassword = null;
    if (password) {
      if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const query = `
      UPDATE users
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, username, email, role, avatar_url, updated_at
    `;
    const { rows } = await pool.query(query, [username, email, hashedPassword, userId]);

    res.json({ message: 'Profile updated successfully', user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};
