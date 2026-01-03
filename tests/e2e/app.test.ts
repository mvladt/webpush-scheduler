import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createTestApp, cleanupTestFile } from "../tools.ts";

describe("Приложенька, App", () => {
  describe("Запрос GET VAPID ключ", () => {
    it("Отрабатывает норм", async () => {
      // Arrange
      const { app, testFile, vapidKeys } = createTestApp();

      // Act
      await app.start();

      const port = app.getPort();
      const response = await fetch(`http://localhost:${port}/api/key`, {
        signal: AbortSignal.timeout(5000),
      });
      const vapidKey = await response.text();

      // Assert
      assert.equal(response.status, 200);
      assert.equal(vapidKey, vapidKeys.publicKey);

      // Clean
      await app.stop();
      await cleanupTestFile(testFile);
    });
  });
});
