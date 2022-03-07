import React from 'react'
import { HorizontalCenterRow } from 'components/Row'
import { ButtonLight, BaseButtonProps } from '.'

export default function ButtonDropdown({ disabled = false, children, $borderRadius, ...rest }: BaseButtonProps) {
  /*  let right = '12px'
  if ($borderRadius) {
    const [digit, unit] = CssValueParser($borderRadius)
    right = `${digit / 2}`
    if (unit) {
      right += unit
    }
  } */

  return (
    <ButtonLight {...rest} disabled={disabled}>
      <HorizontalCenterRow>{children}</HorizontalCenterRow>
      {/*  <Flex height="24px" width="24px">
        <ChevronDown size={24} />
      </Flex> */}
    </ButtonLight>
  )
}
