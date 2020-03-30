import {isBefore, isToday} from 'date-fns'
import React, {useRef} from 'react'
import {SectionList, StyleSheet, View, Animated} from 'react-native'
import {MatchFavoritesProvider} from '@contexts/matchFavorites'
import {useLeagueFavoritesContext} from '@contexts/leagueFavorites'
import {backgroundColor} from '../colors'
import Header from './Header'
import Match from './Match'
import ListSeparator from '../ListSeparator'
import LeaguePicker from '../LeaguePicker'

import useMatches from '../useMatches'

const Matches = () => {
  const listRef = useRef(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const {state: leagueIds} = useLeagueFavoritesContext()

  const sections = useMatches(leagueIds, (matches) => {
    if (listRef.current) {
      let matchIsToday, matchIsBefore

      let sectionId = matches.findIndex((section) => {
        matchIsToday = isToday(section.startDate)
        matchIsBefore = isBefore(section.startDate, new Date())
        return matchIsToday || matchIsBefore
      })

      if (!matchIsToday) {
        sectionId -= 1
      }

      setTimeout(() => {
        listRef.current.scrollToLocation({
          animated: false,
          itemIndex: 0,
          sectionIndex: sectionId,
        })
      }, 150)
    }
  })

  return (
    <View style={styles.container}>
      <LeaguePicker scrollY={scrollY} />
      <SectionList
        ref={listRef}
        sections={sections}
        renderItem={({item}) => <Match match={item} />}
        ItemSeparatorComponent={() => <ListSeparator />}
        renderSectionHeader={({section}) => <Header section={section} />}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => {
          return {
            length: 75,
            offset: 75 * index,
            index: index,
          }
        }}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
      />
    </View>
  )
}

const MatchesView = () => {
  return (
    <MatchFavoritesProvider>
      <Matches />
    </MatchFavoritesProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
  },
})

export default MatchesView
