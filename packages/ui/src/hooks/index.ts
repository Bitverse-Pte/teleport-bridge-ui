import { RootState } from './../store/store'
import { Dispatch } from 'store/store'
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux'

export function useDispatch() {
  return useReduxDispatch<Dispatch>()
}

export function useProviderController() {
  return useSelector((state: RootState) => state.application)
}
