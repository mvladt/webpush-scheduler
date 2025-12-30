import { writeFile } from "node:fs/promises";

import webPush from "web-push";

const generateVapidKeys = (): { publicKey: string; privateKey: string } => {
  return webPush.generateVAPIDKeys();
};

const main = async () => {
  console.log("\n🚀 Webpush Scheduler Setup");

  console.log("\nGenerating VAPID keys...");
  const { publicKey, privateKey } = generateVapidKeys();
  console.log("\n✓ Keys generated");

  const envContent = `PORT=3001
VAPID_PUBLIC_KEY=${publicKey}
VAPID_PRIVATE_KEY=${privateKey}
VAPID_SUBJECT=mailto:test@example.com
`;

  await writeFile(".env", envContent);
  console.log("✓ .env file created successfully!");
  console.log("\nYou can now run: npm start");
};

main().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
