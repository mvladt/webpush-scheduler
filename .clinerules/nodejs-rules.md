## Без классов

- НЕ добавляй `class` в этом репозитории (JS/TS).
- НЕ вводи OOP-обёртки вокруг логики (service/repository classes и т.п.).
- Предпочитай функции и композицию:
  - Pure functions где возможно.
  - Модули + именованные exports.
  - Фабрики: `createX(deps) => { ...methods }`.
  - Plain objects, замыкания.
- Если сторонняя библиотека/фреймворк требует классы, ОСТАНОВИСЬ и спроси подтверждение перед тем, как добавлять `class`.

## Импорты (ESM)

- Все импорты внутри проекта должны быть ТОЛЬКО относительные (`./` или `../`). Не используй алиасы (`@/`, `~`, path mapping) и не используй package-style импорты для внутренних модулей.
- Каждый import должен заканчиваться расширением файла.

## Stdlib: только _promises_ API

- При работе с файловой системой НЕ используй sync-API из `node:*` (например `readFileSync`, `writeFileSync`, `existsSync`).
- Для файловой системы используй только promise-варианты:
  - `node:fs/promises` (предпочтительно) или эквивалентные promise-методы.
  - Используй `readFile`, `writeFile`, `access` из `node:fs/promises`.
- Если нужен эквивалент `existsSync`, используй проверку через `access(...)` и обработку ошибки (а не sync-методы).

Пример:

```ts
// плохо
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// хорошо
import { readFile, writeFile, access } from "node:fs/promises";
```
