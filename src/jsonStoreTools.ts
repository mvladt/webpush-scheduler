import { readFile, writeFile, access } from "node:fs/promises";
import type { NotificationEntity } from "./types.ts";

const DEFAULT_FILE_NAME = "data.json";

let file = DEFAULT_FILE_NAME;

export const setStoreFile = (newFile): void => {
  file = newFile;
};

export const resetStoreFile = (): void => {
  file = DEFAULT_FILE_NAME;
};

export const readStoreFile = async (): Promise<NotificationEntity[]> => {
  if (await isFileExists()) {
    const string = String(await readFile(file));
    const array = JSON.parse(string);
    return array;
  } else {
    return Promise.resolve([]);
  }
};

export const writeStoreFile = async (array): Promise<void> => {
  const string = JSON.stringify(array);
  await writeFile(file, string);
};

const isFileExists = async (): Promise<boolean> => {
  try {
    await access(file);
    return true;
  } catch (error) {
    return false;
  }
};
