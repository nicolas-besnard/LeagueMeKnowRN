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
    const teams: GroupedTeam = this.matches.reduce(
      (hash: GroupedTeam, match) => {
        hash[match.team1.code] = match.team1
        hash[match.team2.code] = match.team2
        return hash
      },
      {},
    )

    return Object.values(teams)
  }
}

export default TeamsPresenter
