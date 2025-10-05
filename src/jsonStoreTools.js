import { readFile, writeFile, access } from "fs/promises";

const DEFAULT_FILE_NAME = "data.json";

let file = DEFAULT_FILE_NAME;

export const setStoreFile = (newFile) => {
  file = newFile;
};

export const resetStoreFile = () => {
  file = DEFAULT_FILE_NAME;
};

/**
 * @returns {Promise<any[]> | any[]}
 */
export const readStoreFile = async () => {
  if (await isFileExists()) {
    const string = await readFile(file);
    const array = JSON.parse(string);
    return array;
  } else {
    return [];
  }
};

export const writeStoreFile = async (array) => {
  const string = JSON.stringify(array);
  await writeFile(file, string);
};

const isFileExists = async () => {
  try {
    await access(file);
    return true;
  } catch (error) {
    return false;
  }
};
