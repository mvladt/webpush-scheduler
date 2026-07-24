import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { writeFile, rm, mkdtemp, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { loadEnv } from "../../src/env.ts";

const ENV_KEYS = ["PORT", "VAPID_SUBJECT", "VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY"];

const saveEnv = () => Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));

const restoreEnv = (saved: Record<string, string | undefined>) => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
};

describe("loadEnv", () => {
  it(".env существует — возвращает корректный конфиг", async () => {
    // Arrange
    const tmpDir = await mkdtemp(join(tmpdir(), "webpush-test-"));
    const envPath = join(tmpDir, ".env");
    await writeFile(
      envPath,
      "PORT=4242\nVAPID_PUBLIC_KEY=pubkey\nVAPID_PRIVATE_KEY=privkey\nVAPID_SUBJECT=mailto:hello@example.com\n",
    );
    const saved = saveEnv();

    // Act
    const config = await loadEnv(envPath);

    // Assert
    assert.equal(config.port, 4242);
    assert.equal(config.vapidPublicKey, "pubkey");
    assert.equal(config.vapidPrivateKey, "privkey");
    assert.equal(config.vapidSubject, "mailto:hello@example.com");

    // Clean
    restoreEnv(saved);
    await rm(tmpDir, { recursive: true });
  });

  it(".env не существует — создаёт файл и возвращает валидный конфиг", async () => {
    // Arrange
    const tmpDir = await mkdtemp(join(tmpdir(), "webpush-test-"));
    const envPath = join(tmpDir, ".env");
    const saved = saveEnv();

    // Act
    const config = await loadEnv(envPath);

    // Assert
    assert.ok(config.port > 0);
    assert.ok(config.vapidPublicKey);
    assert.ok(config.vapidPrivateKey);
    assert.ok(config.vapidSubject);
    await assert.doesNotReject(() => access(envPath));

    // Clean
    restoreEnv(saved);
    await rm(tmpDir, { recursive: true });
  });
});
