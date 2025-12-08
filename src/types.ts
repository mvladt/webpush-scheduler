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
