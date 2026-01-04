import { Router } from "express";
import type { Request, Response } from "express";

import type { NotificationEntity } from "../types.ts";
import type { Logger } from "../logger/types.ts";
import type { NotificationScheduler } from "../scheduler/types.ts";

export const createNotificationRouter = (
  scheduler: NotificationScheduler,
  logger: Logger
) => {
  const router = Router();

  router.post("/api/notifications", async (req: Request, res: Response) => {
    logger.log(
      `Received a POST. \n\tEndpoint: ${req.url}, \n\tBody: ${JSON.stringify(
        req.body
      )}`
    );
    if (!req.body) return res.status(400).send("Body is required");

    const notification = req.body as NotificationEntity;
    await scheduler.schedule(notification);

    return res.status(201).send();
  });

  router.get("/api/notifications", async (req: Request, res: Response) => {
    logger.log(`Received a GET. \n\tEndpoint: ${req.url}`);

    res.status(500).send("Not implemented.");
  });

  router.get(
    "/api/notifications/:notificationId",
    async (req: Request, res: Response) => {
      logger.log(
        `Received a PATCH. \n\tEndpoint: ${
          req.url
        }, \n\tParams: ${JSON.stringify(req.params)}`
      );

      // const notificationId = req.params.notificationId;

      res.status(500).send("Not implemented.");
    }
  );

  router.patch(
    "/api/notifications/:notificationId",
    async (req: Request, res: Response) => {
      logger.log(
        `Received a PATCH. \n\tEndpoint: ${
          req.url
        }, \n\tParams: ${JSON.stringify(req.params)}`
      );

      // const notificationId = req.params.notificationId;

      res.status(500).send({ message: "Not implemented." });
    }
  );

  router.delete(
    "/api/notifications/:notificationId",
    async (req: Request, res: Response) => {
      logger.log(
        `Received a DELETE. \n\tEndpoint: ${
          req.url
        }, \n\tParams: ${JSON.stringify(req.params)}`
      );

      // const notificationId = req.params.notificationId;
      // const notification = await store.findById(notificationId);

      // await scheduler.cancel(notification);

      // res.status(204).send();

      res.status(500).send({ message: "Not implemented" });
    }
  );

  return router;
};
