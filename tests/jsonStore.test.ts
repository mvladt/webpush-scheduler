import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import store from "../src/jsonStore.ts";
import {
  setStoreFile,
  resetStoreFile,
  readStoreFile,
} from "../src/jsonStoreTools.ts";
import {
  createFakeNotification,
  fakeNotification1,
  fakeNotification2,
} from "./tools.ts";

describe("store", () => {
  it("store.saveOne", async () => {
    const storeFileName = "testData-201.json";
    setStoreFile(storeFileName);

    // Arrange
    // –

    // Act
    await store.saveOne(fakeNotification1);

    const storeData = await readStoreFile();
    await rm(storeFileName);
    resetStoreFile();

    // Assert
    assert.equal(storeData.length, 1);
    assert.equal(storeData[0].id, fakeNotification1.id);
  });

  it("store.removeOne", async () => {
    const storeFileName = "testData-202.json";
    setStoreFile(storeFileName);

    // Arrange
    await store.saveOne(fakeNotification1);

    // Act
    await store.removeOne(fakeNotification1);

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
    await store.saveOne(fakeNotification1);
    await store.saveOne(fakeNotification2);

    // Act
    await store.removeMany([fakeNotification1, fakeNotification2]);

    const storeData = await readStoreFile();
    await rm(storeFileName);
    resetStoreFile();

    // Assert
    assert.equal(storeData.length, 0);
  });

  describe("store.getAllForNow", () => {
    it('Выдает уведомление с датой "сейчас плюс 1 мин."', async () => {
      const storeFileName = "testData-204.json";
      setStoreFile(storeFileName);

      // Arrange
      const oneMinuteForward = new Date(Date.now() + 1000 * 60).toISOString();
      const fakeNotification = createFakeNotification();
      const fakeNotificationForNow = createFakeNotification(oneMinuteForward);
      await store.saveOne(fakeNotification);
      await store.saveOne(fakeNotificationForNow);

      // Act
      const notificationsForNow = await store.getAllForNow();

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
        await store.saveOne(fakeNotificationThatExpored);

        // Act
        const notificationsForNow = await store.getAllForNow();

        await rm(storeFileName);
        resetStoreFile();

        // Assert
        assert.equal(notificationsForNow.length, 0);
      }
    );
  });
});
