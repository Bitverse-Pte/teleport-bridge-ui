import React from 'react'
import styled from 'styled-components'
import logo from 'assets/logo.svg'
import { fonts, colors } from '../styles'

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
  background: url(${logo}) no-repeat center;
`

const Banner = () => (
  <SBannerWrapper>
    <SBanner />
    {/* <img src={logo} alt={'Icon'} /> */}
    {/* <span>{''}</span> */}
  </SBannerWrapper>
)

export default Banner
