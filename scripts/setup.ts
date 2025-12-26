import { writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const ENV_FILE = ".env";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const generateVapidKeys = (): { publicKey: string; privateKey: string } => {
  const output = execSync("npx web-push generate-vapid-keys --json", {
    encoding: "utf-8",
  });
  return JSON.parse(output);
};

const validateVapidSubject = (subject: string): boolean => {
  return /^(mailto:.+@.+\..+|https?:\/\/.+)$/.test(subject);
};

const promptWithDefault = async (
  question: string,
  defaultValue: string
): Promise<string> => {
  const answer = await rl.question(`${question} (${defaultValue}): `);
  return answer.trim() || defaultValue;
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  console.log("🚀 Webpush Scheduler Setup\n");

  if (await fileExists(ENV_FILE)) {
    const overwrite = await rl.question(
      `.env already exists. Overwrite? (y/N): `
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("Generating VAPID keys...");
  const { publicKey, privateKey } = generateVapidKeys();
  console.log("✓ Keys generated\n");

  let vapidSubject = "";
  while (!validateVapidSubject(vapidSubject)) {
    vapidSubject = await rl.question(
      "VAPID Subject (mailto:your@email.com or https://yourdomain.com): "
    );
    if (!validateVapidSubject(vapidSubject)) {
      console.log("❌ Invalid format. Use mailto: or https://\n");
    }
  }

  const port = await promptWithDefault("Server port", "3001");

  const envContent = `PORT=${port}
VAPID_PUBLIC_KEY=${publicKey}
VAPID_PRIVATE_KEY=${privateKey}
VAPID_SUBJECT=${vapidSubject}
`;

  await writeFile(ENV_FILE, envContent);
  console.log("\n✓ .env file created successfully!");
  console.log("\nYou can now run: npm start");

  rl.close();
};

main().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
