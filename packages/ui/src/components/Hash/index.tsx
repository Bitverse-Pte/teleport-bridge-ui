import React, { useCallback, useState, useEffect } from 'react'
import { Copy, CheckCircle } from 'react-feather'
import { Textfit } from 'react-textfit'
import styled from 'styled-components/macro'
import { useTransition, config, animated, useSpringRef } from '@react-spring/web'
import { Text, Flex } from 'rebass'
import { infoNoti } from 'helpers/notifaction'

const ColorfulText = styled(Text)<{ color?: string }>`
  font-style: normal;
  font-size: 1.25rem;
  line-height: 1.625rem;
  text-transform: capitalize;
  color: ${({ color }) => color ?? '#ffffff'};
`

export function Hash({ hash, copyable = false, color, ellipsis = false, showCounts = 8, ...rest }: { showCounts?: number; hash: string; color?: string; ellipsis?: boolean; copyable?: boolean }) {
  const [isCopied, setIsCopied] = useState(false)
  const coptToClipBoard = useCallback(() => {
    if (hash) {
      navigator.clipboard.writeText(hash).then(() => {
        // infoNoti(`${hash.substring(0, showCounts)}...${hash.substring(hash.length - showCounts, hash.length)} has been copied to your clipboard.`)
        setIsCopied(true)
      })
    }
  }, [hash])
  const transRef = useSpringRef()
  const transitions = useTransition(isCopied, {
    // from: { opacity: 1 },
    // to: { opacity: 0 },  const transRef = useSpringRef()
    ref: transRef,
    keys: null,
    config: { ...config.gentle, duration: 300 },
    from: { opacity: 0 /* backgroundColor: '#00c6a9', color: 'white'  */ /* transform: 'translate3d(0,0,100%)' */ },
    enter: { opacity: 1 /* , backgroundColor: '#2B1010', color: '#D25958', border: '1px solid #D25958', boxSizing: 'border-box' */ },
    leave: { opacity: 0 /*  transform: 'translate3d(0,0,-50%)' */ },
    // config: config.gentle,
  })

  useEffect(() => {
    transRef.start()
    return () => {
      transRef.stop()
    }
  }, [isCopied])
  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, 1200)

      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [isCopied])
  return (
    <Flex style={{ position: 'relative' }}>
      <ColorfulText color={color} paddingRight="2rem">
        <Textfit max={20} min={2} mode="single">
          {ellipsis ? `${hash.substring(0, showCounts)}...${hash.substring(hash.length - showCounts, hash.length)}` : hash}
        </Textfit>
      </ColorfulText>
      {copyable &&
        hash &&
        transitions((styles, item) => {
          return (
            <>
              {!item ? (
                <animated.div style={{ ...styles, height: '1.5rem', width: '1.5rem', position: 'absolute', right: 0 }} onClick={coptToClipBoard}>
                  <Copy size={'1.5rem'} color="gray" cursor={'pointer'} />
                </animated.div>
              ) : (
                <animated.div style={{ ...styles, height: '1.5rem', width: '1.5rem', position: 'absolute', right: 0 }}>
                  <CheckCircle size={'1.5rem'} color="#83F2C4" cursor={'default'} />
                </animated.div>
              )}
            </>
          )
        })}
    </Flex>
  )
}
