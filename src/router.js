import { Router } from "express";

import push from "./push.js";
import scheduler from "./scheduler.js";
import store from "./store.js";

/**
 * @typedef {import("./types.js").Notification} Notification
 */

const router = Router();

router.get("/api/ping", (req, res) => {
  res.send("Ok");
});

router.get("/api/key", (req, res) => {
  const vapidPublicKey = push.getVapidPublicKey();
  res.send(vapidPublicKey);
});

router.post("/api/notifications", async (req, res) => {
  console.log(
    `Received a POST. \n\tEndpoint: ${req.url}, \n\tBody: ${JSON.stringify(
      req.body
    )}`
  );

  /** @type {Notification} */
  const notification = req.body;

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

  const notificationId = req.params.notificationId;

  res.status(500).send("Not implemented.");
});

router.patch("/api/notifications/:notificationId", async (req, res) => {
  console.log(
    `Received a PATCH. \n\tEndpoint: ${req.url}, \n\tParams: ${JSON.stringify(
      req.params
    )}`
  );

  const notificationId = req.params.notificationId;

  res.status(500).send("Not implemented.");
});

router.delete("/api/notifications/:notificationId", async (req, res) => {
  console.log(
    `Received a DELETE. \n\tEndpoint: ${req.url}, \n\tParams: ${JSON.stringify(
      req.params
    )}`
  );

  const notificationId = req.params.notificationId;
  const notification = await store.findById(notificationId);

  await scheduler.cancelNotification(notification);

  res.status(204).send();
});

export default router;
