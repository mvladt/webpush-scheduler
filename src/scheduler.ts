import { createJsonStore } from "./jsonStore.ts";
import push from "./push.ts";
import type {
  NotificationEntity,
  NotificationScheduler,
  SchedulerDependencies,
  SchedulerState,
} from "./types.ts";

const INTERVAL = 1000 * 2; // 2 секунды

const state: SchedulerState = {
  isRunning: false,
};

const deps: SchedulerDependencies = {
  store: createJsonStore(),
  push: push,
};

const scheduler: NotificationScheduler = {
  async scheduleNotification(notification: NotificationEntity): Promise<void> {
    await deps.store.saveOne(notification);
    console.log("Notification is scheduled.");
  },

  async cancelNotification(notification: NotificationEntity): Promise<void> {
    await deps.store.removeOne(notification);
    console.log("Notification is canceled.");
  },

  run() {
    if (state.isRunning) throw new Error("Scheduler is already running.");
    state.isRunning = true;
    state.timeoutId = setInterval(work, INTERVAL);
    console.log("Scheduler is running.");
  },

  stop() {
    if (!state.isRunning) throw new Error("Scheduler is not running.");
    clearInterval(state.timeoutId);
    state.isRunning = false;
    console.log("Scheduler is stopping.");
  },
};

/**
 * Единица работы, выполняемая за проход цикла пранировщика.
 */
const work = async (): Promise<void> => {
  const notifications = await deps.store.getAllForNow();

  // В этом месте может быть проблема, если операции не выполнятся до следующего запуска work(), через INTERVAL.
  await deps.push.sendMany(notifications);
  await deps.store.removeMany(notifications);

  console.log("Scheduler work. Time: ", new Date().toISOString());
};

export default scheduler;
