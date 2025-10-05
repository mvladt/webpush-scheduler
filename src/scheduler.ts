import store from "./store.ts";
import push from "./push.ts";
import type { NotificationEntity } from "./types.ts";

const INTERVAL = 1000 * 2; // 2 секунды

type SchedulerState = {
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
};

const state: SchedulerState = {
  isRunning: false,
};

const scheduler = {
  /**
   * Запланировать уведомление.
   */
  async scheduleNotification(notification: NotificationEntity): Promise<void> {
    await store.save(notification);
    console.log("Notification is scheduled.");
  },
  /**
   * Убрать уведомление из плана.
   */
  async cancelNotification(notification: NotificationEntity): Promise<void> {
    await store.remove(notification);
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
  const notifications = await store.getNotificationsForNow();

  // В этом месте может быть проблема, если операции не выполнятся до следующего запуска work(), через INTERVAL.
  await push.sendMany(notifications);
  await store.removeMany(notifications);

  console.log("Scheduler work. Time: ", new Date().toISOString());
};

export default scheduler;
