import React, {useRef} from 'react'
import {StyleSheet, SafeAreaView, FlatList, Animated} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import {useLeagueFavoritesContext} from '@contexts/leagueFavorites'
import {backgroundColor} from '../colors'
import useTeams from '../useTeams'
import Team from './Team'
import LeaguePicker from '../LeaguePicker'
import ListSeparator from '../ListSeparator'
import TeamMatches from './TeamMatches'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const TeamsList = ({navigation}) => {
  const {state: leagueIds} = useLeagueFavoritesContext()
  const scrollY = useRef(new Animated.Value(0)).current
  const teams = useTeams({leagueIds}).sort(
    (a, b) => b.record.wins - a.record.wins,
  )

  return (
    <SafeAreaView style={styles.container}>
      <LeaguePicker scrollY={scrollY} />
      <AnimatedFlatList
        data={teams}
        renderItem={({item}) => (
          <Team
            team={item}
            onPress={() => navigation.navigate('TeamMatch', {team: item})}
          />
        )}
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

const Stack = createStackNavigator()

const TeamsView = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Teams"
        options={{headerShown: false}}
        component={TeamsList}
      />
      <Stack.Screen
        name="TeamMatch"
        options={({route}) => ({
          title: route.params.team.name,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTitleStyle: {
            color: 'white',
          },
        })}
        component={TeamMatches}
      />
    </Stack.Navigator>
  )
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
