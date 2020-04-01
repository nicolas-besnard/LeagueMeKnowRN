import React from 'react'
import FastImage from 'react-native-fast-image'
import {StyleSheet, Text, View} from 'react-native'
import {secondaryTextColor} from '../colors'
import flipper from '../flipper'

const Teams = ({match}) => {
  return (
    <View style={styles.container}>
      <View style={styles.team1Container}>
        <Text style={styles.text}>{match.sectionName}</Text>
        <Text style={[styles.text, styles.team1]}>{match.team1.name}</Text>
        {flipper.displayTeamLogo && (
          <FastImage
            style={{width: 45, height: 45}}
            source={{uri: match.team1.logoUrl}}
          />)}
      </View>
      <Text style={[styles.text, styles.vs]}> VS </Text>
      <View style={styles.team2Container}>
        {flipper.displayTeamLogo && (
          <FastImage
            style={{width: 45, height: 45}}
            source={{uri: match.team2.logoUrl}}
          />)}
        <Text style={[styles.text, styles.team2]}>{match.team2.name}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  team1Container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  team2Container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  team1: {
    paddingRight: 15,
  },
  team2: {
    marginLeft: 15,
  },
  vs: {
    fontSize: 18,
    color: secondaryTextColor,
    marginRight: 10,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
})

export default Teams
