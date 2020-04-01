const API_URL =
  'https://esports-api.lolesports.com/persisted/lolmobile/getSchedule?hl=en-US&leagueId=';

type RequestMethod = 'GET' | 'POST'
interface RequestHeader {
  [header: string]: string
}

interface RequestBody {
  [header: string]: string
}

interface RequestConfig {
  method?: RequestMethod
  headers?: RequestHeader
  body?: RequestBody
}

async function httpClient(endpoint: string, customConfig: RequestConfig = {}) {
  const defaultHeaders = {
    'x-api-key': 'jN7hVlu1JjyQ1AElkd9K319ya9Pf8rp6TUebdwxc',
    'Content-Type': 'application/json',
    'User-Agent':
      'LeagueMeKnow V1.0 (development) (contact besnard.nicolas@gmail.com)',
  }

  const config = {
    method: 'GET',
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...customConfig.headers,
    },
  }

  let url = `${API_URL}/${endpoint}`

  const response = await fetch(url, config)
  const data = await response.json()

  if (response.ok) {
    return data
  } else {
    return Promise.reject(data)
  }
}

export default httpClient;
