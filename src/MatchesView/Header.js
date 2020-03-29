import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {backgroundColor, borderColor} from '../colors'

const Header = ({section}) => {
  return (
    <View style={styles.container}>
      <Text>
        <Text style={[styles.text, styles.bold]}>
          {section.startDateWeekDay}
        </Text>
        <Text style={styles.text}> - {section.startDateMonthDay}</Text>
      </Text>
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
  container: {
    height: 50,
    backgroundColor: backgroundColor,
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    marginRight: 10,
    marginLeft: 10,
  },
})

export default Header
