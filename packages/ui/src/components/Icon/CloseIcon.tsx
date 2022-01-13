import React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'
import { XCircle } from 'react-feather'

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

export const CircledCloseIcon = styled(XCircle)`
  position: absolute;
  transform: translate(-10px, 10px);
  color: ${({ theme }) => theme.primary1};
  path {
    stroke: ${({ theme }) => theme.primary1};
  }
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
