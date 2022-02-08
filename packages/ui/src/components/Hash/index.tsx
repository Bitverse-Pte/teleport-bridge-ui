import React, { useCallback } from 'react'
import { Copy } from 'react-feather'
import { Textfit } from 'react-textfit'
import styled from 'styled-components/macro'
import { Text, Flex } from 'rebass'
import { infoNoti } from 'helpers/notifaction'

const ColorfulText = styled(Text)<{ color?: string }>`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-size: 1.25rem;
  line-height: 1.625rem;
  text-transform: capitalize;
  color: ${({ color }) => color ?? '#ffffff'};
`

export function Hash({ hash, copyable = false, color, ellipsis = false, ...rest }: { hash: string; color?: string; ellipsis?: boolean; copyable?: boolean }) {
  const coptToClipBoard = useCallback(() => {
    hash &&
      navigator.clipboard.writeText(hash).then(() => {
        infoNoti(`${hash.substring(0, 8)}...${hash.substring(hash.length - 8, hash.length)} has been copied to your clipboard.`)
      })
  }, [hash])
  return (
    <Flex>
      <ColorfulText color={color}>
        <Textfit max={20} min={2} mode="single">
          {ellipsis ? `${hash.substring(0, 8)}...${hash.substring(hash.length - 8, hash.length)}` : hash}
        </Textfit>
      </ColorfulText>

      {copyable && hash && (
        <>
          &nbsp;
          <Copy onClick={coptToClipBoard} color="gray" cursor={'pointer'} />
        </>
      )}
    </Flex>
  )
}
