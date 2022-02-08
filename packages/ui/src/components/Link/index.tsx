import React, { useCallback } from 'react'
import { Link, IconProps } from 'react-feather'
import styled from 'styled-components/macro'

const StyledLink = styled(Link)<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export function WrappedLink({ to, ...rest }: { to: string | undefined } & IconProps) {
  const jumpTo = useCallback(() => {
    to && window.open(to, '_blank')
  }, [to])
  return <StyledLink {...rest} disabled={!to} onClick={jumpTo}></StyledLink>
}
