import chokidar from 'chokidar';
import { existsSync, lstatSync, readFileSync } from 'fs';

import { normalizeFsPath } from './path-guard';

import type { BrowserWindow } from 'electron';
import type { FSWatcher } from 'chokidar';

const fileWatchers: Record<string, FSWatcher> = {};
const subscriptions: Record<string, number> = {};
let targetWindow: BrowserWindow | null = null;

export function setFileWatchWindow(window: BrowserWindow | null) {
  targetWindow = window;
}

function addSubscription(filePath: string) {
  subscriptions[filePath] = (subscriptions[filePath] ?? 0) + 1;
}

function removeSubscription(filePath: string) {
  setTimeout(() => {
    if ((subscriptions[filePath] ?? 0) > 0) {
      subscriptions[filePath] -= 1;
    }
    if ((subscriptions[filePath] ?? 0) === 0) {
      fileWatchers[filePath]?.close();
      delete fileWatchers[filePath];
      delete subscriptions[filePath];
    }
  }, 1000);
}

function updateFile(filePath: string) {
  setTimeout(() => {
    const normalized = normalizeFsPath(filePath);
    if (!existsSync(filePath) || !lstatSync(filePath).isFile()) {
      return;
    }
    const contents = readFileSync(filePath, 'utf8');
    targetWindow?.webContents.send('onFileChange', normalized, contents);
  });
}

export function subscribeToFile(_: Electron.IpcMainEvent, filePath: string) {
  const normalized = normalizeFsPath(filePath);
  if (fileWatchers[normalized]) {
    addSubscription(normalized);
    updateFile(filePath);
    return;
  }

  addSubscription(normalized);
  updateFile(filePath);

  const watch = chokidar.watch(filePath, {
    ignored: /\.meta$/i,
    persistent: true
  });

  watch.on('all', (_eventName, changedPath) => updateFile(changedPath));
  fileWatchers[normalized] = watch;
}

export function unsubscribeFromFile(_: Electron.IpcMainEvent, filePath: string) {
  removeSubscription(normalizeFsPath(filePath));
}
