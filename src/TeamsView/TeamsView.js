import React from 'react'
import {StyleSheet, View, FlatList} from 'react-native'
import { useLeagueFavoritesContext, } from '@contexts/leagueFavorites'
import {backgroundColor} from '../colors'
import useTeams from '../useTeams'
import Team from './Team'
import LeaguePicker from '../LeaguePicker'
import ListSeparator from '../ListSeparator'

const TeamsList = () => {
  const {state: leagueIds} = useLeagueFavoritesContext()
  console.log("before useTeams", leagueIds)
  const teams = useTeams({leagueIds})

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={teams.sort((a, b) => b.record.wins - a.record.wins)}
        renderItem={({item}) => <Team team={item} />}
        ListHeaderComponent={() => <LeaguePicker />}
        ItemSeparatorComponent={() => <ListSeparator />}
        keyExtractor={team => team.code}
      />
    </View>
  )
}

const TeamsView = () => {
  return (
      <TeamsList />
  )
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
})

export default TeamsView
