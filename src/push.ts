import webpush from "web-push";

import type { NotificationEntity } from "./types.ts";

export interface WebPushModule {
  sendOne(notitification: NotificationEntity): Promise<void>;
  sendMany(notificationList: NotificationEntity[]): Promise<void>;
  getVapidPublicKey(): string;
}

const vapidSubject = process.env.VAPID_SUBJECT;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey)
  throw new Error("VAPID credentials is required.");

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

const sendOne = async (notification: NotificationEntity): Promise<void> => {
  try {
    const result = await webpush.sendNotification(
      notification.subscription,
      JSON.stringify(notification.payload)
    );
    console.log(`Notification send. Result status code: ${result.statusCode}.`);
  } catch (error) {
    console.log(`Error when sending. Notification id: ${notification.id}.`);
    console.error(error);
  }
};

const sendMany = async (notifications: NotificationEntity[]): Promise<void> => {
  const promises = notifications.map(async (notification) => {
    await sendOne(notification);
  });
  await Promise.all(promises);
};

const getVapidPublicKey = () => {
  return vapidPublicKey;
};

const push: WebPushModule = {
  sendOne,
  sendMany,
  getVapidPublicKey,
};

export default push;
