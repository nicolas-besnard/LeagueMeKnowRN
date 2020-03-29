import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {isToday, isPast, format} from 'date-fns'

import Notification from './Notification'
import Teams from './Teams'

const Match = ({match}) => {
  const matchIsToday = isToday(match.startTime)
  const matchIsPassed = isPast(match.startTime)

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.hour]}>
        {format(match.startTime, 'h a')}
      </Text>
      <Teams match={match} />
      {((matchIsToday && !matchIsPassed) || !matchIsPassed) && (
        <Notification match={match} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  hour: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    color: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 75,
    marginRight: 10,
    marginLeft: 10,
  },
})

export default Match
