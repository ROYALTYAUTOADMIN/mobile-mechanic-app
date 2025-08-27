import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log API requests
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Serve static React build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// API routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (role === 'mechanic' && username === 'ROYALTYAUTOADMIN' && password === 'Napkin06102001!') {
      const adminUser = await db
        .selectFrom('users')
        .selectAll()
        .where('username'
