import React, { useCallback, useRef, useState } from 'react'
// import Tooltip, { TooltipProps } from 'components/Tooltip'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'
import { TextProps } from 'rebass'

export function TooltippedAmount({ AmountText, amount, direction, ...rest }: { AmountText: React.FunctionComponent<TextProps>; amount: string; direction?: string } & Omit<TooltipProps, 'show' | 'children' | 'text' | 'title'>) {
  return (
    <Tooltip {...rest} title={amount}>
      <AmountText>
        {direction ? (
          <>
            {direction}&nbsp;{amount}
          </>
        ) : (
          <>{amount}</>
        )}
      </AmountText>
    </Tooltip>
  )
}
