import { readStoreFile, writeStoreFile } from "./jsonStoreTools.js";

/**
 * @typedef {import("./types.js").Notification} Notification
 */

const save = async (notification) => {
  const oldArray = await readStoreFile();

  const newArray = [...oldArray, notification];

  await writeStoreFile(newArray);
};

/**
 * @param {Notification} notification
 * @returns {Promise<void>}
 */
const remove = async (notification) => {
  const oldArray = await readStoreFile();

  const newArray = oldArray.filter((n) => n.id !== notification.id);

  await writeStoreFile(newArray);
};

/**
 * @param {Notification[]} notifications
 * @returns {Promise<void>}
 */
const removeMany = async (notifications) => {
  const oldArray = await readStoreFile();

  const newArray = oldArray.filter(
    (n1) => !notifications.find((n2) => n1.id === n2.id)
  );

  await writeStoreFile(newArray);
};

/**
 * Возвращает уведомления, запланированные на промежуток времени от "сейчас" до "сейчас" + 2 минуты.
 * @returns {Promise<Notification[]>}
 */
const getNotificationsForNow = async () => {
  const oldArray = await readStoreFile();
  const result = oldArray.filter(isNotificationForNow);
  return result;
};

/**
 * Проверка, соответствует ли дата уведомления промежутку от "сейчас" до "сейчас" + 2 минуты.
 * @param {Notification} notification
 * @returns {Boolean}
 */
const isNotificationForNow = (notification) => {
  const notificationDate = new Date(notification.datetime);
  const currentDate = new Date();

  const isDatesMatch =
    notificationDate.toISOString().split("T")[0] ===
    currentDate.toISOString().split("T")[0];
  const isTimeMatch =
    notificationDate.getHours() === currentDate.getHours() &&
    notificationDate.getMinutes() - currentDate.getMinutes() <= 2;

  const result = isDatesMatch && isTimeMatch;
  return result;
};

// TODO: Либо удалить это (если не нужно), либо написать тесты.
const getNotificationsByTaskId = async (taskId) => {
  const oldArray = await readStoreFile();
  const result = oldArray.filter((n) => n.payload.id === taskId);
  return result;
};

const store = {
  save,
  remove,
  removeMany,
  getNotificationsForNow,
  getNotificationsByTaskId,
};

export default store;
