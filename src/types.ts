export type NotificationEntity = {
  id: string;
  payload: any; // Что отправлять.
  datetime: string; // Когда отправлять, в формате ISO 'yyyy-MM-ddThh:mm'.
  subscription: PushSubscriptionJSON; // Кому отправлять.
};

export interface Store {}
