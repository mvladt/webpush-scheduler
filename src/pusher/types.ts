import type { NotificationEntity } from "../types.ts";

export interface WebPusher {
  sendOne(notitification: NotificationEntity): Promise<void>;
  sendMany(notificationList: NotificationEntity[]): Promise<void>;
  getVapidPublicKey(): string;
}

export type VapidDetails = {
  subject: string;
  publicKey: string;
  privateKey: string;
};

export type VapidOptions = {
  vapidDetails: VapidDetails;
};
