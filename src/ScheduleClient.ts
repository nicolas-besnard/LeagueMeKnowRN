import MatchCache from 'MatchCache'
import httpClient from 'utils/httpClient'
import type {LeagueIds, Match, MatchState} from 'MatchCache'

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
}

interface MatchJSON {
  id: string
  teams: TeamJSON[]
}

interface EventJSON {
  match: MatchJSON
  league: LeagueJSON
  startTime: string
  state: MatchState
}

interface ScheduleJSON {
  events: EventJSON[]
}

interface DataJSON {
  schedule: ScheduleJSON
}

interface ScheduleResponseJSON {
  data: DataJSON
}

class ScheduleClient {
  static leagueSlugFromLeagueIds({leagueIds}: {leagueIds: LeagueIds}): string {
    return leagueIds
      .map((id) => parseInt(id, 10))
      .sort((a, b) => a - b)
      .join('')
  }

  // eslint-disable-next-line prettier/prettier
  static async getMatches({leagueIds}: {leagueIds: LeagueIds}): Promise<Match[]> {
    console.log('[ScheduleClient] getMatches - for league', leagueIds)

    const matchCache = new MatchCache(leagueIds)
    const matches = await matchCache.getCachedMatches()

    if (matches) {
      console.log('[ScheduleClient] getMatches - from cache')
      return matches
    }

    console.log('[ScheduleClient] getMatches - request server')
    const remoteMatches = await ScheduleClient.fetchMatchesFromRemoteServer({
      leagueIds,
    })
    try {
      console.log('[ScheduleClient] getMatches - add data to cache')
      await matchCache.addMatchesToCache({matches: remoteMatches})
    } catch (e) {
      console.log('error when saving matches', e)
    }

    return remoteMatches
  }

  // eslint-disable-next-line prettier/prettier
  static async fetchMatchesFromRemoteServer({leagueIds}: {leagueIds: LeagueIds}): Promise<Match[]> {
    const parameters = new URLSearchParams({leagueIds: leagueIds} as any)
    const result: ScheduleResponseJSON = await httpClient(
      `/getSchedule?${parameters}`,
    )

    return result.data.schedule.events
      .map((event) => {
        return {
          id: event.match.id,
          team1: {
            name: event.match.teams[0].name,
            code: event.match.teams[0].code,
            logoUrl: event.match.teams[0].image,
            record: event.match.teams[0].record,
            league: event.league,
          },
          team2: {
            name: event.match.teams[1].name,
            code: event.match.teams[1].code,
            logoUrl: event.match.teams[1].image,
            record: event.match.teams[1].record,
            league: event.league,
          },
          startDate: new Date(Date.parse(event.startTime)).toDateString(),
          startTime: new Date(Date.parse(event.startTime)),
          state: event.state,
          league: event.league.name,
        }
      })
      .filter((event) => event.team1.name !== 'TBD')
  }
}

export default ScheduleClient
