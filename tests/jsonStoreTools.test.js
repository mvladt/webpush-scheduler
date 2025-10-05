import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile, rm, writeFile } from "node:fs/promises";
import {
  readStoreFile,
  writeStoreFile,
  setStoreFile,
  resetStoreFile,
} from "../src/jsonStoreTools.js";
import { fakeNotification1 } from "./tools.js";

describe("jsonStoreTools", () => {
  describe("readStoreFile", () => {
    it("Возвращает значение, когда файл существует.", async () => {
      // Arrange
      const storeFileName = "testData-101.json";
      setStoreFile(storeFileName);
      await writeFile(storeFileName, JSON.stringify([fakeNotification1]));

      // Act
      const notifications = await readStoreFile();

      // Assert
      assert.equal(notifications.length, 1);
      assert.equal(notifications[0].id, fakeNotification1.id);
      assert.equal(
        notifications[0].payload.text,
        fakeNotification1.payload.text
      );

      // Clean
      await rm(storeFileName);
      resetStoreFile();
    });

    it("Возвращает значение, когда файла нет.", async () => {
      // Arrange
      const storeFileName = "testData-102.json";
      setStoreFile(storeFileName);

      // Act
      const notifications = await readStoreFile();

      // Assert
      assert.equal(notifications.length, 0);

      // Clean
      resetStoreFile();
    });
  });

  it("writeStoreFile", async () => {
    // Arrange
    const storeFileName = "testData-103.json";
    setStoreFile(storeFileName);

    // Act
    await writeStoreFile([fakeNotification1]);

    // Assert
    const notifications = JSON.parse(await readFile(storeFileName));
    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].id, fakeNotification1.id);
    assert.equal(notifications[0].payload.text, fakeNotification1.payload.text);

    // Clean
    await rm(storeFileName);
    resetStoreFile();
  });
});
