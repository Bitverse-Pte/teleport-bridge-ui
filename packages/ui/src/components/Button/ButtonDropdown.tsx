import React from 'react'
import { RowBetween } from 'components/Row'
import { ChevronDown } from 'react-feather'
import CssValueParser from 'parse-unit'
import { ButtonLight, BaseButtonProps } from '.'

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
    <ButtonLight {...rest} padding="10px" disabled={disabled}>
      <RowBetween>{children}</RowBetween>
      <ChevronDown style={{ position: 'absolute', right }} size={24} />
    </ButtonLight>
  )
}
