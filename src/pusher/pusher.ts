import webpush from "web-push";

import type { NotificationEntity } from "../types.ts";
import type { VapidOptions, WebPusher } from "./types.ts";

export const createWebPusher = (vapidOptions: VapidOptions): WebPusher => {
  const sendOne = async (notification: NotificationEntity): Promise<void> => {
    try {
      const result = await webpush.sendNotification(
        notification.subscription,
        JSON.stringify(notification.payload),
        vapidOptions
      );
      console.log(`Notification sent. Status: ${result.statusCode}`);
    } catch (error) {
      console.log(`Error sending notification id: ${notification.id}`);
      console.error(error);
    }
  };

  const sendMany = async (
    notifications: NotificationEntity[]
  ): Promise<void> => {
    const promises = notifications.map(async (notification) => {
      await sendOne(notification);
    });
    await Promise.all(promises);
  };

  const getVapidPublicKey = () => {
    return vapidOptions.vapidDetails.publicKey;
  };

  return {
    getVapidPublicKey,
    sendOne,
    sendMany,
  };
};
