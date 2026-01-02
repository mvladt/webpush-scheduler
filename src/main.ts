import { createRouter } from "./router/router.ts";
import { createNotificationScheduler } from "./scheduler/scheduler.ts";
import { createJsonStore } from "./jsonStore/store.ts";
import { createWebPusher } from "./pusher/pusher.ts";
import { createApp } from "./app.ts";

// TODO: Добавить куда-то обработку случая, когда env-переменные не заданы.
const vapidSubject = process.env.VAPID_SUBJECT;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;

const port = Number(process.env.PORT) || 3001;

const store = createJsonStore("notifications.json");

const pusher = createWebPusher({
  vapidDetails: {
    subject: vapidSubject,
    privateKey: vapidPrivateKey,
    publicKey: vapidPublicKey,
  },
});

const scheduler = createNotificationScheduler(store, pusher, {
  intervalMs: 2000,
});

const router = createRouter(scheduler, pusher);

const app = createApp(port, router, scheduler);

await app.start();

process.on("SIGINT", () => app.stop().then(() => process.exit(0)));
process.on("SIGTERM", () => app.stop().then(() => process.exit(0)));
