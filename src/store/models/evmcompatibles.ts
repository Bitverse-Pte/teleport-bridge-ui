/*
activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>;
setError: (error: Error) => void;
deactivate: () => void;
connector?: AbstractConnector;
library?: T;
chainId?: number;
account?: null | string;
active: boolean;
error?: Error; 
*/
import { createModel } from '@rematch/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { AbstractConnector } from '@web3-react/abstract-connector'

import type { RootModel } from '.'

export const initialState: Web3ReactContextInterface = {
  activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => {
    return Promise.reject('not implemented!')
  },
  setError: (error: Error) => {
    throw new Error('not implemented!')
  },
  deactivate: () => {
    throw new Error('not implemented!')
  },
  connector: undefined,
  library: undefined,
  chainId: undefined,
  account: undefined,
  active: false,
  error: undefined,
}
export const evmCompatibles = createModel<RootModel>()({
  state: initialState,
  reducers: {
    setActivate(state, activate) {
      return {
        ...state,
        activate,
      }
    },
    setSetError(state, setError) {
      return {
        ...state,
        setError,
      }
    },
    setDeactivate(state, deactivate) {
      return {
        ...state,
        deactivate,
      }
    },
    setConnector(state, connector) {
      return {
        ...state,
        connector,
      }
    },
    setLibrary(state, library) {
      return {
        ...state,
        library,
      }
    },
    setChainId(state, chainId) {
      return {
        ...state,
        chainId,
      }
    },
    setAccount(state, account) {
      return {
        ...state,
        account,
      }
    },
    setActive(state, active) {
      return {
        ...state,
        active,
      }
    },
    setErrorObj(state, error) {
      return {
        ...state,
        error,
      }
    },
  },
})
