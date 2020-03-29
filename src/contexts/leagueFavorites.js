import React, {createContext, useContext, useReducer, useEffect} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

const leagueFavoritesCacheKey = 'leagueFavorites'

const LeagueFavoritesContext = createContext()

async function saveFavoritesInStorage(ids) {
  try {
    await AsyncStorage.setItem(leagueFavoritesCacheKey, JSON.stringify(ids))
  } catch (e) {
    console.log(
      '[leagueFavorites][saveFavoritesInStorage] error when saving matchesFavorites',
      e,
    )
  }
}

function leagueFavoritesReducer(state, action) {
  console.log({action, state})
  switch (action.type) {
    case 'add': {
      const newState = [...state, action.leagueId]
      saveFavoritesInStorage(newState)
      return newState
    }
    case 'remove': {
      const newState = state.filter(leagueId => leagueId !== action.leagueId)
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

const useLeagueFavorites = () => {
  const [state, dispatch] = useReducer(leagueFavoritesReducer, [])

  return {state, dispatch}
}

function LeagueFavoritesProvider({children}) {
  const {state, dispatch} = useLeagueFavorites()

  useEffect(() => {
    async function getLeagueFavorites() {
      try {
        const value = await AsyncStorage.getItem(leagueFavoritesCacheKey)
        const data = JSON.parse(value)

        if (!data) {
          return ['98767991302996019', '98767991299243165']
        }

        return data
      } catch (e) {
        console.log('[matchFavorites] Failed to get favorites from storage')
      }
    }

    getLeagueFavorites().then(data => dispatch({type: 'init', ids: data}))
  }, [])

  return (
    <LeagueFavoritesContext.Provider value={{state, dispatch}}>
      {children}
    </LeagueFavoritesContext.Provider>
  )
}

function useLeagueFavoritesContext() {
  const context = useContext(LeagueFavoritesContext)

  if (context === undefined) {
    throw new Error(
      'useLeagueFavorites must be used within a LeagueFavoritesProvider',
    )
  }

  return context
}

export {LeagueFavoritesProvider, useLeagueFavoritesContext}
