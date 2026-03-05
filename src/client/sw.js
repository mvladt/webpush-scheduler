self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Уведомление";
  const options = {
    body: data.body || "",
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        const message = {
          type: "PUSH_RECEIVED",
          payload: {
            title,
            body: options.body,
            receivedAt: new Date().toISOString(),
          },
        };
        clients.forEach((client) => client.postMessage(message));
      });
    }),
  );
});
