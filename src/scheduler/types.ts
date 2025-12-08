import type { NotificationEntity } from "../types.ts";

export type SchedulerOptions = {
  intervalMs?: number;
};

export type SchedulerState = {
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
};

export interface NotificationScheduler {
  /**
   * Запланировать уведомление.
   */
  schedule(notification: NotificationEntity): Promise<void>;

  /**
   * Убрать уведомление из плана.
   */
  cancel(notification: NotificationEntity): Promise<void>;

  /**
   * Запустить цикл планировщика уведомлений.
   */
  run(): void;

  /**
   * Остановить цикл планировщика цведомлений.
   */
  stop(): void;
}
