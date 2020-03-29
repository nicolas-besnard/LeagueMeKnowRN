import React, {useState, useEffect} from 'react'

import MatchesPresenter from './MatchesPresenter'
import ScheduleClient from './ScheduleClient'

const useMatches = (leagueIds = [], callback = () => {}) => {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    async function fetchMatches() {
      if (leagueIds.length === 0) {
        console.log('[useMatches] No league selected', leagueIds)
      } else {
        console.log('[useMatches] Will fetch matches for league', leagueIds)
        const matches = await ScheduleClient.getMatches({leagueIds})
        const matchesWithSections = new MatchesPresenter(matches)
        setMatches(matchesWithSections.sections())
      }
    }
    fetchMatches()
  }, [leagueIds])

  useEffect(() => {
    if (matches.length > 0) {
      callback(matches)
    }
  }, [matches])

  return matches
}

export default useMatches
