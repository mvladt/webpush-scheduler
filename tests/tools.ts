import type { NotificationEntity } from "../src/types.ts";

export const fakeNotification1: NotificationEntity = {
  id: "1",
  subscription: {},
  datetime: "2025-01-01T00:01",
  payload: { text: "Hello!" },
};

export const fakeNotification2: NotificationEntity = {
  id: "2",
  subscription: {},
  datetime: "2025-01-01T00:02",
  payload: { text: "World!" },
};

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

export const dumbUUID = (): string =>
  `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
