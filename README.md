# Планировщик Web Push уведомлений

[Простой клиент](https://github.com/mvladt/webpush-dumb-client)

Серверная часть для планирования и отправки Web Push уведомлений. Принимает подписки и задания от клиента, хранит их и отправляет уведомления в запланированное время через Web Push Protocol.

## Возможности

- Приём и хранение уведомлений
- Планирование уведомлений на указанное время
- Автоматическая отправка уведомлений через Web Push Protocol

## Архитектура

```mermaid
graph LR
    A[Браузерный клиент] --> B[API Server];
    B --> C[Хранилище<br/>Subscriptions];
    B --> D[Планировщик<br/>Scheduled Jobs];

    D -- По таймеру --> E[Web Push Sender];
    E --> F[Push Service<br/>Chrome/Firefox/etc];
    F --> G[Браузер<br/>Service Worker];
```
