import React, {useState, useEffect} from 'react'

import MatchesPresenter from 'MatchesPresenter'
import ScheduleClient from 'ScheduleClient'
import type {MatchSection} from 'MatchesPresenter'
import type {LeagueIds} from 'MatchCache'

// eslint-disable-next-line prettier/prettier
const useMatches = (
  leagueIds: LeagueIds = [],
  callback = (_matchs: MatchSection[]) => {},
): MatchSection[] => {
  const [sections, setMatchSections] = useState<MatchSection[]>([])

  useEffect(() => {
    async function fetchMatches() {
      if (leagueIds.length === 0) {
        console.log('[useMatches] No league selected', leagueIds)
      } else {
        console.log('[useMatches] Will fetch matches for league', leagueIds)
        const matches = await ScheduleClient.getMatches({leagueIds})
        const matchesWithSections = new MatchesPresenter(matches)
        const sections = matchesWithSections.sections()
        setMatchSections(sections)
        callback(sections)
      }
    }
    fetchMatches()
  }, [leagueIds])

  return sections
}

export default useMatches
