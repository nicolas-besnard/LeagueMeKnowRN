import {format} from 'date-fns'
import type {Match} from 'MatchCache'

interface GroupedMatch {
  [key: string]: Match[]
}

interface MatchSection {
  startDateMonthDay: string
  startDateWeekDay: string
  startDate: Date
  startDateString: string
  name: string
  data: Match[]
}

class MatchesPresenter {
  matches: Match[]

  constructor(matches: Match[] = []) {
    this.matches = matches
  }

  sections(): MatchSection[] {
    const grouped: GroupedMatch = this.matches.reduce(
      (hash: GroupedMatch, obj) => {
        const value = obj.startDate
        hash[value] = (hash[value] || []).concat(obj)
        return hash
      },
      {},
    )

    const sections: MatchSection[] = Object.keys(grouped).reduce(
      (array: MatchSection[], date) => {
        const dateDate = new Date(Date.parse(date))
        const newSection = {
          startDateMonthDay: format(dateDate, 'MMMM dd'),
          startDateWeekDay: format(dateDate, 'EEEE'),
          startDate: dateDate,
          startDateString: date,
          name: grouped[date][0].name,
          data: grouped[date],
        }
        array.push(newSection)
        return array
      },
      [],
    )

    return sections.sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime(),
    )
  }
}

export default MatchesPresenter
export type {MatchSection}
