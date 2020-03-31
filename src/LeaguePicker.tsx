import React, {useCallback} from 'react'
import {FlatList, TouchableWithoutFeedback, Animated} from 'react-native'
import FastImage from 'react-native-fast-image'

import {useLeagueFavoritesContext} from '@contexts/leagueFavorites'

interface League {
  id: string
  slug: string
  name: string
  region: string
  image: string
  priority: number
}

const leagueImages: League[] = [
  {
    id: '100695891328981122',
    slug: 'european-masters',
    name: 'European Masters',
    region: 'EUROPE',
    image:
      'http://static.lolesports.com/leagues/1585044513499_EM_BUG_2020%20(1).png',
    priority: 213,
  },
  {
    id: '101097443346691685',
    slug: 'turkey-academy-league',
    name: 'TAL',
    region: 'TURKEY',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/turkey-academy-league-8l5m5u43.png',
    priority: 1000,
  },
  {
    id: '101382741235120470',
    slug: 'lla',
    name: 'LLA',
    region: 'LATIN AMERICA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/lla-3npx8e46.png',
    priority: 206,
  },
  {
    id: '98767975604431411',
    slug: 'worlds',
    name: 'Worlds',
    region: 'INTERNATIONAL',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/worlds-3om032jn.png',
    priority: 209,
  },
  {
    id: '98767991295297326',
    slug: 'all-star',
    name: 'All-Star Event',
    region: 'INTERNATIONAL',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/all-star-dtf4kf16.png',
    priority: 211,
  },
  {
    id: '98767991299243165',
    slug: 'lcs',
    name: 'LCS',
    region: 'NORTH AMERICA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/lcs-79qe3e0y.png',
    priority: 1,
  },
  {
    id: '98767991302996019',
    slug: 'lec',
    name: 'LEC',
    region: 'EUROPE',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/eu-lcs-dgpu3cuv.png',
    priority: 2,
  },
  {
    id: '98767991310872058',
    slug: 'lck',
    name: 'LCK',
    region: 'KOREA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/lck-7epeu9ot.png',
    priority: 3,
  },
  {
    id: '98767991314006698',
    slug: 'lpl',
    name: 'LPL',
    region: 'CHINA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/lpl-china-6ygsd4c8.png',
    priority: 201,
  },
  {
    id: '98767991325878492',
    slug: 'msi',
    name: 'MSI',
    region: 'INTERNATIONAL',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/msi-iu1t0cjd.png',
    priority: 210,
  },
  {
    id: '98767991331560952',
    slug: 'oce-opl',
    name: 'OPL',
    region: 'OCEANIA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/oce-opl-e0qfb3l8.png',
    priority: 207,
  },
  {
    id: '98767991332355509',
    slug: 'cblol-brazil',
    name: 'CBLOL',
    region: 'BRAZIL',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/cblol-brazil-46x5zjmg.png',
    priority: 204,
  },
  {
    id: '98767991343597634',
    slug: 'turkiye-sampiyonluk-ligi',
    name: 'TCL',
    region: 'TURKEY',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/turkiye-sampiyonluk-ligi-8r9ofb9.png',
    priority: 203,
  },
  {
    id: '98767991349120232',
    slug: 'league-of-legends-college-championship',
    name: 'College Championship',
    region: 'NORTH AMERICA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/league-of-legends-college-championship-h6j74ouz.png',
    priority: 212,
  },
  {
    id: '98767991349978712',
    slug: 'ljl-japan',
    name: 'LJL',
    region: 'JAPAN',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/ljl-japan-j27k8oms.png',
    priority: 208,
  },
  {
    id: '99332500638116286',
    slug: 'lcs-academy',
    name: 'LCS Academy',
    region: 'NORTH AMERICA',
    image:
      'https://lolstatic-a.akamaihd.net/esports-assets/production/league/lcs-academy-4o8goq8n.png',
    priority: 202,
  },
].sort((a, b) => a.priority - b.priority)

type LeagueImageProps = {
  league: League
  selected: boolean
  onSelect: (_leagueId: string) => void
  scale: Animated.AnimatedInterpolation
}

export const MAX_IMAGE_SIZE = 60
export const MIN_IMAGE_SIZE = 30
export const MAX_MARGIN_SIZE = 15
export const MIN_MARGIN_SIZE = 5

const HEADER_MAX_HEIGHT = MAX_IMAGE_SIZE + 2 * MAX_MARGIN_SIZE
const HEADER_MIN_HEIGHT = MIN_IMAGE_SIZE + 2 * MIN_MARGIN_SIZE
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
const LeagueImage = ({league, selected, onSelect, scale}: LeagueImageProps) => {
  const opacity = selected ? 1 : 0.4
  return (
    <TouchableWithoutFeedback onPress={() => onSelect(league.id)}>
      <AnimatedFastImage
        style={{
          width: 50,
          height: 50,
          marginTop: 10,
          marginLeft: 5,
          marginBottom: 5,
          opacity: opacity,
          transform: [{scale: scale}],
        }}
        source={{uri: league.image}}
      />
    </TouchableWithoutFeedback>
  )
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const LeaguePicker = ({scrollY}: {scrollY: Animated.Value}) => {
  const {state, dispatch} = useLeagueFavoritesContext()

  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  })
  const scale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  })

  const onSelect = useCallback(
    (leagueId) => {
      if (state.length === 1 && state[0] === leagueId) {
        return
      }

      if (state.includes(leagueId)) {
        dispatch({type: 'remove', leagueId})
      } else {
        dispatch({type: 'add', leagueId})
      }
    },
    [state, dispatch],
  )

  return (
    <Animated.View
      style={{
        transform: [{translateY: translateY}],
      }}>
      <AnimatedFlatList
        horizontal
        data={leagueImages}
        renderItem={({item}: {item: League}) => {
          return (
            <LeagueImage
              scale={scale}
              league={item}
              onSelect={onSelect}
              selected={state.includes(item.id)}
            />
          )
        }}
      />
    </Animated.View>
  )
}

export default LeaguePicker
