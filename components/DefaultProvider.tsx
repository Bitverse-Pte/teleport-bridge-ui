import { createWeb3ReactRoot } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { NetworkContextName } from 'constants/misc'
import { ReactElement } from 'react'

const Web3ReactProviderDefault = createWeb3ReactRoot(NetworkContextName)

const Web3ReactProviderDefaultSSR = ({
  children,
  getLibrary,
}: {
  children: ReactElement
  getLibrary: (provider?: any, connector?: AbstractConnector | undefined) => any
}) => {
  return (
    <Web3ReactProviderDefault getLibrary={getLibrary}>
      {children}
    </Web3ReactProviderDefault>
  )
}

export default Web3ReactProviderDefaultSSR
