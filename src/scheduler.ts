import { createJsonStore } from "./jsonStore.ts";
import push, { type WebPushModule } from "./push.ts";
import type { NotificationEntity, NotificationStore } from "./types.ts";

const INTERVAL = 1000 * 2; // 2 секунды

type SchedulerState = {
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
};

type SchedulerDependencies = {
  store: NotificationStore;
  push: WebPushModule;
};

const state: SchedulerState = {
  isRunning: false,
};

const deps: SchedulerDependencies = {
  store: createJsonStore(),
  push: push,
};

const scheduler = {
  /**
   * Запланировать уведомление.
   */
  async scheduleNotification(notification: NotificationEntity): Promise<void> {
    await deps.store.saveOne(notification);
    console.log("Notification is scheduled.");
  },
  /**
   * Убрать уведомление из плана.
   */
  async cancelNotification(notification: NotificationEntity): Promise<void> {
    await deps.store.removeOne(notification);
    console.log("Notification is canceled.");
  },
  /**
   * Запустить цикл планировщика уведомлений.
   */
  run() {
    if (state.isRunning) throw new Error("Scheduler is already running.");
    state.isRunning = true;
    state.timeoutId = setInterval(work, INTERVAL);
    console.log("Scheduler is running.");
  },

  /**
   * Остановить цикл планировщика цведомлений.
   */
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
