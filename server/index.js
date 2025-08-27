// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupStaticServing } from './static-serve.js';
import { db } from './database.js';

dotenv.config();

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log API requests
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

/* =====================
   API ROUTES
===================== */

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('Login attempt:', { username, role });

    if (role === 'mechanic' && username === 'ROYALTYAUTOADMIN' && password === 'Napkin06102001!') {
      const adminUser = await db
        .selectFrom('users')
        .selectAll()
        .where('username', '=', 'ROYALTYAUTOADMIN')
        .where('role', '=', 'admin')
        .executeTakeFirst();

      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser;
        return res.json({ success: true, user: userWithoutPassword });
      }
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .where('role', '=', role)
      .executeTakeFirst();

    if (user) {
      if (user.is_banned) {
        return res
          .status(403)
          .json({ success: false, message: user.ban_message || 'Banned.', banned: true });
      }
      if (user.role === 'mechanic' && !user.is_approved) {
        return res
          .status(403)
          .json({
