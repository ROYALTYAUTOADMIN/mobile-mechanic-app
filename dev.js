import { startServer } from '../server/index.js';
import { createServer } from 'vite';

let viteServer;

async function startDev() {
  await startServer(3001);
  const viteServer = await createServer({
    configFile: './vite.config.js',
  });
  await viteServer.listen();
  console.log(`Vite dev server running on port ${viteServer.config.server.port}`);
}

process.once('SIGUSR2', async () => {
  console.log('Dev script restart detected, closing Vite server...');
  if (viteServer) {
    try {
      await viteServer.close();
      console.log('Vite server closed successfully');
    } catch (err) {
      console.error('Error closing Vite server:', err);
    }
  }
  process.kill(process.pid, 'SIGUSR2');
});

startDev();