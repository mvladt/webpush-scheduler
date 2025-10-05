import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import store from "../src/store.js";
import {
  setStoreFile,
  resetStoreFile,
  readStoreFile,
} from "../src/jsonStoreTools.js";
import {
  createFakeNotification,
  fakeNotification1,
  fakeNotification2,
} from "./tools.js";

describe("store", () => {
  it("store.save", async () => {
    const storeFileName = "testData-201.json";
    setStoreFile(storeFileName);

    // Arrange
    // –

    // Act
    await store.save(fakeNotification1);

    const storeData = await readStoreFile();
    await rm(storeFileName);
    resetStoreFile();

    // Assert
    assert.equal(storeData.length, 1);
    assert.equal(storeData[0].id, fakeNotification1.id);
  });

  it("store.remove", async () => {
    const storeFileName = "testData-202.json";
    setStoreFile(storeFileName);

    // Arrange
    await store.save(fakeNotification1);

    // Act
    await store.remove(fakeNotification1);

    const storeData = await readStoreFile();
    await rm(storeFileName);
    resetStoreFile();

    // Assert
    assert.equal(storeData.length, 0);
  });

  it("store.removeMany", async () => {
    const storeFileName = "testData-203.json";
    setStoreFile(storeFileName);

    // Arrange
    await store.save(fakeNotification1);
    await store.save(fakeNotification2);

    // Act
    await store.removeMany([fakeNotification1, fakeNotification2]);

    const storeData = await readStoreFile();
    await rm(storeFileName);
    resetStoreFile();

    // Assert
    assert.equal(storeData.length, 0);
  });

  describe("store.getNotificationsForNow", () => {
    it('Выдает уведомление с датой "сейчас плюс 1 мин."', async () => {
      const storeFileName = "testData-204.json";
      setStoreFile(storeFileName);

      // Arrange
      const oneMinuteForward = new Date(Date.now() + 1000 * 60).toISOString();
      const fakeNotification = createFakeNotification();
      const fakeNotificationForNow = createFakeNotification(oneMinuteForward);
      await store.save(fakeNotification);
      await store.save(fakeNotificationForNow);

      // Act
      const notificationsForNow = await store.getNotificationsForNow();

      await rm(storeFileName);
      resetStoreFile();

      // Assert
      assert.equal(notificationsForNow.length, 1);
      assert.equal(notificationsForNow[0].id, fakeNotificationForNow.id);
      assert.equal(
        notificationsForNow[0].payload.datetime,
        fakeNotificationForNow.payload.datetime
      );
    });

    it(
      'Не выдает уведомление с датой "сейчас минус 1 мин."',
      { skip: true },
      async () => {
        const storeFileName = "testData-205.json";
        setStoreFile(storeFileName);

        // Arrange
        const oneMinuteBackward = new Date(
          Date.now() - 1000 * 60
        ).toISOString();
        const fakeNotificationThatExpored =
          createFakeNotification(oneMinuteBackward);
        await store.save(fakeNotificationThatExpored);

        // Act
        const notificationsForNow = await store.getNotificationsForNow();

        await rm(storeFileName);
        resetStoreFile();

        // Assert
        assert.equal(notificationsForNow.length, 0);
      }
    );
  });
});
