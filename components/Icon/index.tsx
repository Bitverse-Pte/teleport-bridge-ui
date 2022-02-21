import React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
interface IIconStyleProps {
  size: number
}

export const SIcon = styled.img<IIconStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`

export const Icon = (props: any) => {
  const { src, fallback, size } = props
  return <SIcon {...props} src={src} size={size} onError={(event: any) => (event.target.src = fallback)} />
}

Icon.propTypes = {
  src: PropTypes.string,
  fallback: PropTypes.string,
  size: PropTypes.number,
}

Icon.defaultProps = {
  src: null,
  fallback: null,
  size: 20,
}

export * from './AlertIcon'
export * from './CloseIcon'
export * from './ERC20Icon'
export * from './HelpIcon'
