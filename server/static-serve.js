// server/static-serve.js
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupStaticServing(app) {
  const buildPath = path.join(__dirname, '../build'); // React build folder
  app.use(express.static(buildPath));

  app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
