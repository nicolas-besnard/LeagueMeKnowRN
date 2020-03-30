import React, {useRef} from 'react'
import {StyleSheet, SafeAreaView, FlatList, Animated} from 'react-native'
import {useLeagueFavoritesContext} from '@contexts/leagueFavorites'
import {backgroundColor} from '../colors'
import useTeams from '../useTeams'
import Team from './Team'
import LeaguePicker from '../LeaguePicker'
import ListSeparator from '../ListSeparator'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const TeamsList = () => {
  const {state: leagueIds} = useLeagueFavoritesContext()
  const scrollY = useRef(new Animated.Value(0)).current
  const teams = useTeams({leagueIds})

  return (
    <SafeAreaView style={styles.container}>
      <LeaguePicker scrollY={scrollY} />
      <AnimatedFlatList
        data={teams.sort((a, b) => b.record.wins - a.record.wins)}
        renderItem={({item}) => <Team team={item} />}
        ItemSeparatorComponent={() => <ListSeparator />}
        keyExtractor={(team) => team.code}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
      />
    </SafeAreaView>
  )
}

const TeamsView = () => {
  return <TeamsList />
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
})

export default TeamsView
