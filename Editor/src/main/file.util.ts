import chokidar from 'chokidar';
import { ipcMain } from 'electron';
import { existsSync, lstatSync, readFileSync } from 'fs';

export type OnFileChange = (data: Buffer | undefined) => void;
const fileWatchers: Record<string, chokidar.FSWatcher> = {};
const data: Record<string, Buffer | undefined> = {};
const subscriptions: Record<string, number> = {};

function addSubscription(filePath: string) {
  if (!subscriptions[filePath]) {
    subscriptions[filePath] = 0;
  }

  subscriptions[filePath] += 1;
}

function removeSubscription(filePath: string) {
  if (!subscriptions[filePath]) {
    subscriptions[filePath] = 0;
  }

  setTimeout(() => {
    if (subscriptions[filePath] > 0) {
      subscriptions[filePath] -= 1;
    }

    if (subscriptions[filePath] === 0) {
      delete data[filePath];

      fileWatchers[filePath]?.close();
      delete fileWatchers[filePath];
    }
  }, 1000);
}

function updateFile(filePath: string) {
  setTimeout(() => {
    if (!existsSync(filePath) || !lstatSync(filePath).isFile()) {
      return;
    }

    const inputBuffer = existsSync(filePath) ? readFileSync(filePath) : undefined;

    data[filePath] = inputBuffer;

    ipcMain.emit('onFileChange', filePath, inputBuffer?.toString('utf8'));
  });
}

export function subscribeToFile(_: Electron.IpcMainEvent, filePath: string) {
  if (fileWatchers[filePath]) {
    addSubscription(filePath);
    updateFile(filePath);
    return;
  }

  addSubscription(filePath);
  updateFile(filePath);

  const watch = chokidar.watch(filePath, {
    ignored: '*.meta',
    persistent: true
  });

  watch.on('all', (_eventName, path) => updateFile(path));

  fileWatchers[filePath] = watch;
}

export function unsubscribeFromFile(_: Electron.IpcMainEvent, filePath: string) {
  removeSubscription(filePath);
}
