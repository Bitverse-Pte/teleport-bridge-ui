import React from 'react'
import * as PropTypes from 'prop-types'
import { Icon } from '.'
import erc20 from 'assets/erc20.svg'

export const ERC20Icon = (props: any) => {
  const src = `https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/${props.contractAddress.toLowerCase()}.png`
  return <Icon src={src} fallback={erc20} />
}

ERC20Icon.propTypes = {
  contractAddress: PropTypes.string,
  size: PropTypes.number,
}

ERC20Icon.defaultProps = {
  contractAddress: null,
  size: 20,
}
