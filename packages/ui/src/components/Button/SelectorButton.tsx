import React from 'react'
import { ChevronDown } from 'react-feather'
import CssValueParser from 'parse-unit'
import { DefaultButtonRadius } from 'theme'
import { BaseButtonProps, ButtonLight } from '.'
import { SelectorLabel } from 'components/Label'
import { SelectorLogo } from 'components/Logo'

export default function SelectorButton({ interactive = false, logoSrc, labelContent, $borderRadius, ...rest }: { interactive?: boolean; logoSrc?: string; labelContent: string } & BaseButtonProps) {
  const [digit, unit] = CssValueParser($borderRadius ?? DefaultButtonRadius)
  const left = `${digit / 2}${unit ?? 'px'}`
  const right = left
  return (
    <ButtonLight maxWidth="10rem" {...rest}>
      {logoSrc && <SelectorLogo interactive={interactive} left={left} src={logoSrc} />}
      <SelectorLabel>{labelContent}</SelectorLabel>
      <ChevronDown style={{ position: 'absolute', right: right }} size={24} />
    </ButtonLight>
  )
}
