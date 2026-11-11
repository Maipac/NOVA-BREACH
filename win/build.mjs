// Bundles src/main.js (+ three.js) into app/game.js. Usage: node build.mjs [--dev]
import { build } from 'esbuild';
const dev = process.argv.includes('--dev');
await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  outfile: 'app/game.js',
  minify: !dev,
  sourcemap: dev ? 'inline' : false,
  logLevel: 'info',
});
