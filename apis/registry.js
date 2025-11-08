export const apiRegistry = [
  {
    slug: 'defi-index',
    name: 'DeFi Index',
    group: 'Индексы',
    summary: 'OHLC индекса децентрализованных финансов за предыдущий день с 2020 года.',
    tags: ['Публичный доступ', 'Дневные свечи'],
    modulePath: './apis/defi-index/module.js'
  },
  {
    slug: 'altcoin-index',
    name: 'Altcoin Index',
    group: 'Индексы',
    summary: 'Агрегированный индекс альткоинов для оценки сегмента вне топ-капитализации.',
    tags: ['Публичный доступ', 'Бенчмарк'],
    modulePath: './apis/altcoin-index/module.js'
  }
];
