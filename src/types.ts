export type NotificationEntity = {
  id: string;
  payload: any; // Что отправлять.
  datetime: string; // Когда отправлять, в формате ISO 'yyyy-MM-ddThh:mm'.
  subscription: PushSubscriptionJSON; // Кому отправлять.
};

export interface NotificationStore {
  saveOne(notification: NotificationEntity): Promise<void>;
  removeOne(notification: NotificationEntity): Promise<void>;
  removeMany(notifications: NotificationEntity[]): Promise<void>;
  getOneById(notificationId: string): Promise<NotificationEntity>;
  getAllForNow(): Promise<NotificationEntity[]>;
}

export interface WebPushModule {
  sendOne(notitification: NotificationEntity): Promise<void>;
  sendMany(notificationList: NotificationEntity[]): Promise<void>;
  getVapidPublicKey(): string;
}

export type SchedulerState = {
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
};

export type SchedulerDependencies = {
  store: NotificationStore;
  push: WebPushModule;
};

export interface NotificationScheduler {
  /**
   * Запланировать уведомление.
   */
  scheduleNotification(notification: NotificationEntity): Promise<void>;

  /**
   * Убрать уведомление из плана.
   */
  cancelNotification(notification: NotificationEntity): Promise<void>;

  /**
   * Запустить цикл планировщика уведомлений.
   */
  run(): void;

  /**
   * Остановить цикл планировщика цведомлений.
   */
  stop(): void;
}
