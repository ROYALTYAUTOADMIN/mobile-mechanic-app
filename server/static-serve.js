import path from 'path';
import express from 'express';

export function setupStaticServing(app) {
  const buildPath = path.join(process.cwd(), 'dist');
  app.use(express.static(buildPath));

  app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
