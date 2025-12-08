import { Router } from "express";

import push from "./push.ts";

import type { NotificationEntity } from "./types.ts";
import type { NotificationScheduler } from "./scheduler/types.ts";

export const createNotificationRouter = (scheduler: NotificationScheduler) => {
  const notificationRouter = new Router();

  notificationRouter.post("/api/notifications", async (req, res) => {
    console.log(
      `Received a POST. \n\tEndpoint: ${req.url}, \n\tBody: ${JSON.stringify(
        req.body
      )}`
    );
    if (!req.body) return res.status(400).send("Body is required");

    const notification = req.body as NotificationEntity;
    await scheduler.schedule(notification);

    return res.status(201).send();
  });

  notificationRouter.get("/api/notifications", async (req, res) => {
    console.log(`Received a GET. \n\tEndpoint: ${req.url}`);

    res.status(500).send("Not implemented.");
  });

  notificationRouter.get(
    "/api/notifications/:notificationId",
    async (req, res) => {
      console.log(
        `Received a PATCH. \n\tEndpoint: ${
          req.url
        }, \n\tParams: ${JSON.stringify(req.params)}`
      );

      // const notificationId = req.params.notificationId;

      res.status(500).send("Not implemented.");
    }
  );

  notificationRouter.patch(
    "/api/notifications/:notificationId",
    async (req, res) => {
      console.log(
        `Received a PATCH. \n\tEndpoint: ${
          req.url
        }, \n\tParams: ${JSON.stringify(req.params)}`
      );

      // const notificationId = req.params.notificationId;

      res.status(500).send({ message: "Not implemented." });
    }
  );

  notificationRouter.delete(
    "/api/notifications/:notificationId",
    async (req, res) => {
      console.log(
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

  return notificationRouter;
};

export const mainRouter = Router();

mainRouter.get("/api/health", (req, res) => {
  res.status(200).send();
});

mainRouter.get("/api/key", (req, res) => {
  console.log(`Received a GET. \n\tEndpoint: ${req.url}`);

  const vapidPublicKey = push.getVapidPublicKey();
  res.send(vapidPublicKey);
});

// TODO: Разбить это на несколько файлов.
