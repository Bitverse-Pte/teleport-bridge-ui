import React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

interface IColumnStyleProps {
  spanHeight: boolean
  maxWidth: number
  center: boolean
}

interface IColumnProps extends IColumnStyleProps {
  children: React.ReactNode
}

const SColumn = styled.div<IColumnStyleProps>`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`

const Column = (props: IColumnProps) => {
  const { children, spanHeight, maxWidth, center } = props
  return (
    <SColumn {...props} spanHeight={spanHeight} maxWidth={maxWidth} center={center}>
      {children}
    </SColumn>
  )
}

Column.propTypes = {
  children: PropTypes.node.isRequired,
  spanHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  center: PropTypes.bool,
}

Column.defaultProps = {
  spanHeight: false,
  maxWidth: 600,
  center: false,
}

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

export default Column
