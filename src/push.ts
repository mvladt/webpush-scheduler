import webpush from "web-push";

import type { NotificationEntity, WebPushModule } from "./types.ts";

const vapidSubject = process.env.VAPID_SUBJECT;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

const validateVapidSubject = (subject: string): boolean => {
  return /^(mailto:.+@.+\..+|https?:\/\/.+)$/.test(subject);
};

if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
  throw new Error(
    "Missing required VAPID credentials in environment variables."
  );
}

if (!validateVapidSubject(vapidSubject)) {
  throw new Error(
    `Invalid VAPID_SUBJECT format: "${vapidSubject}". Use mailto:email@domain.com or https://domain.com`
  );
}

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

const sendOne = async (notification: NotificationEntity): Promise<void> => {
  try {
    const result = await webpush.sendNotification(
      notification.subscription,
      JSON.stringify(notification.payload)
    );
    console.log(`Notification sent. Status: ${result.statusCode}`);
  } catch (error) {
    console.log(`Error sending notification id: ${notification.id}`);
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
