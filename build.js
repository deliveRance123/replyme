import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
if (fs.existsSync(path.join(__dirname, 'standalone.html'))) {
  fs.copyFileSync(path.join(__dirname, 'standalone.html'), path.join(distDir, 'standalone.html'));
}

const assetsDir = path.join(__dirname, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, path.join(distDir, 'assets'), { recursive: true });
}

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

console.log('Successfully generated dist directory for Vercel deployment!');
