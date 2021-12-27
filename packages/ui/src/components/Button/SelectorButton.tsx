import React from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'react-feather'
import CssValueParser from 'parse-unit'
import { DefaultButtonRadius } from 'theme'
import { BaseButtonProps, ButtonLight } from '.'
import { SelectorLogo, SelectorLabel } from 'components/Common'

export default function SelectorButton({ interactive = false, logoSrc, labelContent, $borderRadius, ...rest }: { interactive?: boolean; logoSrc?: string; labelContent: string } & BaseButtonProps) {
  const [digit, unit] = CssValueParser($borderRadius ?? DefaultButtonRadius)
  const left = `${digit / 2}${unit ?? 'px'}`
  const right = left
  return (
    <ButtonLight maxWidth="15rem" {...rest}>
      {logoSrc && <SelectorLogo interactive={interactive} left={left} src={logoSrc} />}
      <SelectorLabel>{labelContent}</SelectorLabel>
      <ChevronDown style={{ position: 'absolute', right: right }} size={24} />
    </ButtonLight>
  )
}
