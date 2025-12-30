import express from "express";
import cors from "cors";
import type { Router, Express } from "express";

import type { NotificationScheduler } from "./scheduler/types.ts";

export const createApp = (
  mainRouter: Router,
  notificationRouter: Router,
  notificationScheduler: NotificationScheduler
) => {
  const app: Express = express();

  app.use(cors());
  app.use(express.json());
  app.use(mainRouter);
  app.use(notificationRouter);

  const port = process.env.PORT || "3001";

  return {
    run() {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);

        notificationScheduler.run();
      });
    },
  };
};
