import React, {createContext, useContext, useReducer, useEffect} from 'react'
import {Notifications} from 'react-native-notifications'
import AsyncStorage from '@react-native-community/async-storage'

const matchFavoritesCacheKey = 'matchFavorites'

const MatchFavoritesStateContext = createContext()
const MatchFavoritesDispatchContext = createContext()

async function saveFavoritesInStorage(ids) {
  try {
    await AsyncStorage.setItem(matchFavoritesCacheKey, JSON.stringify(ids))
  } catch (e) {
    console.log(
      '[matchFavorites][saveFavoritesInStorage] error when saving matchesFavorites',
      e,
    )
  }
}

function addNotification(match) {
  const {id, team1, team2, startTime} = match

  Notifications.postLocalNotification({
    body: 'Starting soon',
    title: `${team1.code} VS ${team2.code}`,
    sound: 'chime.aiff',
    silent: false,
    userInfo: {
      type: 'matchStartingSoon',
      matchId: id,
    },
    fireDate: startTime.toISOString(),
  })
}

function matchFavoritesReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const match = {
        id: action.match.id,
        startTime: action.match.startTime,
      }
      const newState = [...state, match]
      saveFavoritesInStorage(newState)
      addNotification(action.match)
      return newState
    }
    case 'remove': {
      const newState = state.filter(match => match.id !== action.match.id)
      saveFavoritesInStorage(newState)
      return newState
    }
    case 'init': {
      return action.ids
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useMatchFavorites = () => {
  const [state, dispatch] = useReducer(matchFavoritesReducer, [])

  useEffect(() => {
    async function getMatchFavorites() {
      try {
        const value = await AsyncStorage.getItem(matchFavoritesCacheKey)
        const data = JSON.parse(value)

        if (!data) {
          return []
        }

        return data
      } catch (e) {
        console.log('[matchFavorites] Failed to get favorites from storage')
      }
    }

    getMatchFavorites().then(data => dispatch({type: 'init', ids: data}))
  })

  return {state, dispatch}
}

function MatchFavoritesProvider({children}) {
  const {state, dispatch} = useMatchFavorites()

  return (
    <MatchFavoritesStateContext.Provider value={state}>
      <MatchFavoritesDispatchContext.Provider value={dispatch}>
        {children}
      </MatchFavoritesDispatchContext.Provider>
    </MatchFavoritesStateContext.Provider>
  )
}

function useMatchFavoritesState() {
  const context = useContext(MatchFavoritesStateContext)

  if (context === undefined) {
    throw new Error(
      'useMatchFavoritesState must be used within a MatchFavoritesProvider',
    )
  }

  return context
}

function useMatchFavoritesDispatch() {
  const context = useContext(MatchFavoritesDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useMatchFavoritesDispatch must be used within a MatchFavoritesProvider',
    )
  }

  return context
}

export {
  MatchFavoritesProvider,
  useMatchFavoritesState,
  useMatchFavoritesDispatch,
}
