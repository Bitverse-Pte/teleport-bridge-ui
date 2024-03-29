import React, { HTMLAttributes } from 'react'
import * as blockies from 'blockies-ts'
import styled from 'styled-components'
import Image from 'components/Image'
import { size } from 'lodash'

interface IBlockieStyleProps {
  size?: number
}

interface IBlockieProps extends IBlockieStyleProps {
  address: string
}

const SBlockieWrapper = styled.div<IBlockieStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  span {
    border-radius: 6px;
  }
  overflow: hidden;
  & img {
    width: 100%;
  }
`

const Blockie = (props: IBlockieProps & HTMLAttributes<HTMLDivElement>) => {
  const seed = props.address.toLowerCase() || ''
  const imgUrl = blockies
    .create({
      seed,
    })
    .toDataURL()
  return (
    <SBlockieWrapper {...props} size={props.size}>
      <Image src={imgUrl} alt={props.address} width={props.size} height={props.size} />
    </SBlockieWrapper>
  )
}

Blockie.defaultProps = {
  address: '0x0000000000000000000000000000000000000000',
  size: 30,
}

export default Blockie
