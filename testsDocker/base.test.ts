import { describe, it } from "node:test";
import assert from "node:assert";

const PORT = process.env.PORT || "3000";
const BASE_URL = `http://localhost:${PORT}`;

describe("Как сервис работает в контейнере.", () => {
  it("Запрос 'получить VAPID ключ' — отрабатывает.", async () => {
    const response = await fetch(`${BASE_URL}/api/key`);
    assert.strictEqual(response.status, 200);

    const vapidKey = await response.text();
    assert.ok(vapidKey.length > 0);
    assert.match(vapidKey, /^[A-Za-z0-9_-]+$/);
  });

  it("Запрос 'запланировать уведомление' — отрабатывает.", async () => {
    const notification = {
      id: "test-" + Date.now(),
      datetime: new Date(Date.now() + 60000).toISOString().slice(0, 16),
      payload: { text: "Docker test notification" },
      subscription: {
        endpoint: "https://fcm.googleapis.com/fcm/send/test",
        expirationTime: null,
        keys: { p256dh: "test", auth: "test" },
      },
    };

    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });

    assert.strictEqual(response.status, 201);
  });

  it("CORS настроены норм.", async () => {
    const response = await fetch(`${BASE_URL}/api/key`, {
      method: "OPTIONS",
      headers: { Origin: "http://example.com" },
    });

    assert.ok(response.headers.has("access-control-allow-origin"));
  });
});
