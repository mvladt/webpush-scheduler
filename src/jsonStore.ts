import { readStoreFile, writeStoreFile } from "./jsonStoreTools.ts";
import type { NotificationEntity, NotificationStore } from "./types.ts";

const save = async (notification: NotificationEntity): Promise<void> => {
  const oldArray = await readStoreFile();

  const newArray = [...oldArray, notification];

  await writeStoreFile(newArray);
};

const remove = async (notification: NotificationEntity): Promise<void> => {
  const oldArray = await readStoreFile();

  const newArray = oldArray.filter((n) => n.id !== notification.id);

  await writeStoreFile(newArray);
};

const removeMany = async (
  notifications: NotificationEntity[]
): Promise<void> => {
  const oldArray = await readStoreFile();

  const newArray = oldArray.filter(
    (n1) => !notifications.find((n2) => n1.id === n2.id)
  );

  await writeStoreFile(newArray);
};

/**
 * Возвращает уведомления, запланированные на промежуток времени от "сейчас" до "сейчас" + 2 минуты.
 */
const getNotificationsForNow = async (): Promise<NotificationEntity[]> => {
  const oldArray = await readStoreFile();
  const result = oldArray.filter(isNotificationForNow);
  return result;
};

/**
 * Проверка, соответствует ли дата уведомления промежутку от "сейчас" до "сейчас" + 2 минуты.
 */
const isNotificationForNow = (notification: NotificationEntity): boolean => {
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
const getNotificationsByTaskId = async (
  taskId: string
): Promise<NotificationEntity[]> => {
  const oldArray = (await readStoreFile()) as NotificationEntity[];
  const result = oldArray.filter((n) => n.payload.id === taskId);
  return result;
};

// TODO: Написать тесты.
const getOneById = async (notificationId) => {
  const oldArray = (await readStoreFile()) as NotificationEntity[];
  const result = oldArray.find((n) => n.id === notificationId);
  return result;
};

const jsonStore: NotificationStore = {
  saveOne: save,
  removeOne: remove,
  removeMany,
  getOneById,
  getAllForNow: getNotificationsForNow,
};

export default jsonStore;
