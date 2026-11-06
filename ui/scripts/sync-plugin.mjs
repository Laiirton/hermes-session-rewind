import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Copies the built plugin tree into the installed profile directory, so a
// Desktop reload runs the checkout's code and never a stale copy (the trap
// behind state findings 115 and 129). Run through `npm run sync`.

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'plugin');

function defaultInstallDir() {
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  const appData = process.env.LOCALAPPDATA ?? join(home, 'AppData', 'Local');
  switch (process.platform) {
    case 'win32':
      return join(appData, 'hermes', 'plugins', 'session-rewind');
    case 'darwin':
      return join(home, 'Library', 'Application Support', 'hermes', 'plugins', 'session-rewind');
    default:
      return join(home, '.local', 'share', 'hermes', 'plugins', 'session-rewind');
  }
}

const installDir = resolve(process.env.HERMES_PLUGIN_DIR ?? defaultInstallDir());

if (!existsSync(join(pluginRoot, 'plugin.yaml'))) {
  console.error(`sync: plugin tree not found at ${pluginRoot}`);
  process.exit(1);
}

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    if (entry === '__pycache__' || entry.endsWith('.pyc') || entry.endsWith('.pyo')) {
      continue;
    }
    const source = join(from, entry);
    const target = join(to, entry);
    if (statSync(source).isDirectory()) {
      copyTree(source, target);
    } else {
      cpSync(source, target);
    }
  }
}

copyTree(pluginRoot, installDir);

// Finding 115: the Desktop also keeps a JS cache under desktop-plugins that a
// palette reload does not re-sync. Refresh it when the cache directory exists.
const desktopCache = join(installDir, '..', '..', 'desktop-plugins', 'session-rewind');
const bundle = join(pluginRoot, 'desktop', 'plugin.js');
if (existsSync(dirname(desktopCache)) && existsSync(bundle)) {
  mkdirSync(desktopCache, { recursive: true });
  cpSync(bundle, join(desktopCache, 'plugin.js'));
}

const copied = readFileSync(join(installDir, 'desktop', 'plugin.js'));
const built = readFileSync(bundle);
const same = copied.length === built.length && copied.equals(built);

console.log(`sync: plugin tree -> ${installDir}`);
console.log(`sync: installed bundle ${same ? 'matches' : 'DOES NOT match'} the build`);

if (!same) {
  process.exit(1);
}
