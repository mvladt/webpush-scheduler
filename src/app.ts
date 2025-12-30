import express, { Router } from "express";
import cors from "cors";

import type { NotificationScheduler } from "./scheduler/types.ts";

export const createApp = (
  mainRouter: Router,
  notificationRouter: Router,
  notificationScheduler: NotificationScheduler
) => {
  const app = express();

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
