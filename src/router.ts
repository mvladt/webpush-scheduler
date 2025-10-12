import { Router } from "express";

import push from "./push.ts";
import scheduler from "./scheduler.ts";
import type { NotificationEntity } from "./types.ts";

const router = Router();

router.get("/api/health", (req, res) => {
  res.status(200).send();
});

router.get("/api/key", (req, res) => {
  console.log(`Received a GET. \n\tEndpoint: ${req.url}`);

  const vapidPublicKey = push.getVapidPublicKey();
  res.send(vapidPublicKey);
});

router.post("/api/notifications", async (req, res) => {
  console.log(
    `Received a POST. \n\tEndpoint: ${req.url}, \n\tBody: ${JSON.stringify(
      req.body
    )}`
  );

  const notification = req.body as NotificationEntity;

  await scheduler.scheduleNotification(notification);

  res.status(201).send();
});

router.get("/api/notifications", async (req, res) => {
  console.log(`Received a GET. \n\tEndpoint: ${req.url}`);

  res.status(500).send("Not implemented.");
});

router.get("/api/notifications/:notificationId", async (req, res) => {
  console.log(
    `Received a PATCH. \n\tEndpoint: ${req.url}, \n\tParams: ${JSON.stringify(
      req.params
    )}`
  );

  // const notificationId = req.params.notificationId;

  res.status(500).send("Not implemented.");
});

router.patch("/api/notifications/:notificationId", async (req, res) => {
  console.log(
    `Received a PATCH. \n\tEndpoint: ${req.url}, \n\tParams: ${JSON.stringify(
      req.params
    )}`
  );

  // const notificationId = req.params.notificationId;

  res.status(500).send({ message: "Not implemented." });
});

router.delete("/api/notifications/:notificationId", async (req, res) => {
  console.log(
    `Received a DELETE. \n\tEndpoint: ${req.url}, \n\tParams: ${JSON.stringify(
      req.params
    )}`
  );

  // const notificationId = req.params.notificationId;
  // const notification = await store.findById(notificationId);

  // await scheduler.cancelNotification(notification);

  // res.status(204).send();

  res.status(500).send({ message: "Not implemented" });
});

export default router;
