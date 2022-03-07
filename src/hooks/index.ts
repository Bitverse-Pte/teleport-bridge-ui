import { useDispatch as useReduxDispatch, useSelector } from 'react-redux'
import { RootState } from './../store/store'
import { Dispatch } from 'store/store'

export function useDispatch() {
  return useReduxDispatch<Dispatch>()
}

export function useProviderController() {
  return useSelector((state: RootState) => state.application)
}

export * from './useInterval'
export * from './useTheme'
export * from './web3'
