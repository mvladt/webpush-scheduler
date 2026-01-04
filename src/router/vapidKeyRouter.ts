import { Router } from "express";
import type { Request, Response } from "express";

import type { WebPusher } from "../pusher/types.ts";
import type { Logger } from "../logger/types.ts";

export const createVapidKeyRouter = (pusher: WebPusher, logger: Logger) => {
  const router = Router();

  router.get("/api/key", (req: Request, res: Response) => {
    logger.log(`Received a GET. \n\tEndpoint: ${req.url}`);

    const vapidPublicKey = pusher.getVapidPublicKey();
    res.send(vapidPublicKey);
  });

  return router;
};
