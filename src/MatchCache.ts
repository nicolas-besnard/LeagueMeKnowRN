import AsyncStorage from '@react-native-community/async-storage'
import {add, isBefore, parseISO} from 'date-fns'

import type {Maybe} from 'monads'

const matchesCacheKey: string = 'matchesv1'
const matchesCacheDurationInMinutes: number = 30

type LeagueIds = string[]

enum MatchState {
  completed = 'completed',
  unstarted = 'unstarted',
  inProgress = 'inProgress',
}

interface Record {
  wins: number
  losses: number
}

interface League {
  name: string
  slug: string
}

interface Team {
  name: string
  code: string
  logoUrl: string
  record: Record
  league: League
}

interface BaseMatch {
  id: string
  team1: Team
  team2: Team
  state: MatchState
  startDate: string
  name: string
}

interface CachedMatch extends BaseMatch {
  startTime: string
}

interface Match extends BaseMatch {
  startTime: Date
}

interface CachedSchedule {
  leagueSlug: string
  matches: CachedMatch[]
  fetchedAt: string
}
type CachedSchedules = CachedSchedule[]

class MatchCache {
  leagueIds: LeagueIds
  leagueSlug: string

  constructor(leagueIds: LeagueIds) {
    this.leagueIds = leagueIds
    this.leagueSlug = this.getLeagueSlug()
  }

  async getCachedMatches(): Promise<Maybe<Match[]>> {
    const cachedSchedules: Maybe<CachedSchedules> = await this.getDataFromCache()

    if (!cachedSchedules) {
      console.log('[MatchCache] No data in cache')
      return null
    }

    const leagueMatches = cachedSchedules.find(
      (d) => d.leagueSlug === this.leagueSlug,
    )
    if (!leagueMatches) {
      console.log('[MatchCache] No data for slug', this.leagueSlug)
      return null
    }

    const {matches, fetchedAt} = leagueMatches

    const fetchedMoreThanFiveMinutesAgo = isBefore(
      add(parseISO(fetchedAt), {minutes: matchesCacheDurationInMinutes}),
      new Date(),
    )

    if (fetchedMoreThanFiveMinutesAgo) {
      console.log('[MatchCache] Cache has expired')
      await this.removeExpiredSlug({cachedSchedules: cachedSchedules})
      return null
    }

    //console.log('[MatchCache] Returns match from cache', data)

    return matches.map((match) => ({
      ...match,
      startDate: new Date(Date.parse(match.startTime)).toDateString(),
      startTime: new Date(Date.parse(match.startTime)),
    }))
  }

  async addMatchesToCache({matches}: {matches: Match[]}) {
    const newEntry = {
      fetchedAt: new Date(),
      leagueSlug: this.leagueSlug,
      matches,
    }

    const value = await AsyncStorage.getItem(matchesCacheKey)
    const data = JSON.parse(<string>value)

    if (!data) {
      await AsyncStorage.setItem(matchesCacheKey, JSON.stringify([newEntry]))
    } else {
      await AsyncStorage.setItem(
        matchesCacheKey,
        JSON.stringify([...data, newEntry]),
      )
    }
  }

  // eslint-disable-next-line prettier/prettier
  async removeExpiredSlug({cachedSchedules}: {cachedSchedules: CachedSchedule[]}) {
    console.log('[MatchCache] Removing expired slugs')
    const newMatches = cachedSchedules.filter(
      (schedule) =>
        !isBefore(
          add(parseISO(schedule.fetchedAt), {
            minutes: matchesCacheDurationInMinutes,
          }),
          new Date(),
        ),
    )
    await AsyncStorage.setItem(matchesCacheKey, JSON.stringify(newMatches))
  }

  async getDataFromCache(): Promise<Maybe<CachedSchedules>> {
    try {
      const value = await AsyncStorage.getItem(matchesCacheKey)
      return JSON.parse(<string>value)
    } catch (e) {
      console.log('[MatchCache] getDataFromCache - error when getting data', e)
      return null
    }
  }

  getLeagueSlug(): string {
    return this.leagueIds
      .map((id) => parseInt(id))
      .sort((a, b) => a - b)
      .join('')
  }
}

export default MatchCache
export type {LeagueIds, Match, MatchState, Team}
