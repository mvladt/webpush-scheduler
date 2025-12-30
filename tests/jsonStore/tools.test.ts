import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";

import jsonStoreTools from "../../src/jsonStore/tools.ts";
import { createFakeNotification, dumbUUID } from "../tools.ts";

describe("jsonStoreTools", () => {
  describe("readStoreFile", () => {
    it("Возвращает значение, когда файл существует.", async () => {
      // Arrange
      const fileName = `testData-${dumbUUID()}.json`;
      const notification = createFakeNotification();
      await writeFile(fileName, JSON.stringify([notification]));

      // Act
      const notifications = await jsonStoreTools.readStoreFile(fileName);

      // Assert
      assert.equal(notifications.length, 1);
      assert.equal(notifications[0].id, notification.id);
      assert.equal(notifications[0].payload.text, notification.payload.text);

      // Clean
      await rm(fileName);
    });

    it("Возвращает значение, когда файла нет.", async () => {
      // Arrange
      const fileName = `testData-${dumbUUID()}.json`;

      // Act
      const notifications = await jsonStoreTools.readStoreFile(fileName);

      // Assert
      assert.equal(notifications.length, 0);

      // Clean
      // Не нужен, т.к. файла нет.
    });

    it("writeStoreFile", async () => {
      // Arrange
      const fileName = `testData-${dumbUUID()}.json`;
      const notification = createFakeNotification();

      // Act
      await jsonStoreTools.writeStoreFile(fileName, [notification]);

      // Assert
      const notifications = JSON.parse(String(await readFile(fileName)));
      assert.equal(notifications.length, 1);
      assert.equal(notifications[0].id, notification.id);
      assert.equal(notifications[0].payload.text, notification.payload.text);

      // Clean
      await rm(fileName);
    });
  });
});
