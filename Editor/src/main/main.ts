/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint global-require: off, no-console: off */

import { app, BrowserWindow, dialog, ipcMain, session, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { existsSync, readFileSync } from 'fs';
import sizeOf from 'image-size';
import { join } from 'path';

import { setFileWatchWindow, subscribeToFile, unsubscribeFromFile } from './file.util';
import MenuBuilder from './menu';
import {
  assertWriteSize,
  atomicWriteFile,
  isTrustedSender,
  joinPaths,
  normalizeFsPath,
  resolveAllowedPath,
  resolveStreamingAssetsRoot,
  toPathString
} from './path-guard';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    if (!app.isPackaged) {
      return;
    }
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let workspaceRoot: string | undefined;

function assertSender(event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent) {
  if (!isTrustedSender(event, mainWindow?.webContents.id)) {
    throw new Error('Untrusted IPC sender');
  }
}

function trustedExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    return parsed.hostname === 'github.com' && parsed.pathname.startsWith('/ArcboundGames/');
  } catch {
    return false;
  }
}

function developmentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

ipcMain.on('getDataFolder', async (event) => {
  assertSender(event);
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    workspaceRoot = resolveStreamingAssetsRoot(filePath);
    event.reply('getDataFolder', normalizeFsPath(filePath));
    return;
  }

  event.reply('getDataFolder', undefined);
});

ipcMain.on('subscribeToFile', (event, filePath: unknown) => {
  assertSender(event);
  subscribeToFile(event, resolveAllowedPath(workspaceRoot, filePath, { allowMissing: true }));
});

ipcMain.on('unsubscribeFromFile', (event, filePath: unknown) => {
  assertSender(event);
  unsubscribeFromFile(event, resolveAllowedPath(workspaceRoot, filePath, { allowMissing: true }));
});

ipcMain.handle('existsSync', (event, file: unknown) => {
  assertSender(event);
  return existsSync(resolveAllowedPath(workspaceRoot, file, { allowMissing: true }));
});

ipcMain.handle('readFileSync', (event, file: unknown, options: BufferEncoding | { encoding: BufferEncoding }) => {
  assertSender(event);
  return readFileSync(resolveAllowedPath(workspaceRoot, file), options);
});

ipcMain.handle(
  'writeFileSync',
  (event, file: unknown, data: string | NodeJS.ArrayBufferView, _options?: unknown) => {
    assertSender(event);
    if (typeof data !== 'string' && !ArrayBuffer.isView(data)) {
      throw new Error('Invalid write payload');
    }
    assertWriteSize(data);
    atomicWriteFile(resolveAllowedPath(workspaceRoot, file, { allowMissing: true }), data);
  }
);

ipcMain.handle('sizeOf', (event, fileName: unknown) => {
  assertSender(event);
  const allowed = resolveAllowedPath(workspaceRoot, fileName, { allowMissing: true });
  return existsSync(allowed)
    ? sizeOf(allowed)
    : {
        width: undefined,
        height: undefined
      };
});

ipcMain.handle('getImage', (event, fileName: unknown) => {
  assertSender(event);
  const allowed = resolveAllowedPath(workspaceRoot, fileName, { allowMissing: true });
  if (!existsSync(allowed)) {
    return undefined;
  }
  const buffer = readFileSync(allowed);
  return `data:image/png;base64,${buffer.toString('base64')}`;
});

ipcMain.handle('join', (event, ...paths: unknown[]) => {
  assertSender(event);
  return joinPaths(...paths.map((segment) => toPathString(segment)));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  import('electron-debug').then(({ default: electronDebug }) => electronDebug());
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name: string) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged ? join(process.resourcesPath, 'assets') : join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1600,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? join(__dirname, 'preload.js') : join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: true,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  });
  setFileWatchWindow(mainWindow);

  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:* ws://localhost:*"
  ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [contentSecurityPolicy]
      }
    });
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!developmentUrl(url) && !url.startsWith('file:')) {
      event.preventDefault();
    }
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    setFileWatchWindow(null);
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    if (trustedExternalUrl(edata.url) || (isDebug && developmentUrl(edata.url))) {
      shell.openExternal(edata.url);
    }
    return { action: 'deny' };
  });

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
