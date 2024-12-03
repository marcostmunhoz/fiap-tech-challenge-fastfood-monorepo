import fs from "fs/promises";

const BASE_STORAGE_DIR = __dirname + "/playwright";

export const restoreStorage = async <T>(identifier: string): Promise<T> => {
  try {
    const json = await fs.readFile(
      `${BASE_STORAGE_DIR}/${identifier}.storage.json`,
      "utf-8"
    );

    return JSON.parse(json) as T;
  } catch {
    return {} as T;
  }
};

export const saveStorage = async <T>(
  identifier: string,
  storage: T
): Promise<void> => {
  await fs.writeFile(
    `${BASE_STORAGE_DIR}/${identifier}.storage.json`,
    JSON.stringify(storage)
  );
};
