import webpush from "web-push";

const vapidSubject = process.env.VAPID_SUBJECT;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey)
  throw new Error("VAPID credentials is required.");

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

const sendOne = async (notification) => {
  try {
    const result = await webpush.sendNotification(
      notification.subscription,
      JSON.stringify(notification.payload)
    );
    console.log(`Notification send. Result status code: ${result.statusCode}.`);
  } catch (error) {
    console.log(
      `Error when sending. Notification id: ${notification.id}.`
    );
    console.error(error);
  }
};

const sendMany = async (notifications) => {
  const promises = notifications.map(async (notification) => {
    await sendOne(notification);
  });
  await Promise.all(promises);
};

const getVapidPublicKey = () => {
  return vapidPublicKey;
};

const push = {
  sendOne,
  sendMany,
  getVapidPublicKey,
};

export default push;
