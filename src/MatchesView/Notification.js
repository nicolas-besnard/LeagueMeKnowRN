import React from 'react'
import {Image, TouchableWithoutFeedback} from 'react-native'
import {Notifications} from 'react-native-notifications'
import {
  useMatchFavoritesDispatch,
  useMatchFavoritesState,
} from '@contexts/matchFavorites'

const Notification = ({match}) => {
  const matchFavoritesDispatch = useMatchFavoritesDispatch()
  const matchFavoritesState = useMatchFavoritesState()

  const matchIsInFavoris = matchFavoritesState.find(
    (favoriteMatch) => favoriteMatch.id === match.id,
  )

  if (matchIsInFavoris) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Notifications.registerRemoteNotifications()
          matchFavoritesDispatch({type: 'remove', match})
        }}>
        <Image source={require('../../images/bell.png')} />
      </TouchableWithoutFeedback>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Notifications.registerRemoteNotifications()
        matchFavoritesDispatch({type: 'add', match})
      }}>
      <Image source={require('../../images/bell-off.png')} />
    </TouchableWithoutFeedback>
  )
}

export default Notification
