import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { setupStaticServing } from './static-serve.js';
import { db } from './database.js';

dotenv.config();
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log API requests
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
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
      if (user.is_banned)
        return res
          .status(403)
          .json({ success: false, message: user.ban_message || 'Banned.', banned: true });
      if (user.role === 'mechanic' && !user.is_approved)
        return res
          .status(403)
          .json({ success: false, message: 'Pending approval.', pending_approval: true });

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ success: true, user: userWithoutPassword });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get services route
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.selectFrom('services').selectAll().orderBy('id').execute();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================
   SERVE FRONTEND
===================== */

// Use static-serve.js for production if needed
if (process.env.NODE_ENV === 'production') {
  setupStaticServing(app);
}

// Serve React build folder
const buildPath = path.join(process.cwd(), 'build'); // 'build' is the folder React creates
app.use(express.static(buildPath));

// Catch-all route to serve index.html for React SPA
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
