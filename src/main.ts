import { createNotificationRouter, mainRouter } from "./router.ts";
import push from "./push.ts";
import { createNotificationScheduler } from "./scheduler/scheduler.ts";
import { createJsonStore } from "./jsonStore/store.ts";
import { createApp } from "./app.ts";

const notificationStore = createJsonStore("notifications.json");

// const notificationPusher = createWebPusher();
const notificationPusher = push;

const notificationScheduler = createNotificationScheduler(
  notificationStore,
  notificationPusher,
  { intervalMs: 2000 }
);

// - - -

const notificationRouter = createNotificationRouter(notificationScheduler);

// TODO: Слишком много роутеров в зависимостях.
const app = createApp(mainRouter, notificationRouter, notificationScheduler);

app.run();
