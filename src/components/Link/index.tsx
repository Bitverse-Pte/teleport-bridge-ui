import React, { MouseEventHandler, useCallback } from 'react'
import { Link, IconProps } from 'react-feather'
import { Box } from 'rebass'
import styled from 'styled-components'

const StyledLink = styled(Link)<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export function WrappedLink({ to, onClick, ...rest }: { to: string | undefined; onClick?: MouseEventHandler | undefined } & IconProps) {
  const jumpTo = useCallback(() => {
    to && window.open(to, '_blank')
  }, [to])
  return (
    <Box onClick={onClick}>
      <StyledLink {...rest} disabled={!to} onClick={jumpTo}></StyledLink>
    </Box>
  )
}
