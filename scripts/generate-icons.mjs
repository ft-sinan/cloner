import sharp from 'sharp';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const RES = path.resolve('android/app/src/main/res');
const RED = '#E63946';
const CREAM = '#FAF5ED';

// Vector "FT" mark — no font dependency, so it renders identically everywhere.
const letters = `
  <g fill="#FFFFFF">
    <rect x="285" y="285" width="185" height="48" rx="8"/>
    <rect x="285" y="285" width="48" height="455" rx="8"/>
    <rect x="285" y="483" width="150" height="48" rx="8"/>
    <rect x="545" y="285" width="205" height="48" rx="8"/>
    <rect x="623" y="285" width="48" height="455" rx="8"/>
  </g>`;

const launcherSvg = (round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  ${round ? `<circle cx="512" cy="512" r="512" fill="${RED}"/>` : `<rect width="1024" height="1024" rx="224" fill="${RED}"/>`}
  ${letters}
</svg>`;

const foregroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${letters}</svg>`;

const splashSvg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${CREAM}"/>
  <g transform="translate(${w / 2 - 162} ${h / 2 - 162}) scale(0.3164)">
    <rect width="1024" height="1024" rx="224" fill="${RED}"/>
    ${letters}
  </g>
</svg>`;

const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

for (const [density, size] of Object.entries(sizes)) {
  const dir = path.join(RES, `mipmap-${density}`);
  await sharp(Buffer.from(launcherSvg(false))).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
  await sharp(Buffer.from(launcherSvg(true))).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
  await sharp(Buffer.from(foregroundSvg)).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
}

for (const entry of await readdir(RES)) {
  if (!entry.startsWith('drawable') || !(await import('node:fs/promises')).stat(path.join(RES, entry)).then((s) => s.isDirectory()).catch(() => false)) continue;
  const splashPath = path.join(RES, entry, 'splash.png');
  let meta;
  try { meta = await sharp(await readFile(splashPath)).metadata(); } catch { continue; }
  await sharp(Buffer.from(splashSvg(meta.width, meta.height))).png().toFile(splashPath);
}

console.log('Generated FT Cloner launcher icons and splash screens.');
