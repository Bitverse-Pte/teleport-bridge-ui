import React from 'react'
import { HorizontalCenterRow } from 'components/Row'
import { ChevronDown } from 'react-feather'
import CssValueParser from 'parse-unit'
import { ButtonLight, BaseButtonProps } from '.'
import { Flex } from 'rebass'

export default function ButtonDropdown({ disabled = false, children, $borderRadius, ...rest }: BaseButtonProps) {
  let right = '12px'
  if ($borderRadius) {
    const [digit, unit] = CssValueParser($borderRadius)
    right = `${digit / 2}`
    if (unit) {
      right += unit
    }
  }

  return (
    <ButtonLight {...rest} padding="6px" disabled={disabled}>
      <HorizontalCenterRow>{children}</HorizontalCenterRow>
      <Flex height="24px" width="24px">
        <ChevronDown /*  style={{ position: 'absolute', right }}  */ size={24} />
      </Flex>
    </ButtonLight>
  )
}
