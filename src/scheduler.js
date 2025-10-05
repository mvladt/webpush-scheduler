import store from "./store.js";
import push from "./push.js";

/**
 * @typedef {import("./types.js").Notification} Notification
 */

const INTERVAL = 1000 * 2; // 2 секунды

let isRunning = false;
let timeoutId = null;

const scheduler = {
  /**
   * Запланировать уведомление.
   * @param {Notification} notification
   */
  async scheduleNotification(notification) {
    await store.save(notification);
    console.log("Notification is scheduled.");
  },
  /**
   * Убрать уведомление из плана.
   * @param {Notification} notification
   */
  async cancelNotification(notification) {
    await store.remove(notification);
    console.log("Notification is canceled.");
  },
  /**
   * Запустить цикл планировщика уведомлений.
   */
  run() {
    if (isRunning) throw new Error("Scheduler is already running.");
    isRunning = true;
    timeoutId = setInterval(work, INTERVAL);
    console.log("Scheduler is running.");
  },

  /**
   * Остановить цикл планировщика цведомлений.
   */
  stop() {
    if (!isRunning) throw new Error("Scheduler is not running.");
    clearInterval(timeoutId);
    isRunning = false;
    console.log("Scheduler is stopping.");
  },
};

/**
 * Единица работы, выполняемая за проход цикла пранировщика.
 * @return {Promise<void>}
 */
const work = async () => {
  const notifications = await store.getNotificationsForNow();

  // В этом месте может быть проблема, если операции не выполнятся до следующего запуска work(), через INTERVAL.
  await push.sendMany(notifications);
  await store.removeMany(notifications);

  console.log("Scheduler work. Time: ", new Date().toISOString());
};

export default scheduler;
