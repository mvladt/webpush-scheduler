import { access, rm } from "node:fs/promises";
import webpush from "web-push";

import { createApp } from "../src/app.ts";
import { createRouter } from "../src/router/router.ts";
import { createNotificationScheduler } from "../src/scheduler/scheduler.ts";
import { createJsonStore } from "../src/jsonStore/store.ts";
import { createWebPusher } from "../src/pusher/pusher.ts";

import type { NotificationEntity } from "../src/types.ts";

export const createFakeNotification = (
  datetime: string = "2025-01-01T00:00"
): NotificationEntity => {
  return {
    id: dumbUUID(),
    datetime,
    payload: {},
    subscription: {},
  };
};

export const createTestNotification = (
  datetime?: string
): NotificationEntity => {
  return {
    id: dumbUUID(),
    payload: { title: "Test Notification", body: "Hello from test!" },
    datetime: datetime || new Date(Date.now() + 60000).toISOString(), // +1 min
    subscription: {
      endpoint: "https://fcm.googleapis.com/fcm/send/test",
      keys: {
        p256dh: "test-p256dh-key",
        auth: "test-auth-key",
      },
    },
  };
};

export const dumbUUID = (): string =>
  `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;

export const cleanupTestFile = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
    await rm(filePath);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error; // Кидаем только если не "file not found"
    }
  }
};

export const createTestApp = () => {
  const testFile = `test-notifications-${dumbUUID()}.json`;
  const vapidKeys = webpush.generateVAPIDKeys();

  const store = createJsonStore(testFile);
  const pusher = createWebPusher({
    vapidDetails: {
      subject: "mailto:test@example.com",
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    },
  });
  const scheduler = createNotificationScheduler(store, pusher, {
    intervalMs: 2000,
  });
  const router = createRouter(scheduler, pusher);
  const app = createApp(0, router, scheduler);

  return { app, testFile, vapidKeys };
};
