import React from 'react'
import {Text, View, SectionList, StyleSheet} from 'react-native'
import {backgroundColor, blueColor, redColor} from 'colors'
import Teams from '../MatchesView/Teams'
import Header from '../MatchesView/Header'
import useMatchesForTeam from 'useMatchesForTeam'

import type {RouteProp} from '@react-navigation/native'
import type {Match, Team} from 'MatchCache'
import {format} from 'date-fns'
import {MatchSection} from 'MatchesPresenter'

type RootStackParamList = {
  Team: undefined
  TeamMatch: {team: Team}
}

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'TeamMatch'>

interface ItemProps {
  match: Match
  teamCode: string
}

const matchViewStyle = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: backgroundColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winText: {
    color: blueColor,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loseText: {
    color: redColor,
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
})

const MatchView = ({teamCode, match}: ItemProps) => {
  const hasWin = match.winnerTeamCode === teamCode
  const text = hasWin ? 'Win' : 'Lose'
  const styleName = hasWin ? matchViewStyle.winText : matchViewStyle.loseText

  let leftTeam, rightTeam

  if (match.team1.code === teamCode) {
    leftTeam = match.team1
    rightTeam = match.team2
    match.team1 = leftTeam
    match.team2 = rightTeam
  } else {
    leftTeam = match.team2
    rightTeam = match.team1
    match.team1 = leftTeam
    match.team2 = rightTeam
  }

  return (
    <View style={matchViewStyle.container}>
      <Text style={styleName}>{text}</Text>
      <Teams match={match} />
    </View>
  )
}

interface TeamMatchesProps {
  route: ProfileScreenRouteProp
}

interface TeamRecord {
  wins: number
  losses: number
}

class TeamMatchesPresenter {
  matches: Match[]

  constructor(matches: Match[]) {
    this.matches = matches
  }

  sections() {
    const grouped = this.matches.reduce((hash, obj) => {
      const value = obj.name
      hash[value] = (hash[value] || []).concat(obj)
      return hash
    }, {})

    const sections: MatchSection[] = Object.keys(grouped).reduce(
      (array, week) => {
        const newSection = {
          date: grouped[week][0].startTime,
          startDateWeekDay: '',
          name: grouped[week][0].name,
          data: grouped[week],
        }
        array.push(newSection)
        return array
      },
      [],
    )

    return sections.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
}

const TeamMatches = ({route}: TeamMatchesProps) => {
  const {team} = route.params
  const matches: Match[] = useMatchesForTeam({teamCode: team.code})
  const presentedMatches = new TeamMatchesPresenter(matches).sections()

  // const [count, setCount] = React.useState<TeamRecord>(() => {
  //   return team.record
  // })

  // const handleItemsChanged = React.useCallback((info) => {
  //   const newCount = matches
  //     .slice(info.viewableItems[0].index, matches.length)
  //     .reduce(
  //       (p, i) => {
  //         const winned = i.winnerTeamCode === team.code
  //         if (winned) {
  //           return {
  //             wins: p.wins + 1,
  //             losses: p.losses,
  //           }
  //         } else {
  //           return {
  //             wins: p.wins,
  //             losses: p.losses + 1,
  //           }
  //         }
  //       },
  //       {wins: 0, losses: 0},
  //     )
  //
  //   setCount(newCount)
  // }, [])

  return (
    <View style={{backgroundColor: backgroundColor}}>
      <View>
        <Text style={styles.header}>
          <Text style={{color: blueColor}}>{team.record.wins}</Text> /{' '}
          <Text style={{color: redColor}}>{team.record.losses}</Text>
        </Text>
      </View>

      <SectionList
        sections={presentedMatches}
        renderSectionHeader={({section}) => <Header section={section} />}
        renderItem={({item}) => <MatchView teamCode={team.code} match={item} />}
        keyExtractor={(item) => item.id}
        // onViewableItemsChanged={handleItemsChanged}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    backgroundColor: backgroundColor,
    color: 'white',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
})

export default TeamMatches
