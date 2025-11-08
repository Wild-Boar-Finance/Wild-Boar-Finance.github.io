export const apiDoc = {
  slug: 'altcoin-index',
  name: 'Altcoin Index',
  group: 'Индексы',
  summary: 'Альткойн индекс отслеживает динамику наиболее активно торгуемых крипто активов за исключением Bitcoin, стейблкойнов и производных токенов. Источник первичных данных Binance.',
  version: 'v1',
  status: 'Stable',
  releaseDate: '2021-02-12',
  baseUrl: 'https://wildboar.space:8001',
  authentication: 'Не требуется для публичного доступа.',
  serviceLevel: 'Обновление данных до 00:10 UTC следующего дня.',
  rateLimit: '60 запросов в минуту на IP.',
  tags: ['JSON', 'Benchmark', 'Public'],
  metrics: [
    { label: 'Доступность', value: '99.8% uptime за последние 90 дней' },
    { label: 'Глубина истории', value: 'С сентября 2019 года' },
    { label: 'База активов', value: '50 активов в текущей корзине' }
  ],
  compliance: [
    'Запрещено выдавать данные Altcoin Index за продукт Wild Boar или вводить пользователей в заблуждение относительно правообладателя.',
    'При использовании индекса размещайте ссылку на первоисточник и указывайте Wild Boar как поставщика данных.',
    'Коммерческое использование возможно только после письменного согласования условий и указания авторства.',
    'Политика распространяется на все конечные и промежуточные данные API.'
  ],
  endpoints: [
    {
      name: 'История индекса Altcoin',
      method: 'GET',
      path: '/api/altcoin_index',
      description: 'Возвращает дневные значения индекса Altcoin для оценки динамики второй линии рынка.',
      scope: 'Public',
      rateLimit: '60 запросов/мин',
      cache: 'Регенерация данных один раз в сутки.',
      weight: 1,
      query: [],
      response: {
        description: 'Массив дневных записей с OHLC показателями корзины альткоинов.',
        schema: [
          { field: 'time', type: 'string (date)', description: 'Дата периода в формате YYYY-MM-DD.' },
          { field: 'open', type: 'number', description: 'Значение индекса на открытии дня.' },
          { field: 'high', type: 'number', description: 'Максимальное значение индекса за день.' },
          { field: 'low', type: 'number', description: 'Минимальное значение индекса за день.' },
          { field: 'close', type: 'number', description: 'Значение индекса на закрытии дня.' }
        ],
        example: `[
  {
    "time": "2021-02-12",
    "open": 842.5,
    "high": 869.2,
    "low": 826.0,
    "close": 861.4
  },
  {
    "time": "2021-02-13",
    "open": 861.0,
    "high": 902.8,
    "low": 848.5,
    "close": 896.2
  }
]`
      },
      notes: [
        'Вес корзины пересматривается ежемесячно в зависимости от ликвидности и капитализации активов, где источником первичных данных является Binance.',
        'Сырые котировки проходят фильтрацию для исключения дублирования и экстремальных выбросов.',
      ],
      codeSamples: [
        {
          label: 'curl',
          language: 'bash',
          code: `curl 'https://wildboar.space:8001/api/altcoin_index' \
  --header 'Accept: application/json'`
        },
        {
          label: 'Python',
          language: 'python',
          code: `import requests

url = "https://wildboar.space:8001/api/altcoin_index"
headers = {"Accept": "application/json"}

rows = requests.get(url, headers=headers, timeout=5, verify=False).json()
latest = rows[-1]
print(f"Последний день: {latest['time']}, close={latest['close']}")`
        },
        {
          label: 'JavaScript',
          language: 'javascript',
          code: `async function loadAltcoinIndex() {
  const res = await fetch('https://wildboar.space:8001/api/altcoin_index');
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  return data.slice(-7);
}

loadAltcoinIndex()
  .then((points) => console.table(points))
  .catch((err) => console.error(err));`
        }
      ],
      errors: [
        { code: 400, message: 'Bad Request', description: 'Формат запроса не соответствует спецификации.' },
        { code: 404, message: 'Not Found', description: 'Запрошенные данные отсутствуют или архив недоступен.' },
        { code: 429, message: 'Too Many Requests', description: 'Превышен лимит запросов. Подождите 60 секунд и повторите попытку.' },
        { code: 503, message: 'Service Unavailable', description: 'Плановое обслуживание или деградация. Проверьте статус-страницу.' }
      ]
    }
  ],
};
