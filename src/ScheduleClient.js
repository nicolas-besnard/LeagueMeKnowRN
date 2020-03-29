import MatchCache from './MatchCache'

class ScheduleClient {
  static leagueSlugFromLeagueIds({leagueIds}) {
    return leagueIds
      .map(id => parseInt(id))
      .sort((a, b) => a - b)
      .join('')
  }

  static async getMatches({leagueIds}) {
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

  static async fetchMatchesFromRemoteServer({leagueIds}) {
    const leagueIdsParameter = leagueIds.join('%2C')

    const request = await fetch(
      `https://esports-api.lolesports.com/persisted/lolmobile/getSchedule?hl=en-US&leagueId=${leagueIdsParameter}`,
      {
        headers: {
          'x-api-key': 'jN7hVlu1JjyQ1AElkd9K319ya9Pf8rp6TUebdwxc',
          'Content-Type': 'application/json',
          'User-Agent':
            'LeagueMeKnow V1.0 (development) (contact besnard.nicolas@gmail.com)',
        },
      },
    )

    const result = await request.json()

    return result.data.schedule.events
      .map(event => {
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
      .filter(event => event.team1.name !== 'TBD')
  }
}

export default ScheduleClient
