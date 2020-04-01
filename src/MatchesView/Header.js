import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {backgroundColor, borderColor, secondaryTextColor} from '../colors'

const Header = ({section}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={[styles.text, styles.bold]}>
          {section.startDateWeekDay}
        </Text>
        <Text style={styles.text}> - {section.startDateMonthDay}</Text>
      </View>
      <Text style={styles.name}>{section.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  name: {
    color: secondaryTextColor,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    height: 50,
    backgroundColor: backgroundColor,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    marginRight: 10,
    marginLeft: 10,
  },
})

export default Header
