import React, {createContext, useContext, useReducer, useEffect} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import type {ReactNode, Dispatch} from 'react'
import type {LeagueIds} from 'MatchCache'

const leagueFavoritesCacheKey = 'leagueFavorites'

type State = LeagueIds
type Action =
  | {type: 'add'; leagueId: string}
  | {type: 'remove'; leagueId: string}
  | {type: 'init'; ids: LeagueIds}

interface Context {
  state: LeagueIds
  dispatch: Dispatch<Action>
}

const defaultContext = {
  state: [],
  dispatch: (): void => {},
}

const LeagueFavoritesContext = createContext<Context>(defaultContext)

async function saveFavoritesInStorage(ids: LeagueIds) {
  try {
    await AsyncStorage.setItem(leagueFavoritesCacheKey, JSON.stringify(ids))
  } catch (e) {
    console.log(
      '[leagueFavorites][saveFavoritesInStorage] error when saving matchesFavorites',
      e,
    )
  }
}

function leagueFavoritesReducer(state: State, action: Action) {
  console.log({action, state})
  switch (action.type) {
    case 'add': {
      const newState = [...state, action.leagueId]
      saveFavoritesInStorage(newState)
      return newState
    }
    case 'remove': {
      const newState = state.filter((leagueId) => leagueId !== action.leagueId)
      saveFavoritesInStorage(newState)
      return newState
    }
    case 'init': {
      return action.ids
    }
  }
}

const useLeagueFavorites = () => {
  const [state, dispatch] = useReducer(leagueFavoritesReducer, [])

  return {state, dispatch}
}

function LeagueFavoritesProvider({children}: {children: ReactNode}) {
  const {state, dispatch} = useLeagueFavorites()

  useEffect(() => {
    async function getLeagueFavorites(): Promise<LeagueIds> {
      try {
        const value = await AsyncStorage.getItem(leagueFavoritesCacheKey)
        const data = JSON.parse(value || '[]')

        if (!data) {
          return ['98767991302996019', '98767991299243165']
        }

        return data
      } catch (e) {
        console.log('[matchFavorites] Failed to get favorites from storage')
        return []
      }
    }

    getLeagueFavorites().then((data) => dispatch({type: 'init', ids: data}))
  }, [])

  return (
    <LeagueFavoritesContext.Provider value={{state, dispatch}}>
      {children}
    </LeagueFavoritesContext.Provider>
  )
}

function useLeagueFavoritesContext(): Context {
  const context: Context = useContext(LeagueFavoritesContext)

  if (context === undefined) {
    throw new Error(
      'useLeagueFavorites must be used within a LeagueFavoritesProvider',
    )
  }

  return context
}

export {LeagueFavoritesProvider, useLeagueFavoritesContext}
