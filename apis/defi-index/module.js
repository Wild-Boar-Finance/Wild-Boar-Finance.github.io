export const apiDoc = {
  slug: 'defi-index',
  name: 'DeFi Index',
  group: 'Индексы',
  summary: 'Исторические дневные OHLC данные по индексу децентрализованных финансов.',
  description: 'Индекс DeFi фиксирует динамику ключевых протоколов децентрализованных финансов. Данные нормализуются, приводятся к UTC и проходят многоуровневую валидацию.',
  version: 'v1',
  status: 'Stable',
  releaseDate: '2020-08-28',
  baseUrl: 'https://wildboar.space:8001',
  authentication: 'Не требуется для публичного доступа.',
  serviceLevel: 'Обновление данных до 00:05 UTC следующего дня.',
  rateLimit: '60 запросов в минуту на IP.',
  tags: ['JSON', 'OHLC', 'Public'],
  metrics: [
    { label: 'Доступность', value: '99.9% uptime за последние 90 дней' },
    { label: 'Глубина истории', value: 'С августа 2020 года' },
    { label: 'Ретроактивные правки', value: 'Не чаще одного раза в квартал' }
  ],
  compliance: [
    'Запрещено выдавать данные Altcoin Index за продукт Wild Boar или вводить пользователей в заблуждение относительно правообладателя.',
    'При использовании индекса размещайте ссылку на первоисточник и указывайте Wild Boar как поставщика данных.',
    'Коммерческое использование возможно только после письменного согласования условий и указания авторства.',
    'Политика распространяется на все конечные и промежуточные данные API.'
  ],
  endpoints: [
    {
      name: 'История индекса DeFi',
      method: 'GET',
      path: '/api/defi_index',
      description: 'Возвращает дневные значения индекса DeFi за выбранный период. По умолчанию предоставляет весь доступный диапазон.',
      scope: 'Public',
      rateLimit: '60 запросов/мин',
      cache: 'Регенерация данных один раз в сутки.',
      weight: 1,
      query: [],
      response: {
        description: 'Массив дневных записей с торговой статистикой индекса.',
        schema: [
          { field: 'time', type: 'string (date)', description: 'Дата торгового дня в формате YYYY-MM-DD.' },
          { field: 'open', type: 'number', description: 'Значение индекса на открытии сессии.' },
          { field: 'high', type: 'number', description: 'Максимальное значение индекса за день.' },
          { field: 'low', type: 'number', description: 'Минимальное значение индекса за день.' },
          { field: 'close', type: 'number', description: 'Значение индекса на закрытии сессии.' }
        ],
        example: `[
  {
    "time": "2020-08-28",
    "open": 1012.0,
    "high": 1189.0,
    "low": 964.1,
    "close": 1018.8
  },
  {
    "time": "2020-08-29",
    "open": 1017.5,
    "high": 1096.5,
    "low": 1015.0,
    "close": 1056.0
  }
]`
      },
      notes: [
        'Данные представляют агрегированный индикатор DeFi сегмента и не являются торговой рекомендацией.',
        'Ряды могут корректироваться в случае обнаружения ошибочных котировок или делистинга источников.',
        'Поля возвращаются в формате с плавающей точкой, точность до десятых.'
      ],
      codeSamples: [
        {
          label: 'curl',
          language: 'bash',
          code: `curl 'https://wildboar.space:8001/api/defi_index' \
  --header 'Accept: application/json'`
        },
        {
          label: 'Python',
          language: 'python',
          code: `import requests

url = "https://wildboar.space:8001/api/defi_index"
headers = {"Accept": "application/json"}

response = requests.get(url, headers=headers, timeout=5, verify=False)
response.raise_for_status()

for row in response.json()[:3]:
    print(row)`
        },
        {
          label: 'JavaScript',
          language: 'javascript',
          code: `const url = 'https://wildboar.space:8001/api/defi_index';

fetch(url)
  .then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  })
  .then((data) => {
    console.log('Последние 5 точек:', data.slice(-5));
  })
  .catch((err) => {
    console.error('API error', err);
  });`
        }
      ],
      errors: [
        { code: 400, message: 'Bad Request', description: 'Формат запроса не распознан или содержит лишние параметры.' },
        { code: 404, message: 'Not Found', description: 'Данные временно недоступны для выбранного периода.' },
        { code: 429, message: 'Too Many Requests', description: 'Превышен лимит в 60 запросов в минуту.' },
        { code: 500, message: 'Internal Error', description: 'Непредвиденная ошибка на стороне сервера. Повторите запрос позже.' }
      ]
    }
  ],
  changelog: [
    { date: '2025-09-04', note: 'Временная приостановка публикации DeFi Index' },
  ]
};
