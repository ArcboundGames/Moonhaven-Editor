import { contextBridge, ipcRenderer } from 'electron';

import type { IpcRendererEvent } from 'electron';

export type Channels = 'getDataFolder' | 'onFileChange';

contextBridge.exposeInMainWorld('api', {
  exists: (path: string) => ipcRenderer.invoke('existsSync', path),
  readFile: (
    path: string,
    options:
      | {
          encoding: BufferEncoding;
          flag?: string;
        }
      | BufferEncoding
  ) => ipcRenderer.invoke('readFileSync', path, options),
  writeFile: (path: string, data: string | NodeJS.ArrayBufferView) => ipcRenderer.invoke('writeFileSync', path, data),
  sizeOf: (fileName: string) => ipcRenderer.invoke('sizeOf', fileName),
  getImage: (fileName: string) => ipcRenderer.invoke('getImage', fileName),
  join: (...paths: string[]) => ipcRenderer.invoke('join', ...paths)
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    getDataFolder() {
      ipcRenderer.send('getDataFolder');
    },
    subscribeToFile(fileName: string) {
      ipcRenderer.send('subscribeToFile', fileName);
    },
    unsubscribeFromFile(fileName: string) {
      ipcRenderer.send('unsubscribeFromFile', fileName);
    },
    sendMessage(channel: Channels, args: unknown[]) {
      if (channel !== 'getDataFolder' && channel !== 'onFileChange') {
        return;
      }
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      if (channel !== 'getDataFolder' && channel !== 'onFileChange') {
        return undefined;
      }
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      if (channel !== 'getDataFolder' && channel !== 'onFileChange') {
        return;
      }
      ipcRenderer.once(channel, (_event, ...args: unknown[]) => {
        func(...args);
      });
    }
  }
});
