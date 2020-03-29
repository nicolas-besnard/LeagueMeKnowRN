import React, {useState, useEffect} from 'react'
import ScheduleClient from 'ScheduleClient'
import TeamsPresenter from 'TeamsPresenter'
import type {Team} from 'MatchCache'

const useTeams = ({leagueIds = []}) => {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    async function fetchTeams() {
      if (leagueIds.length === 0) {
        console.log('[useTeams] No league selected', leagueIds)
      }
      console.log('[useTeams] Will fetch matches for league', leagueIds)
      const matches = await ScheduleClient.getMatches({leagueIds})
      const teams = new TeamsPresenter(matches)
      setTeams(teams.teams())
    }

    fetchTeams()
  }, [leagueIds])

  return teams
}

export default useTeams
