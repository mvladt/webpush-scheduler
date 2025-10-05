/**
 * @typedef {import("../src/types.js").Notification} Notification
 */

/** @type {Notification} */
export const fakeNotification1 = {
  id: "1",
  subscription: {},
  payload: { text: "Hello!", datetime: "2025-01-01T00:01" },
};

/** @type {Notification} */
export const fakeNotification2 = {
  id: "2",
  subscription: {},
  payload: { text: "World!", datetime: "2025-01-01T00:02" },
};

/**
 *
 * @returns {Notification}
 */
export const createFakeNotification = (datetime = "2025-01-01T00:00") => {
  return {
    id: dumbUUID(),
    datetime,
    payload: {},
    subscription: {},
  };
};

export const dumbUUID = () =>
  `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
