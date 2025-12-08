import type {
  NotificationEntity,
  NotificationStore,
  WebPushModule,
} from "../types.ts";

import type {
  NotificationScheduler,
  SchedulerOptions,
  SchedulerState,
} from "./types.ts";

// TODO: Вынести логгер в зависимость.
// TODO: Добавить какую-то валидацию. В частности на 'schedule' и 'cancel'.
export const createNotificationScheduler = (
  store: NotificationStore,
  pusher: WebPushModule,
  options: SchedulerOptions = { intervalMs: 1000 }
): NotificationScheduler => {
  const { intervalMs } = options;

  const state: SchedulerState = {
    isRunning: false,
  };

  /**
   * Единица работы, выполняемая за проход цикла планировщика.
   */
  const work = async (): Promise<void> => {
    const notifications = await store.getAllForNow();

    // В этом месте может быть проблема, если операции не выполнятся до следующего запуска work(), через intervalMs.
    await pusher.sendMany(notifications);
    await store.removeMany(notifications);

    console.log("Scheduler work. Time: ", new Date().toISOString());
  };

  const scheduler: NotificationScheduler = {
    async schedule(notification: NotificationEntity): Promise<void> {
      await store.saveOne(notification);
      console.log("Notification is scheduled.");
    },

    async cancel(notification: NotificationEntity): Promise<void> {
      await store.removeOne(notification);
      console.log("Notification is canceled.");
    },

    run() {
      if (state.isRunning) throw new Error("Scheduler is already running.");
      state.isRunning = true;
      state.timeoutId = setInterval(work, intervalMs);
      console.log(`Scheduler is running with interval ${intervalMs}ms.`);
    },

    stop() {
      if (!state.isRunning) throw new Error("Scheduler is not running.");
      clearInterval(state.timeoutId);
      state.isRunning = false;
      console.log("Scheduler is stopping.");
    },
  };

  return scheduler;
};
