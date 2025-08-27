import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupStaticServing } from './static-serve.js';
import { db } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Login API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .where('role', '=', role)
      .executeTakeFirst();

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (user.is_banned) return res.status(403).json({ success: false, banned: true, message: 'Banned' });
    if (user.role === 'mechanic' && !user.is_approved)
      return res.status(403).json({ success: false, pending_approval: true, message: 'Pending approval' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Services API
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.selectFrom('services').selectAll().orderBy('id').execute();
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve frontend
if (process.env.NODE_ENV === 'production') setupStaticServing(app);

const buildPath = path.join(process.cwd(), 'dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
