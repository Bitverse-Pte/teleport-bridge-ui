import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Flex, FlexProps, Text } from 'rebass'
import { RootState } from 'store'
import styled, { css } from 'styled-components'
import { Text2, Text3 } from 'components/Text'
import { HelpIcon } from 'components/Icon/HelpIcon'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'
import { TransitionSpinnerMask } from 'components/Spinner'

const EstimationRow = styled(Flex)`
  justify-content: space-between;
`

export function EstimationBlock({ ...rest }: FlexProps) {
  const { /* estimation, srcChainId, destChainId, bridgePairs, availableChains, */ selectedTokenName, estimationUpdating } = useSelector((state: RootState) => {
    const { /* estimation, srcChainId, destChainId, bridgePairs, availableChains, */ selectedTokenName, estimationUpdating } = state.application
    return { /* estimation, srcChainId, destChainId, bridgePairs, availableChains, */ selectedTokenName, estimationUpdating }
  })
  /* const srcChain = useMemo(() => {
    return availableChains.get(srcChainId)
  }, [srcChainId, availableChains])
  const destChain = useMemo(() => {
    return availableChains.get(destChainId)
  }, [destChainId, availableChains]) */
  const [amount, setAmount] = useState<string | number>('')
  useEffect(() => {
    const input = document.getElementById('fromValueInput')
    if (input) {
      input.addEventListener('keyup', function () {
        setAmount(parseFloat((input as HTMLInputElement).value))
      })
    }
  }, [])
  return (
    <Flex
      css={css`
        color: white;
        padding: 2.5rem 1.6rem;
        width: 80%;
        height: 10rem;
        background: rgba(0, 0, 0, 0.3);
        border: solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        backdrop-filter: blur(0.125rem);
        border-radius: 0.5rem;
        justify-content: center;
        flex-direction: column;
      `}
      {...rest}
    >
      <TransitionSpinnerMask show={estimationUpdating} />
      {/*    <EstimationRow>
        <Text2>Rate</Text2>
        <Text3>
          {isNaN(estimation.rate) ? (
            '-'
          ) : (
            <>
              1&nbsp;{selectedTokenName}&nbsp;on&nbsp;
              <Icon src={srcChain?.icon} fallback={erc20} />
              &nbsp;≈&nbsp;
              {estimation.rate}&nbsp;{selectedTokenName}&nbsp;on&nbsp;
              <Icon src={destChain?.icon} fallback={erc20} />
            </>
          )}
        </Text3>
      </EstimationRow> */}
      <EstimationRow>
        <Text2>
          Fee&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>
          {amount ? (
            <>
              {0}&nbsp;{selectedTokenName}
            </>
          ) : (
            <>-</>
          )}
        </Text3>
      </EstimationRow>
      <EstimationRow>
        <Text2>
          Min Received&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>
          {amount ? (
            <>
              {amount}&nbsp;{selectedTokenName}
            </>
          ) : (
            <>-</>
          )}
        </Text3>
      </EstimationRow>
      {/*   <EstimationRow>
        <Text2>
          Slippage&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>{estimation.slippage ?? '-'}&nbsp;%</Text3>
      </EstimationRow> */}
    </Flex>
  )
}
