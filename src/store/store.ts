// import { init, RematchDispatch, RematchRootState, RematchStore } from '@rematch/core'
// import { useMemo } from 'react'
// import { models, RootModel } from './models'
// import { IAppState, initialState } from './models/application'
// export let store: RematchStore<RootModel, Record<string, never>> | undefined /* = init({
//   models,
// }) */
// export type Store = typeof store
// export type Dispatch = RematchDispatch<RootModel>
// export type RootState = RematchRootState<RootModel>

// // let store

// export const initStore = (initialState: IAppState) =>
//   init({
//     models,
//     redux: {
//       initialState,
//     },
//   })

// export const initializeStore = (preloadedState = initialState) => {
//   let _store = store ?? initStore(preloadedState)

//   // After navigating to a page with an initial Redux state, merge that state
//   // with the current state in the store, and create a new store
//   if (preloadedState && store) {
//     _store = initStore({
//       ...store.getState(),
//       ...preloadedState,
//     })
//     // Reset the current store
//     store = undefined
//   }

//   // For SSG and SSR always create a new store
//   if (typeof window === 'undefined') return _store
//   // Create the store once in the client
//   if (!store) store = _store

//   return _store
// }

// export function useStore(initialState: IAppState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }

import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'
export const store = init({
  models,
})
export const initializeStore = (initialState?: RootModel): Store => {
  return store
}

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
