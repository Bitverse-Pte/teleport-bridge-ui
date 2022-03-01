import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { Text1 } from 'components/Text'
import Tooltip, { TooltipProps } from 'components/Tooltip'
import { TextProps } from 'rebass'

export function TooltippedAmount({ AmountText, amount, direction, ...rest }: { AmountText: React.FunctionComponent<TextProps>; amount: string; direction?: string } & Omit<TooltipProps, 'show' | 'children' | 'text'>) {
  const [show, setShow] = useState(false)
  const amountTextRef = useRef<any>()
  const open = useCallback(() => {
    if (amountTextRef.current && amountTextRef.current.offsetWidth < amountTextRef.current.scrollWidth) {
      setShow(true)
    }
  }, [amountTextRef])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <Tooltip text={amount} {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        <AmountText ref={amountTextRef}>
          {direction ? (
            <>
              {direction}&nbsp;{amount}
            </>
          ) : (
            <>{amount}</>
          )}
        </AmountText>
      </div>
    </Tooltip>
  )
}
