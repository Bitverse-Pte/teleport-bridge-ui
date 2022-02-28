import React from 'react'
import styled from 'styled-components'
import logo from 'public/logo.svg'
import { fonts, colors } from 'theme/styles'
import Image from 'next/image'

const SBannerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 24vw;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
  height: 100%;
  & span {
    color: rgb(${colors.lightBlue});
    font-weight: ${fonts.weight.bold};
    font-size: ${fonts.size.h5};
    margin-left: 12px;
  }
`

const SBanner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  & > span:first-of-type {
    top: 50%;
    transform: translateY(-50%);
  }
`

const Banner = () => (
  <SBannerWrapper>
    <SBanner>
      <Image src={logo} quality={100} alt="" />
    </SBanner>
    {/* <img src={logo} alt={'Icon'} /> */}
    {/* <span>{''}</span> */}
  </SBannerWrapper>
)

export default Banner
