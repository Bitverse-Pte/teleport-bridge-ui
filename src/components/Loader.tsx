import React, { CSSProperties } from 'react'
import * as PropTypes from 'prop-types'
import styled, { DefaultTheme, keyframes } from 'styled-components'
import { TransitionSpinner } from './Spinner'
import { useTheme } from 'hooks'
import { Color, Colors } from 'theme/styled'

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  // 5% {
  //   transform: scale(1.0);
  // }
  50% {
    transform: rotate(180deg);
  }
  // 95% {
  //   transform: scale(1.0);
  // }
  100% {
    transform: rotate(360deg);
  }
`

interface ILoaderStyleProps {
  size?: number
}

interface ILoaderProps extends ILoaderStyleProps {
  color?: keyof Omit<Colors, 'darkMode'>
}

const SLoader = styled.svg<ILoaderStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  animation: ${load} 1s infinite cubic-bezier(0.25, 0, 0.75, 1);
  transform: translateZ(0);
`

const Loader = ({ size = 40, color, show, ...rest }: { size: string | number; show: boolean; style?: CSSProperties } & ILoaderProps) => {
  const theme = useTheme()
  return <TransitionSpinner show={show} color={color ? theme[color] : color} size={size + 'px'} {...rest} />
  // return <BaseSpinner /* viewBox="0 0 186 187"  */ color={color ? theme[color] : undefined} size={size + 'px'} />
}

export default Loader
