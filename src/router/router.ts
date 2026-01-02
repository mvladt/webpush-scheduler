import { Router } from "express";
import type { Request, Response } from "express";

import type { NotificationScheduler } from "../scheduler/types.ts";
import { createNotificationRouter } from "./notificationRouter.ts";
import { createVapidKeyRouter } from "./vapidKeyRouter.ts";
import type { WebPusher } from "../pusher/types.ts";

export const createRouter = (
  scheduler: NotificationScheduler,
  pusher: WebPusher
) => {
  const router = Router();

  const notificationRouter = createNotificationRouter(scheduler);
  const vapidKeyRouter = createVapidKeyRouter(pusher);

  router.use(notificationRouter);
  router.use(vapidKeyRouter);

  router.get("/api/health", (req: Request, res: Response) => {
    res.status(200).send();
  });

  return router;
};
