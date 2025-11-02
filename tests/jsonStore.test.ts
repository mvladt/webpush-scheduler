import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";

import { createFakeNotification, dumbUUID } from "./tools.ts";
import { createJsonStore } from "../src/jsonStore.ts";

describe("jsonStore", () => {
  it("saveOne", async () => {
    // Arrange
    const testFile = `testData-${dumbUUID()}.json`;
    const store = createJsonStore(testFile);
    const notification = createFakeNotification();

    // Act
    await store.saveOne(notification);

    // Assert
    const stored = await store.getOneById(notification.id);
    assert.ok(stored);

    // Clean
    await rm(testFile);
  });

  it("removeOne", async () => {
    // Arrange
    const testFile = `testData-${dumbUUID()}.json`;
    const store = createJsonStore(testFile);
    const notification = createFakeNotification();
    await store.saveOne(notification);

    // Act
    await store.removeOne(notification);

    // Assert
    const nothing = await store.getOneById(notification.id);
    assert.equal(nothing, undefined);

    // Clean
    await rm(testFile);
  });

  it("removeMany", async () => {
    // Arrange
    const testFile = `testData-${dumbUUID()}.json`;
    const store = createJsonStore(testFile);
    const notification1 = createFakeNotification();
    const notification2 = createFakeNotification();
    await store.saveOne(notification1);
    await store.saveOne(notification2);

    // Act
    await store.removeMany([notification1, notification2]);

    // Assert
    const nothing1 = await store.getOneById(notification1.id);
    const nothing2 = await store.getOneById(notification2.id);
    assert.equal(nothing1, undefined);
    assert.equal(nothing2, undefined);

    // Clean
    await rm(testFile);
  });

  describe("getAllForNow", () => {
    it('Выдает уведомление с датой "сейчас плюс 1 мин."', async () => {
      // Arrange
      const testFile = `testData-${dumbUUID()}.json`;
      const store = createJsonStore(testFile);
      const oneMinuteForward = new Date(Date.now() + 1000 * 60).toISOString();
      const notification = createFakeNotification();
      const notificationForNow = createFakeNotification(oneMinuteForward);
      await store.saveOne(notification);
      await store.saveOne(notificationForNow);

      // Act
      const notificationsForNow = await store.getAllForNow();

      // Assert
      assert.equal(notificationsForNow.length, 1);
      assert.equal(notificationsForNow[0].id, notificationForNow.id);

      // Clean
      await rm(testFile);
    });

    it('Не выдает уведомление с датой "сейчас минус 1 мин."', async () => {
      // Arrange
      const testFile = `testData-${dumbUUID()}.json`;
      const store = createJsonStore(testFile);
      const oneMinuteBackward = new Date(Date.now() - 1000 * 60).toISOString();
      const expiredNotification = createFakeNotification(oneMinuteBackward);
      await store.saveOne(expiredNotification);

      // Act
      const notificationsForNow = await store.getAllForNow();

      // Assert
      assert.equal(notificationsForNow.length, 0);

      // Clean
      await rm(testFile);
    });
  });
});
