import express from "express";
import cors from "cors";
import type { Router, Express } from "express";

import type { NotificationScheduler } from "./scheduler/types.ts";
import type { Server } from "http";

export const createApp = (
  port: number,
  router: Router,
  notificationScheduler: NotificationScheduler
) => {
  let server: Server;

  const app: Express = express();

  app.use(cors());
  app.use(express.json());

  app.use(router);

  return {
    start() {
      server = app.listen(port, () => {
        console.log(`Server listening on port ${port}.`);

        notificationScheduler.run();
      });
    },
    async stop() {
      if (!server) {
        throw new Error("Server is not running.");
      }

      return new Promise<void>((resolve) => {
        server.close(() => {
          notificationScheduler.stop();
          console.log("App stopped.");
          resolve();
        });
      });
    },

    // TODO: Нарушение инкапсуляции.
    express: app,
  };
};
