// index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database.js';
import { setupStaticServing } from './static-serve.js'; // Make sure this exists

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger for API requests
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// -------------------
// Auth Route
// -------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (role === 'mechanic' && username === 'ROYALTYAUTOADMIN' && password === 'Napkin06102001!') {
      const adminUser = await db
        .selectFrom('users')
        .selectAll()
        .where('username', '=', 'ROYALTYAUTOADMIN')
        .where('role', '=', 'admin')
        .executeTakeFirst();

      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser;
        res.json({ success: true, user: userWithoutPassword });
        return;
      }
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .where('role', '=', role)
      .executeTakeFirst();

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (user.is_banned) {
      res.status(403).json({ success: false, message: user.ban_message || 'Banned.', banned: true });
      return;
    }

    if (user.role === 'mechanic' && !user.is_approved) {
      res.status(403).json({ success: false, message: 'Pending approval.', pending_approval: true });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// -------------------
// Services Route
// -------------------
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.selectFrom('services').selectAll().orderBy('id').execute();
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------
// Serve static frontend
// -------------------
if (process.env.NODE_ENV === 'production') {
  setupStaticServing(app);
}

// -------------------
// Start server
// -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
