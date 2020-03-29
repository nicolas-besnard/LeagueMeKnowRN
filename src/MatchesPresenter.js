import {format} from 'date-fns'

class MatchesPresenter {
  constructor(matches) {
    this.matches = matches || []
  }

  sections() {
    const grouped = this.matches.reduce((hash, obj) => {
      const value = obj.startDate
      hash[value] = (hash[value] || []).concat(obj)
      return hash
    }, {})

    const t = Object.keys(grouped).reduce((array, date) => {
      const dateDate = new Date(Date.parse(date))
      const newSection = {
        startDateMonthDay: format(dateDate, 'MMMM dd'),
        startDateWeekDay: format(dateDate, 'EEEE'),
        startDate: dateDate,
        startDateString: date,
        data: grouped[date],
      }
      array.push(newSection)
      return array
    }, [])

    return t.sort((a, b) => b.startDate - a.startDate)
  }
}

export default MatchesPresenter
