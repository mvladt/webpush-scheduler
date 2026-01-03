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
    async start() {
      return new Promise<void>((resolve) => {
        server = app.listen(port, () => {
          console.log(`Server started on port ${port}.`);
          notificationScheduler.run();
          console.log(`App started.`);
          resolve();
        });
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
          console.log("\n");
          resolve();
        });
      });
    },

    getPort() {
      if (!server) {
        throw new Error("Server is not running.");
      }

      return (server.address() as any).port;
    },

    // TODO: Нарушение инкапсуляции.
    express: app,
  };
};
