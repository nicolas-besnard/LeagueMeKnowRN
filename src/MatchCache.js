import AsyncStorage from '@react-native-community/async-storage'
import {add, isBefore, parseISO} from 'date-fns'

const matchesCacheKey = 'matchesv1'
const matchesCacheDurationInMinutes = 10

class MatchCache {
  constructor(leagueIds) {
    this.leagueIds = leagueIds
    this.leagueSlug = this.getLeagueSlug()
  }

  async getCachedMatches() {
    const data = await this.getDataFromCache()

    if (!data) {
      console.log('[MatchCache] No data in cache')
      return null
    }

    const leagueMatches = data.find(d => d.leagueSlug === this.leagueSlug)
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
      await this.removeExpiredSlug({matches: data})
      return null
    }

    //console.log('[MatchCache] Returns match from cache', data)

    return matches.map(match => ({
      ...match,
      startDate: new Date(Date.parse(match.startTime)).toDateString(),
      startTime: new Date(Date.parse(match.startTime)),
    }))
  }

  async addMatchesToCache({matches}) {
    const newEntry = {
      fetchedAt: new Date(),
      leagueSlug: this.leagueSlug,
      matches,
    }

    const value = await AsyncStorage.getItem(matchesCacheKey)
    const data = JSON.parse(value)

    if (!data) {
      await AsyncStorage.setItem(matchesCacheKey, JSON.stringify([newEntry]))
    } else {
      await AsyncStorage.setItem(
        matchesCacheKey,
        JSON.stringify([...data, newEntry]),
      )
    }
  }

  async removeExpiredSlug({matches}) {
    console.log('[MatchCache] Removing expired slugs')
    const newMatches = matches.filter(match =>
      !isBefore(
        add(parseISO(match.fetchedAt), {minutes: matchesCacheDurationInMinutes}),
        new Date(),
      ),
    )
    await AsyncStorage.setItem(matchesCacheKey, JSON.stringify(newMatches))
  }

  async getDataFromCache() {
    try {
      const value = await AsyncStorage.getItem(matchesCacheKey)
      return JSON.parse(value)
    } catch (e) {
      console.log('[MatchCache] getDataFromCache - error when getting data', e)
      return null
    }
  }

  getLeagueSlug() {
    return this.leagueIds
      .map(id => parseInt(id))
      .sort((a, b) => a - b)
      .join('')
  }
}

export default MatchCache
