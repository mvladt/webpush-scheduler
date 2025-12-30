import { access, readFile, writeFile } from "node:fs/promises";
import type { NotificationEntity } from "../types.ts";

const readStoreFile = async (file: string): Promise<NotificationEntity[]> => {
  if (await isFileExists(file)) {
    const string = String(await readFile(file));
    const array = JSON.parse(string);
    return array;
  } else {
    return Promise.resolve([]);
  }
};

const writeStoreFile = async (
  file: string,
  array: NotificationEntity[]
): Promise<void> => {
  const string = JSON.stringify(array);
  await writeFile(file, string);
};

const isFileExists = async (file: string): Promise<boolean> => {
  try {
    await access(file);
    return true;
  } catch (error) {
    return false;
  }
};

const jsonStoreTools = {
  readStoreFile,
  writeStoreFile,
  isFileExists,
};

export default jsonStoreTools;
