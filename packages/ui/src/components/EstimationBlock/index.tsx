import { Text2, Text3 } from 'components/Text'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Flex, FlexProps, Text } from 'rebass'
import { RootState } from 'store'
import styled, { css } from 'styled-components'
import { HelpIcon } from 'components/Icon/HelpIcon'
import { Icon } from 'components/Icon'
import erc20 from 'assets/erc20.svg'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'

const EstimationRow = styled(Flex)`
  justify-content: space-between;
`

export function EstimationBlock({ ...rest }: FlexProps) {
  const { estimation, srcChainId, destChainId, bridgePairs, availableChains, selectedTokenName } = useSelector((state: RootState) => {
    const { estimation, srcChainId, destChainId, bridgePairs, availableChains, selectedTokenName } = state.application
    return { estimation, srcChainId, destChainId, bridgePairs, availableChains, selectedTokenName }
  })
  const srcChain = useMemo(() => {
    return availableChains.get(srcChainId)
  }, [srcChainId, availableChains])
  const destChain = useMemo(() => {
    return availableChains.get(destChainId)
  }, [destChainId, availableChains])

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
      <EstimationRow>
        <Text2>Rate</Text2>
        <Text3>
          {isNaN(estimation.rate) ? (
            NaN
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
      </EstimationRow>
      <EstimationRow>
        <Text2>
          Fee&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>{estimation.fee}</Text3>
      </EstimationRow>
      <EstimationRow>
        <Text2>
          Min Received&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>{estimation.minReceived}</Text3>
      </EstimationRow>
      <EstimationRow>
        <Text2>
          Slippage&nbsp;
          <MouseoverTooltip text={<Text>transfer is free for your in test period</Text>}>
            <HelpIcon size={12} />
          </MouseoverTooltip>
        </Text2>
        <Text3>{estimation.slippage}</Text3>
      </EstimationRow>
    </Flex>
  )
}
