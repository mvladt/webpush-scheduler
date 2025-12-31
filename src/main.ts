import { createNotificationRouter, mainRouter } from "./router.ts";
import push from "./push.ts";
import { createNotificationScheduler } from "./scheduler/scheduler.ts";
import { createJsonStore } from "./jsonStore/store.ts";
import { createApp } from "./app.ts";

const store = createJsonStore("notifications.json");

// const notificationPusher = createWebPusher();
const pusher = push;

const scheduler = createNotificationScheduler(store, pusher, {
  intervalMs: 2000,
});

// - - -

const notificationRouter = createNotificationRouter(scheduler);

// TODO: Слишком много роутеров в зависимостях.
const app = createApp(mainRouter, notificationRouter, scheduler);

app.run();
