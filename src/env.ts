import { writeFile } from "node:fs/promises";

import webPush from "web-push";

export type EnvConfig = {
  port: number;
  vapidSubject: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;
};

export const loadEnv = async (): Promise<EnvConfig> => {
  try {
    process.loadEnvFile(".env");
  } catch {
    console.warn(
      "[env] .env not found — generating VAPID keys. " +
        "If push subscriptions exist, they will become invalid."
    );

    const { publicKey, privateKey } = webPush.generateVAPIDKeys();
    const content = `PORT=3001\nVAPID_PUBLIC_KEY=${publicKey}\nVAPID_PRIVATE_KEY=${privateKey}\nVAPID_SUBJECT=mailto:test@example.com\n`;

    await writeFile(".env", content);
    process.loadEnvFile(".env");
  }

  return {
    port: Number(process.env.PORT) || 3001,
    vapidSubject: process.env.VAPID_SUBJECT!,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY!,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY!,
  };
};
