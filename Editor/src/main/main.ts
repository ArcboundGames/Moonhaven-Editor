/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import sizeOf from 'image-size';
import { join } from 'path';

import scalePixelArt from 'scale-pixel-art';
import { subscribeToFile, unsubscribeFromFile } from './file.util';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import type { PathLike, PathOrFileDescriptor, WriteFileOptions } from 'fs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

/**
 * Custom IPC API
 */
ipcMain.on('getDataFolder', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    event.reply('getDataFolder', filePath);
    return;
  }

  event.reply('getDataFolder', undefined);
});

ipcMain.on('subscribeToFile', subscribeToFile);
ipcMain.on('unsubscribeFromFile', unsubscribeFromFile);

ipcMain.handle('existsSync', (_, file: PathLike) => {
  return existsSync(file);
});

ipcMain.handle(
  'readFileSync',
  (
    _,
    file: PathOrFileDescriptor,
    options:
      | {
          encoding: BufferEncoding;
          flag?: string | undefined;
        }
      | BufferEncoding
  ) => {
    console.log(file);
    return readFileSync(file, options);
  }
);

ipcMain.handle(
  'writeFileSync',
  (_, file: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions | undefined) => {
    return writeFileSync(file, data, options);
  }
);

ipcMain.handle('sizeOf', (_, fileName: string) => {
  return existsSync(fileName)
    ? sizeOf(fileName)
    : {
        width: undefined,
        height: undefined
      };
});

ipcMain.handle('scaleImage', async (_, fileName: string, scale: number) => {
  if (!existsSync(fileName)) {
    return undefined;
  }
  const buffer = await scalePixelArt(readFileSync(fileName), scale);
  return `data:image/png;base64,${buffer.toString('base64')}`;
});

ipcMain.handle('getImage', async (_, fileName: string) => {
  if (!existsSync(fileName)) {
    return undefined;
  }
  const buffer = readFileSync(fileName);
  return `data:image/png;base64,${buffer.toString('base64')}`;
});

ipcMain.handle('join', (_, ...paths: string[]) => {
  return join(...paths);
});

/**
 * Main Setup
 */

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
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
      preload: app.isPackaged ? join(__dirname, 'preload.js') : join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

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
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
