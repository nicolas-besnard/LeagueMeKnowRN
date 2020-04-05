import {MatchState} from 'MatchCache'
import {isAfter} from 'date-fns'
import httpClient from 'utils/httpClient'

interface LeagueJSON {
  name: string
  slug: string
}

interface RecordJSON {
  wins: number
  losses: number
}

interface TeamJSON {
  name: string
  code: string
  image: string
  league: LeagueJSON
  record: RecordJSON
  result: ResultJSON
}

interface StrategyJSON {
  type: string
  count: number
}

enum Outcome {
  win = 'win',
  loss = 'loss',
}

type OutcomeJSON = Outcome | null

interface ResultJSON {
  outcome: OutcomeJSON
  gameWins: number
}

interface MatchJSON {
  id: string
  teams: TeamJSON[]
  strategy: StrategyJSON
}

interface EventJSON {
  match: MatchJSON
  league: LeagueJSON
  startTime: string
  blockName: string
  state: MatchState
}

interface PagesJSON {
  older: string
  newer: string
}

interface ScheduleJSON {
  events: EventJSON[]
  pages: PagesJSON
}

interface DataJSON {
  schedule: ScheduleJSON
}

interface ScheduleResponseJSON {
  data: DataJSON
}

async function getSchedule(leagueIds: string[]): Promise<EventJSON[]> {
  let parameters = new URLSearchParams({
    hl: 'en-US',
    leagueId: leagueIds,
  } as any)

  console.log('[httpClient] getSchedule - Fetch schedule')

  let result: ScheduleResponseJSON = await httpClient(
    `/getSchedule?${parameters}`,
  )

  let schedules: EventJSON[] = result.data.schedule.events
  let nextPage = result.data.schedule.pages.older

  while (nextPage) {
    parameters = new URLSearchParams({
      hl: 'en-US',
      leagueId: leagueIds,
      pageToken: nextPage,
    } as any)
    console.log('[httpClient] getSchedule - fetch new page', nextPage)
    result = await httpClient(`/getSchedule?${parameters}`)
    schedules = schedules.concat(result.data.schedule.events)
    nextPage = result.data.schedule.pages.older
  }

  const sortedSchedules = schedules
    .filter((e) =>
      isAfter(
        new Date(e.startTime).getTime(),
        Date.parse('2020-01-01T00:00:00Z'),
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
  console.log({sortedSchedules: sortedSchedules})

  return sortedSchedules
}

export default getSchedule
