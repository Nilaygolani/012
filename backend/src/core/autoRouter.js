import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function mountDynamicModules(app) {
  const modulesDir = path.resolve(__dirname, '../modules');

  if (!fs.existsSync(modulesDir)) {
    console.warn('[AutoRouter] Modules directory not found at:', modulesDir);
    return;
  }

  const moduleFolders = fs.readdirSync(modulesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`[AutoRouter] Discovered ${moduleFolders.length} backend modules:`, moduleFolders);

  for (const folder of moduleFolders) {
    const routeFilePath = path.join(modulesDir, folder, 'routes.js');
    if (fs.existsSync(routeFilePath)) {
      try {
        const fileUrl = new URL(`file://${path.resolve(routeFilePath).replace(/\\/g, '/')}`).href;
        const moduleExports = await import(fileUrl);
        const router = moduleExports.default || moduleExports.router;

        if (router) {
          const mountPath = `/api/${folder}`;
          app.use(mountPath, router);
          console.log(`[AutoRouter] Mounted module "/api/${folder}" successfully.`);
        }
      } catch (err) {
        console.error(`[AutoRouter] Failed to mount module "${folder}":`, err.message);
      }
    }
  }
}

