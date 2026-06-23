# Аудит модуля аналитики — 22.06.2025

> **Статус:** улучшения этапов 7–11 реализованы (кроме count-widget.tsx и labels/count.tsx — legacy, не трогаем).  
> **Дополнение:** [Обзор и предложения от 23.06.2025](./analytics-review-2025-06-23.md) — баги дефектов, главная страница, история этикеток, UX.


## Архитектура (FSD)

| Слой | Назначение | Ключевые пути |
|------|------------|---------------|
| **entities** | API, React Query, utils, stores | `src/entites/analytics/` |
| **features** | Графики, таблицы, инциденты, elastic | `src/features/analytics/` |
| **widgets** | Оболочка `Widget` + регистрация на дашборде | `src/widgets/analytics/`, `count-widget.tsx`, `labels/` |
| **pages** | Маршруты | `src/pages/analytics/` |

**Маршруты** (`src/app/app-routers.tsx`): страницы аналитики lazy-loaded через `Suspense` — OK.

**Регистрация виджетов — два канала:**
- Eager: `src/app/widgets.tsx:3` → `import "@/widgets/analytics"`
- Lazy (только dashboard): `src/widgets/analytics/load.ts` + `src/pages/dashboard-page/index.tsx`

**Запахи архитектуры:**
- Widget и feature оба вызывают data-hooks для одного запроса (labels, type, itog-set, events-defect).
- «Хуки» на уровне модуля при импорте: `widgets/analytics/index.ts`, `features/.../events.tsx:33`, `app/widgets.tsx:8-9` — сейчас безопасно (статические enum-обёртки), но хрупко.
- Опечатка `entites` — проектная конвенция.

---

## Уже исправлено (текущая ветка, не закоммичено)

| Область | Что сделано | Файлы |
|---------|-------------|-------|
| React Query | Авто-fetch, нормализация параметров, `staleTime`/`gcTime` | `use-query-analytics.ts`, `analytics-query.ts` |
| Multi-event fetch | `isAnalyticsBaseQueryReady` — без обязательного `event` | `use-fetch-analytics-events.ts`, `analytics-query.ts` |
| Кэш-ключи | Стабильный `getAnalyticsQueryKey` | `analytics-query.ts` |
| useAnalytics | Убран лишний `res.fetch(query)` в `useEffect` | `use-analytics.ts` |
| UX events/pie | Skeleton + корректный empty state | `features/.../events.tsx`, `pie.tsx` |
| Widget events/pie | Убран дублирующий `useQueryAnalytics` | `widgets/analytics/events.tsx`, `pie.tsx` |
| AnalyticEvents bug | Исправлен deadlock `loading={true}` + fetch guard | см. выше |
| Incident dates | `dayjs().subtract(N, "day")` вместо `.day(-N)` | `pages/analytics/incident/index.tsx` |
| Incident generate | Правка колонок таблицы | `features/analytics/incident/generate.tsx` |
| Incident URL | `initialDataFilters`, `defaultTab` из searchParams | `pages/analytics/incident/index.tsx` |

---

## План изменений

### Этап 7 — Critical (1–2 дня)

| # | Задача | Файлы | Действие |
|---|--------|-------|----------|
| 7.1 | **Count-виджеты отключены** | `widgets/count-widget.tsx:24`, `widgets/labels/count.tsx:17` | Удалить `return ""`; проверить рендер и данные |
| 7.2 | **Smoke-тест виджетов** | dashboard | Проверить count, analytics-count, events, pie после правок |

**Критерий готовности:** виджеты «Расход этикеток» и «analytics-count» отображают данные на дашборде.

---

### Этап 8 — High: производительность и корректность данных (3–5 дней)

| # | Задача | Файлы | Действие |
|---|--------|-------|----------|
| 8.1 | **Тройной fetch в labels** | `widgets/analytics/labels.tsx:37-53`, `features/.../labels.tsx:29-34,120-125` | Один владелец данных (feature); убрать `useQueryAnalytics` + `fetch()` из widget; убрать ручной `fetch()` в feature |
| 8.2 | **Double fetch: type** | `widgets/analytics/type.tsx`, `features/.../type.tsx:98` | Hook только в feature; widget — props + `onLoading` |
| 8.3 | **Double fetch: itog-set** | `widgets/analytics/itog-set.tsx`, `features/.../itog-set.tsx` | То же |
| 8.4 | **Double fetch: events-defect** | `widgets/analytics/events-defect.tsx`, `features/.../events-defect.tsx` | То же |
| 8.5 | **Lazy widgets не работает** | `app/widgets.tsx:3`, `widgets/analytics/load.ts` | Убрать eager `import "@/widgets/analytics"`; регистрация только через `loadAnalyticsWidgets()` на dashboard |
| 8.6 | **Incident: оба таба fetch сразу** | `pages/analytics/incident/index.tsx:96-109` | Рендерить только активный `Tabs.Panel` или `keepMounted={false}` |
| 8.7 | **Incident: бесполезный qi на странице** | `pages/analytics/incident/index.tsx:55-57` | Убрать `useQueryIncident()` без params; loading — из активной вкладки |
| 8.8 | **AnalyticItogSet: min/avg** | `features/.../itog-set.tsx:38-57` | min: init `Infinity`/`min_company`; avg: `average_company`; убрать мёртвую ветку |
| 8.9 | **Labels isEmpty deps** | `features/.../labels.tsx:104` | Зависимость `[ddata]` вместо `[bars]` |

**Критерий готовности:** один сетевой запрос на виджет при смене фильтра; itog-set показывает корректные min/avg.

---

### Этап 9 — High: UX и инциденты (2–3 дня)

| # | Задача | Файлы | Действие |
|---|--------|-------|----------|
| 9.1 | **Skeleton: labels, type, events-defect** | `features/analytics/widgets/labels.tsx`, `type.tsx`, `events-defect.tsx` | Паттерн events/pie: `showSkeleton = isLoading && !hasData` |
| 9.2 | **Incident widget loading** | `widgets/analytics/incident.tsx:39` | `onLoading` из `AnalyticIncident` → `Widget loading` |
| 9.3 | **Incident URL sync** | `pages/analytics/incident/index.tsx:43-47` | Реагировать на изменение `searchParams` (не только mount) |
| 9.4 | **Incident generate: immutability** | `features/analytics/incident/generate.tsx:61-90` | Не мутировать `template`; всегда новые массивы в `updateTemplate` |
| 9.5 | **React keys в generate** | `generate.tsx:179` | Добавить `key` в `DataColumn` map |

**Критерий готовности:** при загрузке — skeleton, не empty; кнопки периода на incident показывают loading; deep-link работает при навигации.

---

### Этап 10 — Medium (3–5 дней)

| # | Задача | Файлы | Действие |
|---|--------|-------|----------|
| 10.1 | **corectQuery мутирует filterdate** | `entites/analytics/utils/query.ts:38-48` | Копировать массив перед мутацией |
| 10.2 | **Агрегация events по step** | `features/.../events.tsx:77-90`, `use-filterdate-step.tsx` | Исправить `ss` → секунды; поддержать `w`/`mon`/`y` |
| 10.3 | **Цвета событий** | `entites/analytics/constants.ts:17-61` | Унифицировать `mapEvents` / удалить мёртвый `mapEventColor` |
| 10.4 | **Дублирующие labels виджетов** | `widgets/analytics/index.ts:222-280` | Разные названия для `analytic-labels` и `analytic-event-defect` |
| 10.5 | **detail-item useEffect [props]** | `features/analytics/incident/detail-item.tsx:32-51` | Зависимости: `filterdate`, `data`, … |
| 10.6 | **Тип integer в props.d.ts** | `entites/analytics/props.d.ts:8` | Заменить на `number` |
| 10.7 | **Dead store** | `stores/use-store-incident.ts` | Удалить или подключить |

---

### Этап 11 — Low / tech debt

| # | Задача | Файлы |
|---|--------|-------|
| 11.1 | Dead stubs | `widgets/labels/ui/incident-pie.tsx`, `incident-table.tsx` |
| 11.2 | Test widget в prod | `app/widgets.tsx:37-66` |
| 11.3 | `alert()` при пустом export | widgets download handlers, `generate.tsx:111` → toast |
| 11.4 | Typos | `corectQuery`, `memu`, `fliter.tsx`, `EventLineProops` |
| 11.5 | Закомментированный код | `constants.ts`, `query.ts`, `count-widget.tsx` |
| 11.6 | Тесты hooks/utils | `analytics-query.ts`, `incident-query.ts`, `use-query-*` |

---

## Детальный список проблем по приоритету

### Critical

#### C1. Count-виджеты возвращают пустую строку
- **Файлы:** `src/widgets/count-widget.tsx:24`, `src/widgets/labels/count.tsx:17`
- **Симптом:** виджеты `"count"` и `"analytics-count"` на дашборде пустые
- **Fix:** удалить early `return ""`

---

### High

#### H1. Triple/double API fetch (labels)
- **Файлы:** `widgets/analytics/labels.tsx`, `features/analytics/widgets/labels.tsx`
- **Причина:** `useQueryAnalytics` + `useAnalytics` + ручной `fetch()` после перехода на auto-enabled React Query
- **Fix:** один hook-owner в feature

#### H2. Double fetch (type, itog-set, events-defect)
- **Файлы:** соответствующие `widgets/analytics/*` + `features/analytics/widgets/*`
- **Fix:** паттерн events/pie — hook в feature, widget без дублирования

#### H3. Lazy loading виджетов undermined
- **Файл:** `src/app/widgets.tsx:3`
- **Fix:** регистрация analytics только через `loadAnalyticsWidgets()`

#### H4. Incident: оба таба монтируются
- **Файл:** `pages/analytics/incident/index.tsx`
- **Симптом:** двойной fetch detail + generate
- **Fix:** условный рендер активной вкладки

#### H5. Incident: qi без filterdate
- **Файл:** `pages/analytics/incident/index.tsx:55-57`
- **Симптом:** `isLoading` на кнопках периода всегда false для incident
- **Fix:** loading из child-компонента

#### H6. AnalyticItogSet min/avg
- **Файл:** `features/analytics/widgets/itog-set.tsx:38-57`
- **Баги:** min init = `max_company`; avg = `all_records`
- **Fix:** корректные поля API

#### H7. Labels isEmpty stale deps
- **Файл:** `features/analytics/widgets/labels.tsx:104`
- **Fix:** `[ddata]` в deps

#### H8. Нет skeleton (labels, type, events-defect)
- **Fix:** ChartSkeleton по образцу events/pie

#### H9. Incident widget loading={false}
- **Файл:** `widgets/analytics/incident.tsx:39`
- **Fix:** wire `onLoading`

---

### Medium

#### M1. corectQuery in-place mutation filterdate
- **Файл:** `entites/analytics/utils/query.ts`

#### M2. Step aggregation bugs (ss, w, mon, y)
- **Файлы:** `events.tsx`, `use-filterdate-step.tsx`, `labels.tsx:67-73`

#### M3. Incident generate state mutation
- **Файл:** `generate.tsx:61-90`

#### M4. Inconsistent event colors (dead exports)
- **Файл:** `constants.ts`

#### M5. Duplicate widget labels in registry
- **Файл:** `widgets/analytics/index.ts`

#### M6. detail-item useEffect [props]
- **Файл:** `detail-item.tsx`

#### M7. Invalid TS type `integer`
- **Файл:** `props.d.ts`

#### M8. Incident URL sync incomplete
- **Файл:** `pages/analytics/incident/index.tsx:43-47`

---

### Low

- Dead stubs: `incident-pie.tsx`, `incident-table.tsx`
- Test widget в production registry
- `alert()` вместо toast
- Typos, commented code
- Нет unit-тестов для analytics utils/hooks

---

## Модуль: журнал инцидентов

| Компонент | Путь | Статус |
|-----------|------|--------|
| Страница | `pages/analytics/incident/index.tsx` | Даты OK; tab mount + qi — open |
| Кратко | `features/analytics/incident/detail.tsx` | OK: skeleton, empty, accordion |
| Детально | `features/analytics/incident/generate.tsx` | OK: export; mutation issues |
| Drill-down | `detail-item.tsx` | OK; лишний fetch на expand |
| Виджет | `widgets/analytics/incident.tsx` | Export OK; loading не подключён |
| API/hook | `api/incident.ts`, `use-query-incident.ts` | Эталонный React Query паттерн |
| Deep-link | `utils/incident-navigation.ts` | OK |

---

## Модуль: этикетки / группировка

| Область | Путь | Статус |
|---------|------|--------|
| Labels chart | `features/analytics/widgets/labels.tsx` | Gap grouping OK; no skeleton; wrong isEmpty deps |
| Type chart | `features/analytics/widgets/type.tsx` | Double fetch |
| Count widget | `widgets/count-widget.tsx` | **Отключён** |
| Labels count | `widgets/labels/count.tsx` | **Отключён** |
| Current balance | `widgets/labels/current-balance.tsx` | OK |
| Grouping entities | `entites/labels` | Логика есть, недоступна из-за return "" |

---

## Performance checklist

| Проблема | Приоритет | Статус |
|----------|-----------|--------|
| React Query cache keys + staleTime | — | ✅ Fixed |
| isAnalyticsBaseQueryReady для multi-event | — | ✅ Fixed |
| Убрать manual fetch() после auto-enabled | High | ❌ Open |
| Widget/feature duplicate hooks | High | ⚠️ Partial (events/pie) |
| Lazy analytics widgets | High | ❌ Open |
| Incident both tabs fetch | High | ❌ Open |
| Skeleton events/pie | — | ✅ Fixed |
| Skeleton labels/type/defect | High | ❌ Open |
| Recharts bundle | Medium | Страницы lazy; виджеты eager |

---

## Незакоммиченные изменения (на момент аудита)

```
M src/entites/analytics/hooks/use-analytics.ts
M src/entites/analytics/hooks/use-fetch-analytics-events.ts
M src/entites/analytics/hooks/use-query-analytics.ts
M src/entites/analytics/utils/analytics-query.ts
M src/features/analytics/incident/generate.tsx
M src/features/analytics/widgets/events.tsx
M src/features/analytics/widgets/pie.tsx
M src/pages/analytics/incident/index.tsx
M src/widgets/analytics/events.tsx
M src/widgets/analytics/pie.tsx
```

**Рекомендация:** закоммитить этап 6 (п.1–3) отдельным коммитом перед этапом 7.

---

## Следующий шаг

~~Начать **Этап 7** — восстановить count-виджеты~~  
Count-виджеты (`count-widget.tsx`, `labels/count.tsx`) — legacy, оставлены без изменений.

Опционально: unit-тесты для `analytics-query.ts`, `incident-query.ts`, `formatTimestampByStep`.
