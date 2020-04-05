import React from 'react'
import {useLeagueFavoritesContext} from 'contexts/leagueFavorites'
import ScheduleClient from 'ScheduleClient'
import type {Match} from 'MatchCache'

interface useMatchesForTeamProps {
  teamCode: string
}

const useMatchesForTeam = ({teamCode}: useMatchesForTeamProps): Match[] => {
  const {state: leagueIds} = useLeagueFavoritesContext()
  const [matches, setMatches] = React.useState<Match[]>([])

  React.useEffect(() => {
    ScheduleClient.getMatches({leagueIds}).then((matches) => {
      const matchesForTeam = matches
        .filter((match) => match.name.startsWith('Week'))
        .filter(
          (match) =>
            match.team1.code === teamCode || match.team2.code === teamCode,
        )
      setMatches(matchesForTeam)
    })
  }, [leagueIds, teamCode])

  return matches
}

export default useMatchesForTeam
