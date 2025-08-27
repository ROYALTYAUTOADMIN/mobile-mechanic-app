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

// Middleware
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

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('Login attempt:', { username, role });

    // Lookup user in database
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .where('role', '=', role)
      .executeTakeFirst();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check banned
    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        message: user.ban_message || 'Banned',
        banned: true,
      });
    }

    // Check mechanic approval
    if (user.role === 'mechanic' && !user.is_approved) {
      return res.status(403).json({
        success: false,
        message: 'Pending approval',
        pending_approval: true,
      });
    }

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;
    return res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get services
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.selectFrom('services').selectAll().orderBy('id').execute();
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================
   SERVE FRONTEND
===================== */

// Serve React build
const buildPath = path.join(process.cwd(), 'build');
app.use(express.static(buildPath));

if (process.env.NODE_ENV === 'production') {
  setupStaticServing(app);
}

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
