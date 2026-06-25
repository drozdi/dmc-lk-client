# Чеклист выполнения — analytics-review-2025-06-23

> Дата выполнения: 25.06.2025  
> Источник: [analytics-review-2025-06-23.md](./analytics-review-2025-06-23.md)

## Высокий приоритет

| # | Задача | Статус | Изменения |
|---|--------|--------|-----------|
| B1 | Исправить `calckDefect` для «Некорректный код агрегата» | ✅ | `constants/defect-aliases.ts` → `classifyDefect`, отдельная категория |
| B2 | Исправить `back()` на главной | ✅ | `main-page.tsx` — `setHistory(prev => prev.slice(0, -1))` без мутации |
| B3 | Синхронизация `$filterdate` через Zustand selector | ✅ | `useStoreDashboardMain(state => state.values.$filterdate ?? …)` |
| B4 | Условие пагинации в `loadHistory` | ✅ | `res.data.response.length === params.size` |
| B6 | Alias дефектов в constants + тесты | ✅ | `defect-aliases.ts`, `defect-aliases.test.ts` |
| 8 | Double/triple fetch (этап 8 аудита) | ✅ | Уже было в ветке; widgets без дублирующих hooks |

## Средний приоритет

| # | Задача | Статус | Изменения |
|---|--------|--------|-----------|
| 6 | `useQueries` вместо `useFetchAnalyticsEvents` | ✅ | `use-fetch-analytics-events.ts` |
| 7 | `useLabelFormatName` + `LabelGapToggle` (D1) | ✅ | `hooks/use-label-format-name.ts`, `ui/label-gap-toggle.tsx`, labels/type |
| 8 | Пагинация / фильтр даты в истории (UX8, UX9) | ✅ | `lables-history.tsx`, `use-store-count-label.ts` — filterdate + «Загрузить ещё» |
| 9 | Breadcrumb drill-down (UX1) | ✅ | `drill-down-breadcrumb.ts`, breadcrumb в `main-page.tsx` |
| 10 | `keepMounted` для вкладок инцидентов (UX11) | ✅ | `pages/analytics/incident/index.tsx` |
| 11 | Skeleton labels, type, events-defect (H8) | ✅ | Уже было в feature-компонентах |

## Низкий приоритет

| # | Задача | Статус | Изменения |
|---|--------|--------|-----------|
| 12 | `useEnumsEvents` → константы без `use` | ✅ | `constants/enums-data.ts`, widgets/app используют `eventsDataSelect` / `stepDataSelect` |
| 13 | Дополнительные `manualChunks` в Vite | ✅ | `vite.config.ts` — mantine, xlsx, react-table |
| 14 | Удалить мёртвый `grouped()` (B5) | ✅ | `lables-page.tsx` |
| 15 | Унификация `lables` → `labels`, `entites` → `entities` | ⏭️ | Отложено (постепенный рефакторинг, вне scope) |
| 16 | Unit-тесты utils | ✅ | `analytics-query`, `incident-query`, `timestamp-step`, `defect-aliases` |

## UX (дополнительно из обзора)

| # | Задача | Статус | Изменения |
|---|--------|--------|-----------|
| UX2 | Два `analytic-labels` → один с переключателем | ✅ | `main-page.tsx` — один виджет с `allowChangeType` |
| UX3 | 6 карточек itog-set → сводка | ✅ | `itog-summary.tsx` + одна карточка «Сводка» |
| UX4 | `p` и `i` на stack/table главной | ⏭️ | Требует согласования с продуктом |
| UX5 | Обзор по всем линиям на `/labels` | ⏭️ | Требует отдельного дизайна |
| UX6 | Опечатка «хотитее удалить» | ✅ | `lables-group.tsx` |
| UX7 | Связь графика расхода с группой/историей | ⏭️ | Требует маршрутизации и API |
| UX10 | Упростить card + table layout истории | ⏭️ | Частично: добавлен filterdate и pagination |

## Производительность

| # | Задача | Статус | Изменения |
|---|--------|--------|-----------|
| — | Map-индекс в `AnalyticLabels` | ✅ | `buildLabelsDataIndex` вместо тройного цикла |
| D3 | Единый источник истории | ✅ | `use-query-history.ts` синхронизирован с условием пагинации |

## Не выполнено / отложено

- **UX4, UX5, UX7, UX10** — нужны продуктовые решения или отдельный scope.
- **П.15** — переименование `lables`/`entites` по всему проекту.
- **Один контекст запроса на главной** для 6× itog-set — заменён сводным виджетом (UX3), но не общим React context.
- **Lazy widgets (8.5)** — eager import в `app/widgets.tsx` сохранён (главная страница использует виджеты).

## Проверка

```bash
npm run check
npm run test:vite -- --run
```
