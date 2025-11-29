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

export const dumbUUID = (): string =>
  `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
