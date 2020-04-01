import {isBefore} from 'date-fns'
import type {Match, Team} from 'MatchCache'

interface GroupedTeam {
  [key: string]: Team
}

class TeamsPresenter {
  matches: Match[]

  constructor(matches: Match[]) {
    this.matches = matches
  }

  teams(): Team[] {
    const teams: GroupedTeam = this.matches
      .filter((m) => isBefore(new Date(m.startTime), new Date()))
      .reduce((hash: GroupedTeam, match) => {
        if (match.team1.code !== 'TBD') {
          hash[match.team1.code] = match.team1
        }
        if (match.team2.code !== 'TBD') {
          hash[match.team2.code] = match.team2
        }
        return hash
      }, {})

    return Object.values(teams)
  }
}

export default TeamsPresenter
