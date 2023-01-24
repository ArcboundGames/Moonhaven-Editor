import { contextBridge, ipcRenderer } from 'electron';

import type { IpcRendererEvent } from 'electron';
import type { PathLike, PathOrFileDescriptor, WriteFileOptions } from 'fs';

export type Channels = 'getDataFolder' | 'onFileChange';

contextBridge.exposeInMainWorld('api', {
  exists: (path: PathLike) => {
    return ipcRenderer.invoke('existsSync', path);
  },
  readFile: (
    path: PathOrFileDescriptor,
    options:
      | {
          encoding: BufferEncoding;
          flag?: string | undefined;
        }
      | BufferEncoding
  ) => {
    return ipcRenderer.invoke('readFileSync', path, options);
  },
  writeFile: (
    path: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions | undefined
  ) => {
    return ipcRenderer.invoke('writeFileSync', path, data, options);
  },
  sizeOf: (fileName: string) => {
    return ipcRenderer.invoke('sizeOf', fileName);
  },
  getImage: (fileName: string) => {
    return ipcRenderer.invoke('getImage', fileName);
  },
  join: (...paths: string[]) => {
    return ipcRenderer.invoke('join', ...paths);
  }
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    getDataFolder() {
      ipcRenderer.send('getDataFolder', '');
    },
    subscribeToFile(fileName: string) {
      ipcRenderer.send('subscribeToFile', fileName);
    },
    unsubscribeFromFile(fileName: string) {
      ipcRenderer.send('unsubscribeFromFile', fileName);
    },
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  }
});
