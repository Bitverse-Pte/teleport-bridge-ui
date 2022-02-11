import React, { useEffect, useState, useMemo } from 'react'
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
  const { /* estimation, availableChains, */ srcChainId, destChainId, bridgePairs, selectedTokenName, estimationUpdating } = useSelector((state: RootState) => {
    const { /* estimation, availableChains, */ srcChainId, destChainId, bridgePairs, selectedTokenName, estimationUpdating } = state.application
    return { /* estimation, availableChains, */ srcChainId, destChainId, bridgePairs, selectedTokenName, estimationUpdating }
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
    const onInput = function () {
      setAmount(parseFloat((input as HTMLInputElement).value))
    }
    if (input) {
      setAmount(parseFloat((input as HTMLInputElement).value))
      input.addEventListener('keyup', onInput)
    }
    return () => {
      if (input) {
        input?.removeEventListener('keyup', onInput)
      }
    }
  }, [])
  const selectedToken = useMemo(() => {
    const key = `${srcChainId}-${destChainId}`
    if (bridgePairs.has(key)) {
      const targetTokenPair = bridgePairs.get(key)?.tokens.find((e) => e.name === selectedTokenName || e.srcToken.name === selectedTokenName || e.destToken.name === selectedTokenName)
      if (targetTokenPair) {
        return targetTokenPair?.srcToken
      }
    }
  }, [srcChainId, destChainId, bridgePairs, selectedTokenName])

  return (
    <Flex
      css={css`
        color: white;
        padding: 1.6rem 1.6rem;
        width: 80%;
        height: 'fit-content';
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
          {amount && selectedToken ? (
            <>
              {0}&nbsp;{selectedToken?.symbol}
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
          {amount && selectedToken ? (
            <>
              {amount}&nbsp;{selectedToken?.symbol}
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
