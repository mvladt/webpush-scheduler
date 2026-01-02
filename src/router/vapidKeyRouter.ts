import { Router } from "express";
import type { Request, Response } from "express";

import type { WebPusher } from "../pusher/types.ts";

export const createVapidKeyRouter = (pusher: WebPusher) => {
  const router = Router();

  router.get("/api/key", (req: Request, res: Response) => {
    console.log(`Received a GET. \n\tEndpoint: ${req.url}`);

    const vapidPublicKey = pusher.getVapidPublicKey();
    res.send(vapidPublicKey);
  });

  return router;
};
