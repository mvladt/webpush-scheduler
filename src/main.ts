import express from "express";
import cors from "cors";

import { createNotificationRouter, mainRouter } from "./router.ts";
import push from "./push.ts";
import { createNotificationScheduler } from "./scheduler/scheduler.ts";
import { createJsonStore } from "./jsonStore.ts";

const notificationStore = createJsonStore("notifications.json");

// const notificationPusher = createWebPusher();
const notificationPusher = push;

const notificationScheduler = createNotificationScheduler(
  notificationStore,
  notificationPusher,
  { intervalMs: 2000 }
);

notificationScheduler.run();

// - - -

const notificationRouter = createNotificationRouter(notificationScheduler);

const app = express();
app.use(cors());
app.use(express.json());
app.use(mainRouter);
app.use(notificationRouter);

const port = process.env.PORT || "3001";

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
