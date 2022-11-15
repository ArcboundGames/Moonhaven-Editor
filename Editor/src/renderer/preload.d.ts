import type { PathLike, PathOrFileDescriptor, WriteFileOptions } from 'fs';
import type { ISizeCalculationResult } from 'image-size/dist/types/interface';
import type { Channels } from 'main/preload';

export { };

declare global {
  type IpcResultsCallback<K extends keyof IpcResults> = (...args: IpcResults[K]) => void;

  interface IpcResults {
    getDataFolder: [string | undefined];
    onFileChange: [string, string | undefined];
  }

  interface Window {
    api: {
      exists: (path: PathLike) => Promise<boolean>;
      readFile: (
        path: PathOrFileDescriptor,
        options:
          | {
              encoding: BufferEncoding;
              flag?: string | undefined;
            }
          | BufferEncoding
      ) => Promise<string>;
      writeFile: (
        file: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions | undefined
      ) => Promise<void>;
      sizeOf: (path: string) => Promise<ISizeCalculationResult>;
      scaleImage: (path: string, scale: number) => Promise<string | undefined>;
      getImage: (path: string) => Promise<string | undefined>;
      join: (...paths: string[]) => Promise<string>;
    };
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: Channels, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        getDataFolder: () => void;
        subscribeToFile: (fileName: string) => void;
        unsubscribeFromFile: (fileName: string) => void;
      };
    };
  }
}
