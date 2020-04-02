import {isBefore, isToday} from 'date-fns'
import React, {useRef, useState, useCallback} from 'react'
import {SectionList, StyleSheet, View, Animated, PixelRatio} from 'react-native'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import {MatchFavoritesProvider} from '@contexts/matchFavorites'
import {useLeagueFavoritesContext} from '@contexts/leagueFavorites'
import {backgroundColor} from '../colors'
import Header from './Header'
import Match from './Match'
import ListSeparator from '../ListSeparator'
import LeaguePicker from '../LeaguePicker'
import {HEADER_SCROLL_DISTANCE} from '../LeaguePicker'
import useMatches from '../useMatches'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

const Matches = () => {
  const listRef = useRef(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const [scrollDone, setScrollDone] = useState(false)
  const {state: leagueIds} = useLeagueFavoritesContext()

  const sections = useMatches(leagueIds, (matches) => {
    if (listRef.current && !scrollDone) {
      let matchIsToday, matchIsBefore

      let sectionId = matches.findIndex((section) => {
        matchIsToday = isToday(section.startDate)
        matchIsBefore = isBefore(section.startDate, new Date().getTime())
        return matchIsToday || matchIsBefore
      })

      if (!matchIsToday) {
        sectionId -= 1
      }

      setTimeout(() => {
        setScrollDone(true)
        console.log('[MatchesView] Scroll to ', sectionId)
        listRef.current.scrollToLocation({
          animated: false,
          itemIndex: 0,
          sectionIndex: sectionId,
        })
      }, 150)
    }
  })
  const getItemLayout = useCallback(
    sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => {
        //console.log({sectionIndex, rowIndex})
        return 100
      },

      // These four properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      listHeaderHeight: 40, // The height of your list header
    })
  , [])

  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.container}>
      <LeaguePicker scrollY={scrollY} />
      <AnimatedSectionList
        ref={listRef}
        style={{
          transform: [{translateY: translateY}],
        }}
        sections={sections}
        renderItem={({item}) => <Match match={item} />}
        ItemSeparatorComponent={() => <ListSeparator />}
        renderSectionHeader={({section}) => <Header section={section} />}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
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
