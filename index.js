import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

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
        console.log('Admin login successful through mechanic portal');
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

    if (user) {
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
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await db.selectFrom('services').selectAll().orderBy('id').execute();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`🚀 API Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}