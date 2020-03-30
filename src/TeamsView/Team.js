import React from 'react'
import FastImage from 'react-native-fast-image'
import {StyleSheet, Text, View} from 'react-native'
import {backgroundColor, blueColor, redColor, secondaryTextColor} from '../colors'

const Team = ({team}) => {
  return (
    <View style={styles.container}>
      <View style={styles.teamInfo}>
        <FastImage
          style={{width: 45, height: 45, marginRight: 30}}
          source={{uri: team.logoUrl}}
        />
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.league}>{team.league.name}</Text>
      </View>
      <View>
        <View style={styles.scoreContainer}>
          <Text style={styles.wins}>{team.record.wins}W</Text>
          <Text style={styles.looses}>{team.record.losses}L</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  teamName: {
    color: '#fff',
    fontSize: 16,
    marginRight: 15,
  },
  league: {
    fontSize: 14,
    color: secondaryTextColor,
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: backgroundColor,
    marginRight: 10,
    marginLeft: 10,
  },
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wins: {
    fontWeight: 'bold',
    fontSize: 16,
    color: blueColor,
    paddingRight: 20,
  },
  looses: {
    fontWeight: 'bold',
    fontSize: 16,
    color: redColor,
  },
})

export default Team
