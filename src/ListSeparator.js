import React from 'react'
import {View} from 'react-native'
import {borderColor} from './colors'

const ListSeparator = () => (
  <View
    style={{
      borderTopWidth: 1,
      borderTopColor: borderColor,
      marginLeft: 10,
      marginRight: 10,
    }}
  />
)

export default ListSeparator
